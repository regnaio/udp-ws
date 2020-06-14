"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONWebSocketHandler {
    constructor(_url) {
        this._url = _url;
        this._callbacks = new Map();
    }
    connect() {
        return new Promise((resolve, reject) => {
            this._ws = new WebSocket(this._url);
            this._ws.binaryType = 'arraybuffer';
            this._ws.onmessage = evt => {
                const packet = JSON.parse(evt.data);
                this.dispatch(packet);
            };
            this._ws.onopen = () => {
                resolve();
            };
            this._ws.onerror = err => {
                reject(err);
            };
        });
    }
    bind(eventName, callback) {
        this._callbacks.set(eventName, callback);
    }
    send(packet) {
        const payload = JSON.stringify(packet);
        if (this._ws === undefined)
            throw 'WebSocket is undefined!';
        this._ws.send(payload);
    }
    dispatch(packet) {
        const callback = this._callbacks.get(packet.eventName);
        if (callback !== undefined) {
            callback(packet.data);
        }
    }
}
exports.JSONWebSocketHandler = JSONWebSocketHandler;
