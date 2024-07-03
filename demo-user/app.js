const {
    ConnectionsModule,
    DidsModule,
    V2ProofProtocol,
    V2CredentialProtocol,
    ProofsModule,
    AutoAcceptProof,
    AutoAcceptCredential,
    CredentialsModule,
    WsOutboundTransport,
    Agent,
    HttpOutboundTransport,
    KeyType, ConnectionEventTypes, DidExchangeState, TypedArrayEncoder, ProofEventTypes, ProofState,
    DifPresentationExchangeProofFormatService, JsonLdCredentialFormatService, DidDocumentBuilder,
    getEd25519VerificationKey2018, W3cCredentialsModule, CredentialEventTypes, WebDidResolver, DidCommV1Service, ConsoleLogger,
    LogLevel
} = require('@credo-ts/core')
const {
    AnonCredsCredentialFormatService,
    AnonCredsModule,
    AnonCredsProofFormatService,
    LegacyIndyCredentialFormatService,
    LegacyIndyProofFormatService,
    V1CredentialProtocol,
    V1ProofProtocol, DataIntegrityCredentialFormatService,
} = require('@credo-ts/anoncreds')
const sys_config = require('config');
const QRCode = require('qrcode')
const prompt = require('prompt-sync')();

const {agentDependencies, HttpInboundTransport} = require('@credo-ts/node')
const {IndyVdrIndyDidResolver, IndyVdrAnonCredsRegistry, IndyVdrModule} = require('@credo-ts/indy-vdr')
const {indyVdr} = require('@hyperledger/indy-vdr-nodejs')
const {ariesAskar} = require('@hyperledger/aries-askar-nodejs')
const {AskarModule} = require('@credo-ts/askar')
const {anoncreds} = require('@hyperledger/anoncreds-nodejs')
const {AnonCredsRsModule} = require('@credo-ts/anoncreds')
const getGenesisTransaction = async (url) => {
    const response = await fetch(url)
    return await response.text()
}

let current_connection = {
    label: undefined,
    did: undefined,
    connection_id: undefined
}

const initializeUserAgentWeb = async (ledgerUrl, endPoint) => {

    const genesisTransactionsBCovrinTestNet = await getGenesisTransaction(ledgerUrl)

    const config = {
        label: 'SecureUserWallettttt',
        walletConfig: {
            id: sys_config.get('wallet.id'),//'SecureUserWalletNuovo',
            key: sys_config.get('wallet.key'),//'solidserver000000000000000000000',
        },
        endpoints: [endPoint],
        autoUpdateStorageOnStartup: true,
    }

    // A new instance of an agent is created here
    const agent = new Agent({
        config,
        dependencies: agentDependencies,
        modules: getAskarAnonCredsIndyModules(genesisTransactionsBCovrinTestNet)
    })


    // Register a simple `WebSocket` outbound transport - not needed
    agent.registerOutboundTransport(new WsOutboundTransport())

    // Register a simple `Http` outbound transport
    agent.registerOutboundTransport(new HttpOutboundTransport())

    // Register a simple `Http` inbound transport
    agent.registerInboundTransport(new HttpInboundTransport({port: 3006}))


    // Initialize the agent
    await agent.initialize()


    let did = "did:web:bboi.solidcommunity.net:public";
    try {

        let builder = new DidDocumentBuilder(did);
        const ed25519Key = await agent.wallet.createKey({
            keyType: KeyType.Ed25519,
            privateKey: TypedArrayEncoder.fromString(sys_config.get('wallet.seed_private_key'))
        })
        const ed25519VerificationMethod2018 = getEd25519VerificationKey2018({
            key: ed25519Key,
            id: `${did}#${ed25519Key.fingerprint}`,
            controller: did,
        })

        builder.addService(new DidCommV1Service({
            "id": "#inline-0",
            "serviceEndpoint": "http://localhost:3006",
            "type": "did-communication",
            "recipientKeys": [`${did}#${ed25519Key.fingerprint}`],
            "routingKeys": []
        }));

        builder.addVerificationMethod(ed25519VerificationMethod2018)
        builder.addAuthentication(ed25519VerificationMethod2018.id)
        builder.addAssertionMethod(ed25519VerificationMethod2018.id)
        console.log(JSON.stringify(builder.build()))

        await agent.dids.import({
            did,
            didDocument: builder.build(),
            options: {
                keyType: KeyType.Ed25519,
                privateKey: TypedArrayEncoder.fromString(sys_config.get('wallet.seed_private_key'))
            }
        })
    } catch {
        let didResp = await agent.dids.resolve(did);
        await agent.dids.resolveDidDocument(did)

        await agent.dids.update({
            did,
            didDocument: didResp.didDocument,
            overwrite: true,
            options: {
                keyType: KeyType.Ed25519,
                privateKey: TypedArrayEncoder.fromString(sys_config.get('wallet.seed_private_key'))
            }
        })
        let created_dids = await agent.dids.getCreatedDids({method: 'web', did: did});
        console.log("This is the User Wallet, it has this DID: " + created_dids[0].did);
    }


    return agent
}


