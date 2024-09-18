
We need to build two packages here: askar and core. Starting from askar:
```bash
cd packages/askar
npm install
yarn build
npm pack
cp ./credo-ts-askar-0.5.3.tgz ./../../../credo-ts-askar-0.5.3.tgz
```

Then it is possible to perform the same operation for core.
```bash
cd packages/core
cp ./../../../credo-ts-askar-0.5.3.tgz ./credo-ts-askar-0.5.3.tgz
cp ./../../../sphereon-pex-3.3.3.tgz ./sphereon-pex-3.3.3.tgz
cp ./../../../sphereon-pex-models-2.2.4.tgz ./sphereon-pex-models-2.2.4.tgz
cp ./../../../digitalcredentials-vc-7.0.0.tgz ./digitalcredentials-vc-7.0.0.tgz
npm install
yarn build
npm pack
cp ./credo-ts-core-0.5.3.tgz ./../../../credo-ts-core-0.5.3.tgz
```
