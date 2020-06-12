"use strict";
// type JSONData = { [key: string]: string }
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
class JSONWebSocketHandler {
    constructor(_url, _firstPacket) {
        this._url = _url;
        this._firstPacket = _firstPacket;
        this._callbacks = new Map();
        this.use();
    }
    connect() {
        return new Promise((resolve, reject) => {
            this._ws = new WebSocket(this._url);
            this._ws.onopen = () => {
                resolve();
            };
            this._ws.onerror = err => {
                reject(err);
            };
        });
    }
    use() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.connect();
                if (this._ws === undefined)
                    throw 'WebSocket is undefined!';
                this._ws.onmessage = evt => {
                    const packet = JSON.parse(evt.data);
                    this.dispatch(packet);
                };
                this.send(this._firstPacket);
            }
            catch (err) {
                throw err;
            }
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
