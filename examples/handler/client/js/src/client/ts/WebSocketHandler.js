"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UDPWebSocket_1 = require("./UDPWebSocket");
// Type of WebSocket being handled
var WebSocketType;
(function (WebSocketType) {
    WebSocketType[WebSocketType["TCP"] = 0] = "TCP";
    WebSocketType[WebSocketType["UDP"] = 1] = "UDP"; // UDPWebSocket
})(WebSocketType = exports.WebSocketType || (exports.WebSocketType = {}));
// Handles WebSocket or UDPWebSocket with JSON packets
class WebSocketHandler {
    constructor(_url, _type = WebSocketType.TCP) {
        this._url = _url;
        this._type = _type;
        this._callbacks = new Map();
        this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);
    }
    connect() {
        return new Promise((resolve, reject) => {
            this._ws.onmessage = ev => {
                const packet = JSON.parse(ev.data);
                this.dispatch(packet);
            };
            this._ws.onclose = ev => {
            };
            this._ws.onopen = ev => {
                resolve();
            };
            this._ws.onerror = ev => {
                reject(ev);
            };
            if (this._ws.readyState === WebSocket.OPEN) {
                resolve();
            }
        });
    }
    bind(event, callback) {
        this._callbacks.set(event, callback);
    }
    send(packet) {
        this._ws.send(JSON.stringify(packet));
    }
    dispatch(packet) {
        const callback = this._callbacks.get(packet.event);
        if (callback !== undefined) {
            callback(packet.data);
        }
    }
}
exports.WebSocketHandler = WebSocketHandler;
// Handles WebSocket or UDPWebSocket with ArrayBuffer packets
class BinaryWebSocketHandler {
    constructor(_url, _type = WebSocketType.TCP) {
        this._url = _url;
        this._type = _type;
        this._callbacks = new Array();
        this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);
        // this._ws.binaryType = 'arraybuffer';
    }
    connect() {
        return new Promise((resolve, reject) => {
            this._ws.onmessage = ev => {
                this.dispatch(ev.data);
            };
            this._ws.onclose = ev => {
            };
            this._ws.onopen = ev => {
                resolve();
            };
            this._ws.onerror = ev => {
                reject(ev);
            };
            if (this._type === WebSocketType.TCP && this._ws.readyState === WebSocket.OPEN) {
                resolve();
            }
            // if (this._type === WebSocketType.UDP && this._ws.readyState === 'open') {
            //   resolve();
            // }
        });
    }
    bind(event, callback) {
        this._callbacks[event] = callback;
    }
    send(packet) {
        this._ws.send(packet);
    }
    dispatch(packet) {
        const view = new DataView(packet);
        this._callbacks[view.getUint8(0)](packet);
    }
}
exports.BinaryWebSocketHandler = BinaryWebSocketHandler;
