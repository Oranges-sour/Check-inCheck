import { Base64 } from "js-base64";

import { PASSWORD } from "./data.js";


export function encrypt(input) {
    return Base64.encode(encryptDecrypt(input, PASSWORD));
}

export function decrypt(input) {
    return encryptDecrypt(Base64.decode(input), PASSWORD);
}

function encryptDecrypt(input, password) {
    let result = '';
    for (let i = 0; i < input.length; i++) {
        result += String.fromCharCode(input.charCodeAt(i) ^ password.charCodeAt(i % password.length));
    }
    return result;
}