import CryptoJS from 'crypto-js';

const SHARED_SECRET = 'cryptalk_secret_key_123'; // Change this later per chat

export const encryptMessage = (message: string): string => {
    return CryptoJS.AES.encrypt(message, SHARED_SECRET).toString();
};

export const decryptMessage = (cipherText: string): string => {
    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, SHARED_SECRET);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        return '[Decryption Failed]';
    }
};
