import { randomBytes } from "node:crypto";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function toBase32(buffer) {
  let bits = 0;
  let value = 0;
  let output = "";
  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;
    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) output += alphabet[(value << (5 - bits)) & 31];
  return output;
}

const account = process.argv[2] || "owner";
const issuer = process.argv[3] || "Nexa Studio";
const secret = toBase32(randomBytes(20));
const label = encodeURIComponent(`${issuer}:${account}`);
const uri = `otpauth://totp/${label}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`;

console.log("Store this value as ADMIN_TOTP_SECRET in the deployment secret manager:");
console.log(secret);
console.log("Enroll it in the administrator authenticator with this URI:");
console.log(uri);
console.log("Do not commit either value.");
