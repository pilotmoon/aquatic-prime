"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.Signer = void 0;
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
class Signer {
  constructor(keys) {
    this.keys = keys;
  }
  sign(licenseDetails) {
    return sign(licenseDetails, this.keys);
  }
}
exports.Signer = Signer;
// Sign a license with a raw private key and public key, returning signature
function sign(licenseDetails, keys) {
  // Concatenate the values in sorted key order
  const sortedKeys = Object.keys(licenseDetails).sort();
  const concatenation = sortedKeys.map((key) => licenseDetails[key]).join("");
  // SHA1 hash the concatenation
  const hash = (0, node_crypto_1.createHash)("sha1");
  hash.update(concatenation, "utf8");
  // Pad the hash with magic bytes then sign it
  const paddedHash = "0001" + "ff".repeat(105) + "00" + hash.digest("hex");
  return powmod(BigInt("0x" + paddedHash), keys.privateKey, keys.publicKey);
}
exports.sign = sign;
