const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16;

function encrypt(text) {
    if (!text) return text; // Ensure undefined or null text is returned as is
    
    // Generate a random initialization vector (IV)
    let iv = crypto.randomBytes(IV_LENGTH);

    // Create a cipher instance
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
    
    // Encrypt the text
    let encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);

    // Return the IV + encrypted text as a single string
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}


function decrypt(text) {
    if (!text) return text; // Ensure undefined or null text is returned as is

    // Split the incoming string by ":"
    let parts = text.split(":");

    // If we don't have both IV and encrypted text, return the text as is (invalid data)
    if (parts.length !== 2) {
        console.error("Invalid encrypted data");
        return text;
    }

    let iv = Buffer.from(parts[0], "hex"); // Convert the IV to a Buffer
    let encryptedText = Buffer.from(parts[1], "hex"); // Convert the encrypted text to a Buffer

    try {
        // Create a decipher instance
        let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
        
        // Decrypt the data
        let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);

        // Return the decrypted text as a string
        return decrypted.toString();
    } catch (err) {
        console.error("Decryption failed:", err);
        return text; // Return original text if decryption fails
    }
}


module.exports = { encrypt, decrypt };