async function startEverything() {
    console.log("Welcome to your wallet")
    const agent = await initializeUserAgentWeb(sys_config.get('wallet.ledger_url'), sys_config.get('wallet.endpoint'));
    await setUpListners(agent)
    let url_invitation = prompt("Insert the invitation URL to begin a communication: ")
    await agent.oob.receiveInvitationFromUrl(url_invitation);

}

async function setUpListners(agent) {
    agent.events.on(ConnectionEventTypes.ConnectionStateChanged, async ({payload}) => {
        console.log(payload);
        if (payload.connectionRecord.state === DidExchangeState.Completed) {
            //console.log("solo una volta");

            current_connection.id = payload.connectionRecord.id;
            current_connection.did = payload.connectionRecord.did;
            current_connection.label = payload.connectionRecord.theirLabel;
            current_connection.invitationDid = payload.connectionRecord.invitationDid;

            //console.log(payload.connectionRecord)
            agent.events.on(CredentialEventTypes.CredentialStateChanged, async ({payload}) => {
                //console.log(JSON.stringify(payload, undefined, 2));
                let status = payload.credentialRecord.state
                let cred_ex_id = payload.credentialRecord.id
                //console.log(status)
                if (current_connection.id === payload.credentialRecord.connectionId) {
                    if (status === "offer-received") {
                        console.log("You are going to receive these credentials: ");
                        let format_data = await agent.credentials.getFormatData(cred_ex_id);
                        let cred = format_data.offer.jsonld.credential;
                        console.log(JSON.stringify(cred, undefined, 2));
                        let resp = prompt("Do you want to accept them [y/n] ?")
                        if (resp === "y") {
                            await agent.credentials.acceptOffer({credentialRecordId: cred_ex_id})
                        } else {
                            console.log("Okay, I will decline this offer.")
                            await agent.credentials.declineOffer(cred_ex_id)
                        }
                    }
                    if (status === "credential-received") {
                        await agent.credentials.acceptCredential({credentialRecordId: cred_ex_id})
                    }
                }

            })



            agent.events.on(ProofEventTypes.ProofStateChanged, async ({payload}) => {

                let cred_ex_id = payload.proofRecord.id
                let status = payload.proofRecord.state
                if (status === ProofState.RequestReceived) {
                    console.clear()
                    console.log("I received the following VPR (Connection Record: " + current_connection.id + " with DID " + current_connection.invitationDid + " and label " + current_connection.label + "): ")

                    await agent.proofs.getFormatData(cred_ex_id).then(e => getACPRequest(e))
                    let resp = await agent.proofs.getCredentialsForRequest({
                        proofRecordId: cred_ex_id,
                    })
                    //let resp = await agent.proofs.selectCredentialsForRequest({
                    //    proofRecordId: cred_ex_id,
                    //})
                    //console.log(JSON.stringify(resp.proofFormats.presentationExchange.requirements[0].submissionEntry[0]))

                    let sel_cred = resp.proofFormats.presentationExchange.requirements[0].submissionEntry[0].verifiableCredentials;
                    for (let key in sel_cred) {
                        let item = sel_cred[key];
                        let credential = item.credentialRecord.credential;
                        let cred_ex_id = item.credentialRecord.id;
                        console.log("cred_ex_id: " + cred_ex_id);
                        console.log(JSON.stringify(credential, undefined, 2));
                    }
                    //console.log(JSON.stringify(resp.proofFormats.presentationExchange.credentials, undefined, 2));
                    //console.log(JSON.stringify(await agent.dids.resolve(current_connection.invitationDid)))
                    let resp_promp = prompt("Do you want me to generate the associated VP [y/n]: ")
                    if (resp_promp === "y") {
                        let cred_to_accept = prompt("Insert the cred_ex_id you want to share: ")
                        //console.log(JSON.stringify(await agent.proofs.getAll()))
                        //console.log(resp.proofFormats.presentationExchange.credentials)
                        //await agent.w3cCredentials.removeCredentialRecord('1fc3b91d-94aa-4265-bcca-a81ba6ff3bc5')
                        //agent.w3cCredentials.removeCredentialRecord(resp.id)
                        let test = await agent.w3cCredentials.getCredentialRecordById(cred_to_accept);
                        await agent.proofs.acceptRequest({
                            proofRecordId: cred_ex_id,
                            proofFormats: await agent.w3cCredentials.getCredentialRecordById(cred_to_accept),
                        })
                    } else {
                        console.log(await agent.proofs.declineRequest({
                            proofRecordId: cred_ex_id,
                            problemReportDescription: "I don't want to exchange these credentials."
                        }))

                    }
                }

            });
        }
    });


}


