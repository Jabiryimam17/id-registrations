import {derive_key_from_password, from_Base64} from "./cryptohelpers";

export default async function decrypt_data(encrypted_data, password, iv_base64, salt_base64) {

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const encrypted_buffer = from_Base64(encrypted_data);
    const iv = from_Base64(iv_base64);
    const salt = from_Base64(salt_base64);

    const key_material = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const key = await derive_key_from_password(password, salt, "decrypt");


    const decrypted_buffer = await window.crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: iv
        },
        key,
        encrypted_buffer
    )
    return JSON.parse(decoder.decode(decrypted_buffer));

}
decrypt_data(
    "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",
    "legend123",
    "j5cGACQZMLJvI0zG",
    "UZUbKzeeQKh4WT4y+zkrCA=="
);