<h1 align="center">
  <br>
  <a href="https://www.sphereon.com"><img src="https://sphereon.com/content/themes/sphereon/assets/img/logo.svg" alt="Sphereon" width="400"></a>
  <br>Presentation Exchange v1 and v2
  <br>TypeScript Library
  <br>
</h1>

[![CI](https://github.com/Sphereon-Opensource/pex/actions/workflows/main.yml/badge.svg)](https://github.com/Sphereon-Opensource/pex/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/Sphereon-Opensource/pex/branch/develop/graph/badge.svg?token=9P1JGUYA35)](https://codecov.io/gh/Sphereon-Opensource/pex) [![NPM Version](https://img.shields.io/npm/v/@sphereon/pex.svg)](https://npm.im/@sphereon/pex)

## Background

The Presentation Exchange (PEX) Library implements the functionality
described in the [DIF Presentation Exchange specification](https://identity.foundation/presentation-exchange/) for both
version 1 and 2.

Sphereon's PEX Library is useful for both verifier systems and holders (e.g. wallets) and can be used in client side
browsers and mobile applications as well as on server side technology such as REST APIs (e.g. built with NodeJS). It
allows anyone to add DIF Presentation Exchange logic to their existing wallets, agents and/or verifiers, without making
any further assumptions about technologies like cryptography, credential representations used in their products.

A Presentation Exchange generally goes as follows; The verifier creates a Presentation Definition asking for
credentials from the holder. The Presentation Definition for the credentials is sent to the holder, who returns a
Verifiable
Presentation containing Presentation Submission data that links the Credentials in the Presentation to the received
Definition as a response.
The Presentation Submission describes the relationship between the Verifiable Presentation and the Presentation
Definition.
It can either be part of the Verifiable Presentation or be external, like in OpenID4VC specifications.
Now the verifier will verify the Verifiable Presentation by checking the signature and other
accompanying proofs as well as ensuring the Submission Data fulfills the requirements from the specification.

Presentation Exchange will ensure that the model used by the verifier, can be interpreted by the holder. It then
ensures that the correct parts from the holders credentials are used to create the presentation. The PEX-library
contains all
the logic to interpret the models, therefore removing the need for the verifier and holder to align their specific
models.

The Typescript data objects (models) used in PEX are generated from Sphereon's DIF PEX OpenAPI Spec component. The code
for the
component can be found at [PEX-OpenAPI github repository](https://github.com/Sphereon-Opensource/pex-openapi). This
allows the generation of the objects in many programming languages and frameworks consistently by configuring the maven
plugin.

WARNING: Please be aware that this library does not support the latest V2 specification!. Support will be added as part
of a V3 major version of this library

### The PEX Library supports the following actions:

- Creating a presentation definition / request
- Validating a presentation definition / conforming to the specifications v1 and v2
- Creating a Presentation
- Creating a Verifiable Presentation using a callback function
- Validating a presentation (submission) when received
- Input evaluations: Verification of presentation submissions conforming to the presentation definition
- Utilities: to build and use different models compliant with
  the [DIF Presentation Exchange v2.0.0 specification](https://identity.foundation/presentation-exchange/).
- Support
  for [DIF Presentation Exchange v1.0.0 specification](https://identity.foundation/presentation-exchange/spec/v1.0.0/).

Stateful storage, signature support or credential management should be implemented in separate libraries/modules that
make use of this library. By keeping these separate, the PEX library will stay
platform-agnostic and lean with respect to dependencies.

## For PEX developers

This project has been created using:

- `yarn` version 1.22.19
- `node` version 18.17.0
- `pnpm` version 8.15.5

### Install

```shell
pnpm install
```

### Build

```shell
yarn build
npm pack
```

This will generate the file `sphereon-pex-3.3.3.tgz`, that must be copied in the main folder of the project for the final building.

```
cp ./sphereon-pex-3.3.3.tgz ./../sphereon-pex-3.3.3.tgz
```