export function simpleEncrypt(text: string): string {
    let encryptedText = '';

    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const encryptedCharCode = charCode + i; // Modify the ASCII code based on the position
        encryptedText += String.fromCharCode(encryptedCharCode);
    }

    return encryptedText;
}