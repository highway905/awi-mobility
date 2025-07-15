const forge = require('node-forge');

const publicKey = process.env.ENCRYPT_PUBLIC_KEY;
// console.log(publicKey)

// Encrypts a message with the given public key
export const encryptedMessage = (message: string) => {
  // console.log(publicKey)

  const publicRsaKey = forge.pki.publicKeyFromPem(publicKey);

  const encrypted = publicRsaKey.encrypt(forge.util.encodeUtf8(message));
  const base64Encrypted = forge.util.encode64(encrypted);

  return base64Encrypted;
};
