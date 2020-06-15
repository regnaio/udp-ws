export const NUM_BYTES_UINT8 = 1;
export const NUM_BYTES_UINT16 = 2;
export const NUM_BYTES_UINT32 = 4;

export const NUM_BYTES_FLOAT32 = 4;
export const NUM_BYTES_FLOAT64 = 8;

export const NUM_BYTES_CHAR = NUM_BYTES_UINT16;

export function writeStringToBuffer(str: string, buffer: ArrayBuffer, byteOffset: number = 0): void {
  const view = new DataView(buffer);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    view.setUint16(byteOffset + i * 2, str.charCodeAt(i), true);
  }
}

export function bufferToString(buffer: ArrayBuffer): string {
  return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}