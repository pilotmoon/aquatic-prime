"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = void 0;
const bigint_conversion_1 = require("bigint-conversion");
const node_crypto_1 = require("node:crypto");
const powmod = (x, a, m) => {
  let r = 1n;
  while (a > 0n) {
    if (a % 2n === 1n) {
      r = (r * x) % m;
    }
    a = a >> 1n;
    x = (x * x) % m;
  }
  return r;
};
// Sign a license with a private key and public key, returning a base64-encoded signature
function sign(licenseDetails, privateKey, publicKey) {
  // Concatenate the values in sorted key order
  const sortedKeys = Object.keys(licenseDetails).sort();
  const concatenation = sortedKeys.map((key) => licenseDetails[key]).join("");
  // SHA1 hash the concatenation
  const hash = (0, node_crypto_1.createHash)("sha1");
  hash.update(concatenation, "utf8");
  // Pad the hash with magic bytes then RSA sign it
  const paddedHash = "0001" + "ff".repeat(105) + "00" + hash.digest("hex");
  const sig = powmod(
    BigInt("0x" + paddedHash),
    BigInt("0x" + privateKey),
    BigInt("0x" + publicKey),
  );
  return (0, bigint_conversion_1.bigintToBase64)(sig);
}
exports.sign = sign;
