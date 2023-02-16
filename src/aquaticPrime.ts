import { base64ToBigint, bigintToBuf, hexToBigint } from "bigint-conversion";
import { createHash } from "node:crypto";
const plist = require("plist");
// Based on the original `aquatic_prime.coffee` from https://github.com/bdrister/AquaticPrime

export type LicenseDetails = Record<string, string>;
export type KeyPair = { publicKey: bigint; privateKey: bigint };

export class AquaticPrime {
  private keys: KeyPair;

  // Create a new AquaticPrime instance with a public and private key
  constructor(
    { publicKey, privateKey, keyFormat }: {
      publicKey: string;
      privateKey: string;
      keyFormat: "hex" | "base64";
    },
  ) {
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
    return plist.build({
      ...licenseDetails,
      Signature: bigintToBuf(sign(licenseDetails, this.keys)),
    });
  }
}

// Modular exponentiation
const powmod = (x: bigint, a: bigint, m: bigint): bigint => {
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
export function sign(
  licenseDetails: LicenseDetails,
  keys: KeyPair,
) {
  // Concatenate the values in sorted key order
  const sortedKeys = Object.keys(licenseDetails).sort();
  const concatenation = sortedKeys.map((key) => licenseDetails[key]).join("");

  // SHA1 hash the concatenation
  const hash = createHash("sha1");
  hash.update(concatenation, "utf8");

  // Pad the hash with magic bytes then sign it
  const paddedHash = "0001" + "ff".repeat(105) + "00" + hash.digest("hex");
  return powmod(
    BigInt("0x" + paddedHash),
    keys.privateKey,
    keys.publicKey,
  );
}
