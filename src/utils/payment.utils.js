import crypto from "crypto";

import envConfig from "../config/env.config.js";

// const generateEncryptKey = () => {
//   const key = crypto.randomBytes(32); // 32 bytes = 256 bits
//   return key.toString("hex"); // Convert to hex string
// };

const validateKey = (key) => {
  const keyBuffer = Buffer.isBuffer(key) ? key : Buffer.from(key, "hex");
  const validLengths = [16, 24, 32]; // AES key lengths in bytes
  if (!validLengths.includes(keyBuffer.length)) {
    throw new Error(
      `Invalid key length: ${keyBuffer.length} bytes. Must be 16, 24, or 32 bytes.`
    );
  }
  return keyBuffer;
};

// Validate configuration on import
const validatedKey = validateKey(envConfig.ENCRYPT_KEY);

export const encrypt = (text) => {
  try {
    // Convert key to buffer
    const keyBuffer = Buffer.from(envConfig.ENCRYPT_KEY, "hex");

    // Determine IV length based on algorithm
    const ivLength = envConfig.ALGORITHM.includes("gcm") ? 12 : 16;
    const iv = crypto.randomBytes(ivLength);

    const cipher = crypto.createCipheriv(envConfig.ALGORITHM, keyBuffer, iv);

    let encrypted = cipher.update(text, "utf8", "hex");
    encrypted += cipher.final("hex");

    return `${iv.toString("hex")}:${encrypted}`;
  } catch (error) {
    throw new Error(`Encryption failed: ${error.message}`);
  }
};

export const decrypt = (encryptedText) => {
  try {
    const [ivHex, encrypted] = encryptedText.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const keyBuffer = Buffer.from(envConfig.ENCRYPT_KEY, "hex");

    const decipher = crypto.createDecipheriv(
      envConfig.ALGORITHM,
      keyBuffer,
      iv
    );

    let decrypted = decipher.update(encrypted, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch (error) {
    throw new Error(`Decryption failed: ${error.message}`);
  }
};
