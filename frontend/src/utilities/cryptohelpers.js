export async function derive_key_from_password(password, salt, purpose) {
    const encoder = new TextEncoder();
    const key_material = await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveKey"]
    );

    const iterations = 1000;
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: iterations,
            hash: "SHA-256"
        },
        key_material,
        {name: "AES-GCM", length: 256},
        true,
        [purpose]
    );
}


export function to_Base64(uint8_arr) {
    if (typeof window == 'undefined') {
        return Buffer.from(uint8_arr).toString("base64");
    }
    return btoa(String.fromCharCode(...uint8_arr));
}

export function from_Base64(base64_str) {
    if (typeof window == 'undefined') {
        return Uint8Array.from(Buffer.from(base64_str, "base64"));
    }
    return Uint8Array.from(atob(base64_str), x => x.charCodeAt(0));
}