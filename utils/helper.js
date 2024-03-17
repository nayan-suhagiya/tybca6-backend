const crypto = require("crypto");
const algorithm = "aes-192-cbc";
const secret = "thisisthesecretkey";
const key = crypto.scryptSync(secret, 'salt', 24);
const iv = crypto.randomBytes(16);

const encryption = (password) => {
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    console.log("encrypted password: ", encrypted);
    return encrypted;
}

const decryption = (encryptedPassword) => {
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedPassword, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    console.log("decrypted password: ", decrypted);
    return decrypted;
}

// Example usage
// const encrypted = encryption("admin@123");
// console.log("Encrypted password: ", encrypted);
// const desc = decryption(encrypted);
// console.log("Decrypted password: ", desc);

module.exports = { encryption, decryption };
