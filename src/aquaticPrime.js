"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.AquaticPrime = void 0;
const bigint_conversion_1 = require("bigint-conversion");
const node_crypto_1 = require("node:crypto");
const plist = require("plist");
class AquaticPrime {
  // Create a new AquaticPrime instance with a public and private key
  constructor({ publicKey, privateKey, keyFormat }) {
    if (keyFormat === "hex") {
      this.keys = {
        publicKey: (0, bigint_conversion_1.hexToBigint)(publicKey),
        privateKey: (0, bigint_conversion_1.hexToBigint)(privateKey),
      };
    } else if (keyFormat === "base64") {
      this.keys = {
        publicKey: (0, bigint_conversion_1.base64ToBigint)(publicKey),
        privateKey: (0, bigint_conversion_1.base64ToBigint)(privateKey),
      };
    } else {
      throw new Error(`Unknown key format: ${keyFormat}`);
    }
  }
  // Generate a license plist from a license details object
  generateLicense(licenseDetails) {
    return plist.build({
      ...licenseDetails,
      Signature: (0, bigint_conversion_1.bigintToBuf)(
        sign(licenseDetails, this.keys),
      ),
    });
  }
}
exports.AquaticPrime = AquaticPrime;
// Modular exponentiation
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
