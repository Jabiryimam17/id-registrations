import { derive_key_from_password, to_Base64 } from "./cryptohelpers.js";


export default async function encrypt_data(plain_text, password) {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const key = await derive_key_from_password(password, salt, "encrypt");
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const encoder = new TextEncoder();
    const encoded_text = encoder.encode(plain_text);

    const ciphertext = await window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encoded_text
    );
    return {
        encrypted_data: to_Base64(new Uint8Array(ciphertext)),
        iv: to_Base64(iv),
        salt: to_Base64(salt)
    }
}

