import * as forge from 'node-forge';

const rawKey = process.env.ENCRYPT_PUBLIC_KEY || '';
const publicKey = rawKey.replace(/\\n/g, '\n'); // This line is essential

// Encrypts a message with the given public key
export const encryptedMessage = (message: string) => {
  const publicRsaKey = forge.pki.publicKeyFromPem(publicKey);

  const encrypted = publicRsaKey.encrypt(forge.util.encodeUtf8(message));
  const base64Encrypted = forge.util.encode64(encrypted);

  return base64Encrypted;
};
