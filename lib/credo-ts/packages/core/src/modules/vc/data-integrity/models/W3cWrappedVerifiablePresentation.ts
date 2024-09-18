import type { DataIntegrityProofOptions } from './DataIntegrityProof'
import type { LinkedDataProofOptions } from './LinkedDataProof'
import type { W3cPresentationWrapperOptions } from '../../models/presentation/W3cPresentationWrapper'

import { SingleOrArray, IsInstanceOrArrayOfInstances, JsonTransformer, asArray } from '../../../../utils'
import { ClaimFormat } from '../../models'
import { W3cPresentationWrapper } from '../../models/presentation/W3cPresentationWrapper'
import { DataIntegrityProof } from './DataIntegrityProof'
import { LinkedDataProof } from './LinkedDataProof'
import { ProofTransformer } from './ProofTransformer'

export interface W3cWrappedVerifiablePresentationOptions extends W3cPresentationWrapperOptions {
    proof: LinkedDataProofOptions | DataIntegrityProofOptions
}

export class W3cWrappedVerifiablePresentation extends W3cPresentationWrapper {
    public constructor(options: W3cWrappedVerifiablePresentationOptions) {
        super(options)
        if (options) {
            if (options.proof.cryptosuite) this.proof = new DataIntegrityProof(options.proof)
            else this.proof = new LinkedDataProof(options.proof as LinkedDataProofOptions)
        }
    }

    @ProofTransformer()
    @IsInstanceOrArrayOfInstances({ classType: [LinkedDataProof, DataIntegrityProof] })
    public proof!: SingleOrArray<LinkedDataProof | DataIntegrityProof>

    public get proofTypes(): Array<string> {
        const proofArray = asArray(this.proof) ?? []
        return proofArray.map((proof) => proof.type)
    }

    public get dataIntegrityCryptosuites(): Array<string> {
        const proofArray = asArray(this.proof) ?? []
        return proofArray
            .filter((proof): proof is DataIntegrityProof => proof.type === 'DataIntegrityProof' && 'cryptosuite' in proof)
            .map((proof) => proof.cryptosuite)
    }

    public toJson() {
        return JsonTransformer.toJSON(this)
    }

    /**
     * The {@link ClaimFormat} of the presentation. For JSON-LD credentials this is always `ldp_vp`.
     */
    public get claimFormat(): ClaimFormat.LdpVp {
        return ClaimFormat.LdpVp
    }

    /**
     * Get the encoded variant of the W3C Verifiable Presentation. For JSON-LD presentations this is
     * a JSON object.
     */
    public get encoded() {
        return this.toJson()
    }
}
