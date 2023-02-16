import { createHash } from "node:crypto";
// Based on the original `aquatic_prime.coffee` from https://github.com/bdrister/AquaticPrime

export type LicenseDetails = Record<string, string>;

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
  privateKey: bigint,
  publicKey: bigint,
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
    privateKey,
    publicKey,
  );
}