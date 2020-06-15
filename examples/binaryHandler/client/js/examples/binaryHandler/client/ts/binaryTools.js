"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NUM_BYTES_UINT8 = 1;
exports.NUM_BYTES_UINT16 = 2;
exports.NUM_BYTES_UINT32 = 4;
exports.NUM_BYTES_FLOAT32 = 4;
exports.NUM_BYTES_FLOAT64 = 8;
exports.NUM_BYTES_CHAR = exports.NUM_BYTES_UINT16;
function writeStringToBuffer(str, buffer, byteOffset = 0) {
    const view = new DataView(buffer);
    for (let i = 0, strLen = str.length; i < strLen; i++) {
        view.setUint16(byteOffset + i * 2, str.charCodeAt(i), true);
    }
}
exports.writeStringToBuffer = writeStringToBuffer;
function bufferToString(buffer) {
    return String.fromCharCode.apply(null, Array.from(new Uint16Array(buffer)));
}
exports.bufferToString = bufferToString;
