import * as forge from 'node-forge';

const publicKey = process.env.NEXT_PUBLIC_ENCRYPT_PUBLIC_KEY || process.env.ENCRYPT_PUBLIC_KEY;

// Encrypts a message with the given public key
export const encryptedMessage = (message: string) => {
  if (!publicKey) {
    console.warn('RSA public key not found in environment variables');
    return message; // Return unencrypted message as fallback
  }

  try {
    const publicRsaKey = forge.pki.publicKeyFromPem(publicKey);
    const encrypted = publicRsaKey.encrypt(forge.util.encodeUtf8(message));
    const base64Encrypted = forge.util.encode64(encrypted);
    return base64Encrypted;
  } catch (error) {
    console.error('RSA encryption failed:', error);
    return message; // Return unencrypted message as fallback
  }
};
