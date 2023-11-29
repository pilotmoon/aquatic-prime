import test from "ava";
import { base64ToBigint } from "bigint-conversion";
import { AquaticPrime, hashLicense, signHash } from "../index";

// example keys
const examplePublicKey =
  "6dv2pPa0QyghF8bV6SVfZzXcRdvLn6PKvQ8IJom0olUEojQOLy9UG/LOeYdJHsVB6LVJa7avI18YtsMfN8potDBDHkFhHpPc++QOt9PHJudLnWi5hncGpeDL1E4LiGOqw9L9vzzVexDD6QA56Wb3icyMvLHOu9Lrlf9fBeSPN6M=";
// 9BE7F9C34F22D770160FD9E3F0C394EF793D83E7DD1517DC7E0A056F06786C38ADC1780974CA3812A1DEFBAF8614838145CE30F279CA1794BB248214CFDC45CC2EFAD1A84D0B8B442D71623486EC36DF6036A4AD8CD319743E7BCF0ECFEA8D0955B1305E42FE30F042D67A9317F10FF3CD2EDFB1D003896EF7791742199348AB
const examplePrivateKey =
  "m+f5w08i13AWD9nj8MOU73k9g+fdFRfcfgoFbwZ4bDitwXgJdMo4EqHe+6+GFIOBRc4w8nnKF5S7JIIUz9xFzC760ahNC4tELXFiNIbsNt9gNqStjNMZdD57zw7P6o0JVbEwXkL+MPBC1nqTF/EP880u37HQA4lu93kXQhmTSKs=";
// E9DBF6A4F6B443282117C6D5E9255F6735DC45DBCB9FA3CABD0F082689B4A25504A2340E2F2F541BF2CE7987491EC541E8B5496BB6AF235F18B6C31F37CA68B430431E41611E93DCFBE40EB7D3C726E74B9D68B9867706A5E0CBD44E0B8863AAC3D2FDBF3CD57B10C3E90039E966F789CC8CBCB1CEBBD2EB95FF5F05E48F37A3
const examplePayload = {
  name: "fooinator",
  date: "2020-01-01",
  version: "1.0.0",
  description: "foo",
};
const exampleExpect =
  "vU67LJsEd8yDuxL+9Y9xfJYCl4IFLoO4pijK8n7J+UY7cxIhv3y9G3UdZ4nl9Xi7hfk2cbtv53xxQBRclZKoEZRrQPo+jz9WJIzzFaBzvX9PobSvtdyShXqTUOloEextvDwGB9KjU+OUv5jqyPc/auiZY9fcsgvFgJWEZXBfT+8=";
const examplePlist = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>name</key>
    <string>fooinator</string>
    <key>date</key>
    <string>2020-01-01</string>
    <key>version</key>
    <string>1.0.0</string>
    <key>description</key>
    <string>foo</string>
    <key>Signature</key>
    <data>vU67LJsEd8yDuxL+9Y9xfJYCl4IFLoO4pijK8n7J+UY7cxIhv3y9G3UdZ4nl9Xi7hfk2cbtv53xxQBRclZKoEZRrQPo+jz9WJIzzFaBzvX9PobSvtdyShXqTUOloEextvDwGB9KjU+OUv5jqyPc/auiZY9fcsgvFgJWEZXBfT+8=</data>
  </dict>
</plist>`;
const exampleHash = "8906c29c7d1927f8d2fca3329ff6318d44fa8c4f";
const aqp = new AquaticPrime({
  publicKey: examplePublicKey,
  privateKey: examplePrivateKey,
  keyFormat: "base64",
});
const exampleKeyPair = {
  publicKey: base64ToBigint(examplePublicKey),
  privateKey: base64ToBigint(examplePrivateKey),
};

test("hash", (t) => {
  t.is(hashLicense(examplePayload), exampleHash);
});

test("sign", (t) => {
  t.is(signHash(hashLicense(examplePayload), exampleKeyPair), base64ToBigint(exampleExpect));
});

test("generateLicense", (t) => {
  t.deepEqual(aqp.generateLicense(examplePayload), { signedPlist: examplePlist, hashHex: exampleHash });
});
