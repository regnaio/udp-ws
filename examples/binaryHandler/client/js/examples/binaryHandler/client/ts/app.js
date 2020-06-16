"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketHandler_1 = require("./../../../../src/client/ts/WebSocketHandler");
const binaryTools_1 = require("./binaryTools");
// Uint8 representing event (NumberEvent = 0, StringEvent = 1),
// which is the first byte of each packet sent and received
var WebSocketEvent;
(function (WebSocketEvent) {
    WebSocketEvent[WebSocketEvent["NumberEvent"] = 0] = "NumberEvent";
    WebSocketEvent[WebSocketEvent["StringEvent"] = 1] = "StringEvent";
})(WebSocketEvent || (WebSocketEvent = {}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const webSocketHandler = new WebSocketHandler_1.BinaryWebSocketHandler('ws://localhost:3000', WebSocketHandler_1.WebSocketType.UDP);
    // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);
    webSocketHandler.bind(WebSocketEvent.NumberEvent, buffer => {
        const view = new DataView(buffer);
        // read Float64 after first byte representing event
        console.log(view.getFloat64(binaryTools_1.NUM_BYTES_UINT8));
    });
    webSocketHandler.bind(WebSocketEvent.StringEvent, buffer => {
        // read string after first byte representing event
        console.log(binaryTools_1.bufferToString(buffer.slice(binaryTools_1.NUM_BYTES_UINT8)));
    });
    try {
        yield webSocketHandler.connect();
        // Code that must be executed only after the WebSocket is open
        setInterval(() => {
            const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_FLOAT64);
            const view = new DataView(buffer);
            // set first byte representing event
            view.setUint8(0, WebSocketEvent.NumberEvent);
            // set Float64 after first byte
            view.setFloat64(binaryTools_1.NUM_BYTES_UINT8, 12345.6789);
            webSocketHandler.send(buffer);
        }, 1000);
        setInterval(() => {
            // 14 characters needed for 'client says hi'
            const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_CHAR * 14);
            const view = new DataView(buffer);
            // set first byte representing event
            view.setUint8(0, WebSocketEvent.StringEvent);
            // set string after first byte
            binaryTools_1.writeStringToBuffer('client says hi', buffer, binaryTools_1.NUM_BYTES_UINT8);
            webSocketHandler.send(buffer);
        }, 1000);
    }
    catch (err) {
        throw err;
    }
}))();
