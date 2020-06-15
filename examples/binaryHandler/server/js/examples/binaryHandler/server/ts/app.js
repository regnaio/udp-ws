"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const WebSocketServerHandler_1 = require("./../../../../src/server/ts/WebSocketServerHandler");
const binaryTools_1 = require("./binaryTools");
var WebSocketEvent;
(function (WebSocketEvent) {
    WebSocketEvent[WebSocketEvent["NumberEvent"] = 0] = "NumberEvent";
    WebSocketEvent[WebSocketEvent["StringEvent"] = 1] = "StringEvent";
})(WebSocketEvent || (WebSocketEvent = {}));
const webSocketServerHandler = new WebSocketServerHandler_1.BinaryWebSocketServerHandler(3000, WebSocketServerHandler_1.WebSocketType.UDP);
webSocketServerHandler.bind(WebSocketEvent.NumberEvent, (iws, buffer) => {
    const inView = new DataView(buffer);
    console.log(inView.getFloat64(binaryTools_1.NUM_BYTES_UINT8));
    const outBuffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_FLOAT64);
    const outView = new DataView(outBuffer);
    outView.setUint8(0, WebSocketEvent.NumberEvent);
    outView.setFloat64(binaryTools_1.NUM_BYTES_UINT8, 9876.54321);
    webSocketServerHandler.send(iws, outBuffer);
});
webSocketServerHandler.bind(WebSocketEvent.StringEvent, (iws, buffer) => {
    console.log(binaryTools_1.bufferToString(buffer.slice(binaryTools_1.NUM_BYTES_UINT8)));
    const outBuffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_CHAR * 14);
    const outView = new DataView(outBuffer);
    outView.setUint8(0, WebSocketEvent.StringEvent);
    binaryTools_1.writeStringToBuffer('server says hi', outBuffer, binaryTools_1.NUM_BYTES_UINT8);
    webSocketServerHandler.send(iws, outBuffer);
});
// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express_1.default.static(__dirname + '/../../../../../../client/'));
app.listen(80, () => {
    console.log('Running on http://localhost/');
});