async function receiveConnectionRequest(invitationUrl) {
    this.agent.connections
    const {connectionRecord} = await this.agent.oob.receiveInvitationFromUrl(invitationUrl, {
        ourDid: 'did:web:bboi.solidcommunity.net:public'
    })
    return connectionRecord
}

startEverything();


const {randomUUID} = require("crypto");

function getACPRequest(e) {
    let presExchange = e.request.presentationExchange;
    let acpContext = presExchange.presentation_definition.requestACP;
    if (acpContext.type[0] !== "NonRepudiableACPContext") {
        console.log("ACP Policy:")
        console.log("For the target: " + acpContext.target + " with the client (app): " + acpContext.client)
    } else {

        console.log("ACP Policy:")
        console.log("For the target: " + acpContext.definedACPContext.target + " with the client (app): " + acpContext.definedACPContext.client)
    }
}
function getAskarAnonCredsIndyModules(genesisTransactionsBCovrinTestNet) {
    const legacyIndyCredentialFormatService = new LegacyIndyCredentialFormatService()
    const legacyIndyProofFormatService = new LegacyIndyProofFormatService()

    return {
        connections: new ConnectionsModule({
            autoAcceptConnections: true,
        }),

        credentials: new CredentialsModule({
            autoAcceptCredentials: AutoAcceptCredential.Never,
            credentialProtocols: [
                new V1CredentialProtocol({
                    indyCredentialFormat: legacyIndyCredentialFormatService,
                }),
                new V2CredentialProtocol({
                    credentialFormats: [legacyIndyCredentialFormatService, new AnonCredsCredentialFormatService(), new DataIntegrityCredentialFormatService(), new JsonLdCredentialFormatService()],
                }),
            ],
        }),
        proofs: new ProofsModule({
            autoAcceptProofs: AutoAcceptProof.ContentApproved,
            proofProtocols: [
                new V1ProofProtocol({
                    indyProofFormat: legacyIndyProofFormatService,
                }),
                new V2ProofProtocol({
                    proofFormats: [legacyIndyProofFormatService, new AnonCredsProofFormatService(), new DifPresentationExchangeProofFormatService()],
                }),
            ],
        }),
        anoncreds: new AnonCredsModule({
            registries: [new IndyVdrAnonCredsRegistry()],
        }),
        indyVdr: new IndyVdrModule({
            indyVdr,
            networks: [{
                // Need unique network id as we will have multiple agent processes in the agent
                id: randomUUID(),
                genesisTransactions: genesisTransactionsBCovrinTestNet,
                indyNamespace: 'bcovrin:test',
                isProduction: false,
                connectOnStartup: true,
            }],
        }),
        dids: new DidsModule({
            resolvers: [new IndyVdrIndyDidResolver(), new WebDidResolver()],
        }),
        askar: new AskarModule({
            ariesAskar,
        }),
        w3cCredentials: new W3cCredentialsModule(),

    }
}
