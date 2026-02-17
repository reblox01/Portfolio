/**
 * Encryption utility for securing API keys
 * Uses AES-256-CBC encryption with environment-configured key
 */

import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set');
}

// Ensure key is 32 bytes for AES-256
const KEY = crypto.scryptSync(ENCRYPTION_KEY, 'salt', 32);

/**
 * Encrypt plaintext using AES-256-CBC
 * @param plaintext - The text to encrypt (e.g., API key)
 * @returns Encrypted string in format: iv:encryptedData
 */
export function encryptApiKey(plaintext: string): string {
    if (!plaintext || plaintext.trim() === '') {
        throw new Error('Cannot encrypt empty string');
    }

    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

    let encrypted = cipher.update(plaintext, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    // Return iv and encrypted data separated by colon
    return `${iv.toString('hex')}:${encrypted}`;
}

/**
 * Decrypt ciphertext using AES-256-CBC
 * @param ciphertext - Encrypted string in format: iv:encryptedData
 * @returns Decrypted plaintext
 */
export function decryptApiKey(ciphertext: string): string {
    if (!ciphertext || !ciphertext.includes(':')) {
        throw new Error('Invalid ciphertext format');
    }

    const [ivHex, encryptedHex] = ciphertext.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
}

/**
 * Safely encrypt API key, returning null if input is null/undefined
 * @param plaintext - The text to encrypt or null
 * @returns Encrypted string or null
 */
export function safeEncryptApiKey(plaintext: string | null | undefined): string | null {
    if (!plaintext) return null;
    return encryptApiKey(plaintext);
}

/**
 * Safely decrypt API key, returning null if input is null/undefined
 * @param ciphertext - Encrypted string or null
 * @returns Decrypted plaintext or null
 */
export function safeDecryptApiKey(ciphertext: string | null | undefined): string | null {
    if (!ciphertext) return null;
    return decryptApiKey(ciphertext);
}
