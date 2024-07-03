# Demo Issuer
Demo Issuer to release Verifiable Credentials usable in the authentication required by Community Solid Server.
Similarly to the other packages of this project, it requires updated version of the four libraries.
```
credo-ts-core-0.5.3.tgz
digitalcredentials-vc-7.0.0.tgz
sphereon-pex-3.3.3.tgz
sphereon-pex-models-2.2.4.tgz
```

```bash
yarn install
```

Before to run the server, you have to rename the config file contained in ```config/custom.json``` to ```config/default.json```.
Once you customized the parameters, then it is possible to start the server, which in first execution will print out the DIDDocument that you need to host in somewhere (I suggest did:web in you github repo, as existing in this under ```config/did.json```).

```bash
node app.js
```
At this point you can re-run the server by changing the variable did on line 85 of ```app.js```
```javascript
did = "<Insert here the new DID, depending on where you hosted the DIDDocument>"
```

