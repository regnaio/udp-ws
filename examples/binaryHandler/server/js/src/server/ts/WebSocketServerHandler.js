"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const UDPWebSocketServer_1 = require("./UDPWebSocketServer");
let count = 0;
// Type of WebSocket being handled
var WebSocketType;
(function (WebSocketType) {
    WebSocketType[WebSocketType["TCP"] = 0] = "TCP";
    WebSocketType[WebSocketType["UDP"] = 1] = "UDP"; // UDPWebSocket
})(WebSocketType = exports.WebSocketType || (exports.WebSocketType = {}));
class WebSocketServerHandler {
    constructor(port, _type = WebSocketType.TCP) {
        this._type = _type;
        this._callbacks = new Map();
        this._wss = this._type === WebSocketType.TCP ? new ws_1.default.Server({ port }) : new UDPWebSocketServer_1.UDPWebSocketServer(port);
        this._wss.on('connection', ws => {
            console.log('User connected');
            const iws = this._type === WebSocketType.TCP ? ws : ws;
            iws.uuid = count++;
            console.log(`iws.uuid: ${iws.uuid}`);
            iws.on('message', data => {
                const packet = JSON.parse(data);
                this.dispatch(iws, packet);
            });
            iws.on('close', () => {
                console.log('User disconnected');
            });
        });
    }
    bind(event, callback) {
        this._callbacks.set(event, callback);
    }
    send(iws, packet) {
        iws.send(JSON.stringify(packet));
    }
    dispatch(iws, packet) {
        const callback = this._callbacks.get(packet.event);
        if (callback !== undefined) {
            callback(iws, packet.data);
        }
    }
}
exports.WebSocketServerHandler = WebSocketServerHandler;
class BinaryWebSocketServerHandler {
    constructor(port, _type = WebSocketType.TCP) {
        this._type = _type;
        this._callbacks = new Array();
        this._wss = this._type === WebSocketType.TCP ? new ws_1.default.Server({ port }) : new UDPWebSocketServer_1.UDPWebSocketServer(port);
        this._wss.on('connection', ws => {
            console.log('User connected');
            const iws = this._type === WebSocketType.TCP ? ws : ws;
            iws.binaryType = 'arraybuffer';
            iws.uuid = count++;
            console.log(`iws.uuid: ${iws.uuid}`);
            iws.on('message', data => {
                this.dispatch(iws, data);
            });
            iws.on('close', () => {
                console.log('User disconnected');
            });
        });
    }
    bind(event, callback) {
        this._callbacks[event] = callback;
    }
    send(iws, buffer) {
        iws.send(buffer);
    }
    dispatch(iws, buffer) {
        const view = new DataView(buffer);
        this._callbacks[view.getUint8(0)](iws, buffer);
    }
}
exports.BinaryWebSocketServerHandler = BinaryWebSocketServerHandler;
