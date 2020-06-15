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
webSocketServerHandler.bind(WebSocketEvent.NumberEvent, (iws, data) => {
    console.log(data);
    const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_FLOAT64);
    const view = new DataView(buffer);
    view.setUint8(0, WebSocketEvent.NumberEvent);
    view.setFloat64(binaryTools_1.NUM_BYTES_FLOAT64, 9876.54321);
    webSocketServerHandler.send(iws, buffer);
});
webSocketServerHandler.bind(WebSocketEvent.StringEvent, (iws, data) => {
    console.log(data);
    const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_CHAR * 14);
    const view = new DataView(buffer);
    view.setUint8(0, WebSocketEvent.StringEvent);
    binaryTools_1.writeStringToBuffer('server says hi', buffer, binaryTools_1.NUM_BYTES_UINT8);
    webSocketServerHandler.send(iws, buffer);
});
// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express_1.default.static(__dirname + '/../../../../../../client/'));
app.listen(80, () => {
    console.log('Running on http://localhost/');
});
