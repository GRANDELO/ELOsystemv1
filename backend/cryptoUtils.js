const crypto = require("crypto");

const SECRET_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16;

function encrypt(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
    let encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

function decrypt(text) {
    let parts = text.split(":");
    let iv = Buffer.from(parts.shift(), "hex");
    let encryptedText = Buffer.from(parts.join(":"), "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(SECRET_KEY), iv);
    let decrypted = Buffer.concat([decipher.update(encryptedText), decipher.final()]);
    return decrypted.toString();
}

module.exports = { encrypt, decrypt };
