"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
class JSONWebSocketServerHandler {
    constructor(port) {
        this._callbacks = new Map();
        this._id = 0;
        this._wss = new ws_1.default.Server({
            port
        });
        this._wss.on('connection', (ws, req) => {
            console.log(`User connected to game (IP: ${req.connection.remoteAddress}).`);
            const iws = ws;
            iws.uuid = this._id;
            this._id++;
            console.log(`gws.uuid: ${iws.uuid}`);
            iws.on('message', msg => {
                console.log(msg);
                const packet = JSON.parse(msg);
                this.dispatch(iws, packet);
            });
            iws.on('close', () => {
                console.log(`User disconnected from game (IP: ${req.connection.remoteAddress}).`);
            });
        });
    }
    bind(eventName, callback) {
        this._callbacks.set(eventName, callback);
    }
    send(iws, packet) {
        const payload = JSON.stringify(packet);
        iws.send(payload);
    }
    dispatch(iws, packet) {
        const callback = this._callbacks.get(packet.eventName);
        if (callback !== undefined) {
            callback(iws, packet.data);
        }
    }
}
exports.JSONWebSocketServerHandler = JSONWebSocketServerHandler;
