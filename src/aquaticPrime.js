"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signHash = exports.hashLicense = exports.AquaticPrime = void 0;
const node_crypto_1 = require("node:crypto");
const bigint_conversion_1 = require("bigint-conversion");
const plist = require("plist");
class AquaticPrime {
    // Create a new AquaticPrime instance with a public and private key
    constructor({ publicKey, privateKey, keyFormat, }) {
        if (keyFormat === "hex") {
            this.keys = {
                publicKey: (0, bigint_conversion_1.hexToBigint)(publicKey),
                privateKey: (0, bigint_conversion_1.hexToBigint)(privateKey),
            };
        }
        else if (keyFormat === "base64") {
            this.keys = {
                publicKey: (0, bigint_conversion_1.base64ToBigint)(publicKey),
                privateKey: (0, bigint_conversion_1.base64ToBigint)(privateKey),
            };
        }
        else {
            throw new Error(`Unknown key format: ${keyFormat}`);
        }
    }
    // Generate a license plist from a license details object
    generateLicense(licenseDetails) {
        const hashHex = hashLicense(licenseDetails);
        const signedPlist = plist.build({
            ...licenseDetails,
            Signature: (0, bigint_conversion_1.bigintToBuf)(signHash(hashHex, this.keys)),
        });
        return signedPlist;
    }
}
exports.AquaticPrime = AquaticPrime;
// Modular exponentiation
const powmod = (base, exponent, modulus) => {
    let e = exponent;
    let b = base;
    let r = 1n; // result
    while (e > 0n) {
        if (e % 2n === 1n) {
            r = (r * b) % modulus;
        }
        e = e >> 1n;
        b = (b * b) % modulus;
    }
    return r;
};
// Sign a license with a raw private key and public key, returning signature
function hashLicense(licenseDetails) {
    // Concatenate the values in sorted key order
    const sortedKeys = Object.keys(licenseDetails).sort();
    const concatenation = sortedKeys.map((key) => licenseDetails[key]).join("");
    // SHA1 hash the concatenation
    const hash = (0, node_crypto_1.createHash)("sha1");
    hash.update(concatenation, "utf8");
    return hash.digest("hex");
}
exports.hashLicense = hashLicense;
function signHash(hashHex, keys) {
    // Pad the hash with magic bytes then sign it
    const paddedHash = `0001${"ff".repeat(105)}00${hashHex}`;
    return powmod(BigInt(`0x${paddedHash}`), keys.privateKey, keys.publicKey);
}
exports.signHash = signHash;
