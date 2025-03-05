import CryptoJS from "crypto-js";

const SECRET_KEY = "super_secret_key"; // Bunu .env dosyasına koymalısın!

// **Veriyi AES ile Şifreleme**
export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// **Şifrelenmiş Veriyi Çözme**
export const decryptData = (ciphertext) => {
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (error) {
    console.error("Şifre çözme hatası:", error);
    return null;
  }
};
