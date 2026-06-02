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
