# AquaticPrime for node

A node.js module to generate AquaticPrime-compatible license keys.

```shell-script
npm install @pilotmoon/aquatic-prime
```

```typescript
import { AquaticPrime } from "@pilotmoon/aquatic-prime";

const aqp = new AquaticPrime({
  publicKey: "<base64 encoded public key>",
  privateKey: "<base64 encoded private key>",
  keyFormat: "base64", // "hex" is allowed too
});

// generate license plist
const { signedPlist } = aqp.generateLicense({
  "Name": "Foo",
  "Date": "2022-02-01",
  "AbritraryWhatever": "Dingus",
});
```
