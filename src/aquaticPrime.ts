import { createHash } from "node:crypto";
import { base64ToBigint, bigintToBuf, hexToBigint } from "bigint-conversion";
const plist = require("plist");
// Based on the original `aquatic_prime.coffee` from https://github.com/bdrister/AquaticPrime

export type LicenseDetails = Record<string, string>;
export type KeyPair = { publicKey: bigint; privateKey: bigint };

export class AquaticPrime {
  private keys: KeyPair;

  // Create a new AquaticPrime instance with a public and private key
  constructor({
    publicKey,
    privateKey,
    keyFormat,
  }: {
    publicKey: string;
    privateKey: string;
    keyFormat: "hex" | "base64";
  }) {
    if (keyFormat === "hex") {
      this.keys = {
        publicKey: hexToBigint(publicKey),
        privateKey: hexToBigint(privateKey),
      };
    } else if (keyFormat === "base64") {
      this.keys = {
        publicKey: base64ToBigint(publicKey),
        privateKey: base64ToBigint(privateKey),
      };
    } else {
      throw new Error(`Unknown key format: ${keyFormat}`);
    }
  }

  // Generate a license plist from a license details object
  generateLicense(licenseDetails: LicenseDetails) {
    const hashHex = hashLicense(licenseDetails);
    const signedPlist =  plist.build({
      ...licenseDetails,
      Signature: bigintToBuf(signHash(hashHex, this.keys)),
    });
    return { signedPlist, hashHex };
  }
}

// Modular exponentiation
const powmod = (base: bigint, exponent: bigint, modulus: bigint): bigint => {
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
export function hashLicense(licenseDetails: LicenseDetails) {
  // Concatenate the values in sorted key order
  const sortedKeys = Object.keys(licenseDetails).sort();
  const concatenation = sortedKeys.map((key) => licenseDetails[key]).join("");

  // SHA1 hash the concatenation
  const hash = createHash("sha1");
  hash.update(concatenation, "utf8");

  return hash.digest("hex");
}
  
export function signHash(hashHex: string, keys: KeyPair) {
  // Pad the hash with magic bytes then sign it
  const paddedHash = `0001${"ff".repeat(105)}00${hashHex}`;
  return powmod(BigInt(`0x${paddedHash}`), keys.privateKey, keys.publicKey);
}
