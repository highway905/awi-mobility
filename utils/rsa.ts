import * as forge from 'node-forge';

// Get raw key from environment variable
const rawKey = process.env.ENCRYPT_PUBLIC_KEY || '';

// Process the key to handle both backslash escape sequences and actual backslashes
const publicKey = rawKey
  .replace(/\\\\n/g, '\\n') // Handle double escaped newlines if present
  .replace(/\\n/g, '\n')    // Convert \n string literals to actual newlines
  .replace(/\\\\/g, '\\')   // Handle escaped backslashes
  .replace(/\\/g, '');      // Remove any remaining single backslashes

// For debugging only - don't log in production

// Encrypts a message with the given public key
export const encryptedMessage = (message: string) => {
  try {
    const publicRsaKey = forge.pki.publicKeyFromPem(publicKey);
    // Don't log the actual key in production

    const encrypted = publicRsaKey.encrypt(forge.util.encodeUtf8(message));
    const base64Encrypted = forge.util.encode64(encrypted);

    return base64Encrypted;
  } catch (error) {
    throw error;
  }
};
