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
var WebSocketEvent;
(function (WebSocketEvent) {
    WebSocketEvent[WebSocketEvent["NumberEvent"] = 0] = "NumberEvent";
    WebSocketEvent[WebSocketEvent["StringEvent"] = 1] = "StringEvent";
})(WebSocketEvent || (WebSocketEvent = {}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    const webSocketHandler = new WebSocketHandler_1.BinaryWebSocketHandler('ws://localhost:3000', WebSocketHandler_1.WebSocketType.UDP);
    // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);
    webSocketHandler.bind(WebSocketEvent.NumberEvent, data => {
        console.log(data);
        const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_FLOAT64);
        const view = new DataView(buffer);
        view.setUint8(0, WebSocketEvent.NumberEvent);
        view.setFloat64(binaryTools_1.NUM_BYTES_FLOAT64, 12345.6789);
        webSocketHandler.send(buffer);
    });
    webSocketHandler.bind(WebSocketEvent.StringEvent, data => {
        console.log(data);
        const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8 + binaryTools_1.NUM_BYTES_CHAR * 13);
        const view = new DataView(buffer);
        view.setUint8(0, WebSocketEvent.StringEvent);
        binaryTools_1.writeStringToBuffer('client says hi', buffer, binaryTools_1.NUM_BYTES_UINT8);
        webSocketHandler.send(buffer);
    });
    try {
        yield webSocketHandler.connect();
        const buffer = new ArrayBuffer(binaryTools_1.NUM_BYTES_UINT8);
        const view = new DataView(buffer);
        view.setUint8(0, WebSocketEvent.NumberEvent);
        webSocketHandler.send(buffer);
        view.setUint8(0, WebSocketEvent.StringEvent);
        webSocketHandler.send(buffer);
    }
    catch (err) {
        throw err;
    }
}))();
