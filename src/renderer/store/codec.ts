import pako from "pako";

function encodeBase64(buffer: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < buffer.length; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return window.btoa(binary);
}

function decodeBase64(base64String: string): Uint8Array {
  const binaryString = window.atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

export function encode(str: string): string {
  return encodeURIComponent(encodeBase64(pako.deflate(str)));
}

export function decode(str: string): string {
  return pako.inflate(decodeBase64(decodeURIComponent(str)), { to: "string" });
}
