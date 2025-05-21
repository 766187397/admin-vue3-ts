import crypto from "crypto-js";

/**
 * AES加密配置选项的类型定义
 */
interface CryptoConfig {
  mode: typeof crypto.mode.ECB;
  padding: typeof crypto.pad.Pkcs7;
}

/**
 * AES加密解密使用的密钥
 * @constant
 * @type {string}
 */
const secretKey: string = "666666Hzx.666666";

/**
 * AES加密配置选项
 * @type {CryptoConfig}
 */
const cryptoConfig: CryptoConfig = {
  mode: crypto.mode.ECB,
  padding: crypto.pad.Pkcs7,
};

/**
 * 使用AES算法加密文本
 * @param {string} originalText - 需要加密的原始文本
 * @returns {string} 加密后的十六进制字符串
 * @throws {Error} 如果加密过程中出现错误
 */
export const encrypt = (originalText: string): string => {
  try {
    const key = crypto.enc.Utf8.parse(secretKey);
    const encrypted = crypto.AES.encrypt(originalText, key, cryptoConfig);
    return encrypted.ciphertext.toString();
  } catch (error) {
    throw new Error(`加密失败: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * 使用AES算法解密密文
 * @param {string} cipherText - 十六进制格式的密文
 * @returns {string} 解密后的原始文本
 * @throws {Error} 如果解密过程中出现错误
 */
export const decrypt = (cipherText: string): string => {
  try {
    const key = crypto.enc.Utf8.parse(secretKey);
    const cipherHex = crypto.enc.Hex.parse(cipherText);
    const cipherBase64 = crypto.enc.Base64.stringify(cipherHex);
    const decrypted = crypto.AES.decrypt(cipherBase64, key, cryptoConfig);
    return decrypted.toString(crypto.enc.Utf8);
  } catch (error) {
    throw new Error(`解密失败: ${error instanceof Error ? error.message : String(error)}`);
  }
};
