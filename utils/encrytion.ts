// utils/encryption.ts
import * as Crypto from 'expo-crypto';
import { encode as btoa, decode as atob } from 'base-64';

const SHARED_SECRET = 'cryptalk_secret_key_123'; // same on both ends

export const encryptMessage = async (text: string): Promise<string> => {
    const combined = `${SHARED_SECRET}:${text}`;
    const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        combined
    );
    return btoa(`${digest}:${text}`);
};

export const decryptMessage = (cipherText: string): string => {
    try {
        const decoded = atob(cipherText);
        const parts = decoded.split(':');
        if (parts.length < 2) return '[Decryption Failed]';
        // Optionally, you can verify the hash here again
        return parts.slice(1).join(':'); // Return original text
    } catch (error) {
        return '[Decryption Failed]';
    }
};
