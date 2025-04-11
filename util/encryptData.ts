import { createCipheriv, pbkdf2 as pbkdf2CB, randomBytes } from "node:crypto";
import { promisify } from "node:util";

const ITERATIONS = 100_000;
const KEYLEN = 32;

const pbkdf2 = promisify(pbkdf2CB);

export async function encryptData(data: string, password: string) {
  const salt = randomBytes(32);
  const key = await pbkdf2(password, salt, ITERATIONS, KEYLEN, "sha512");

  const initializationVector = randomBytes(32);

  const cipher = createCipheriv("aes-256-gcm", key, initializationVector);
  let encrypted = cipher.update(data, "utf8", "hex");
  encrypted += cipher.final("hex");

  return {
    encrypted,
    salt: salt.toString("hex"),
    initializationVector: initializationVector.toString("hex"),
  };
}
