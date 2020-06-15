"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
// import { v4 as uuidv4 } from 'uuid';
let count = 0;
class JSONWebSocketServerHandler {
    constructor(port) {
        this._callbacks = new Map();
        this._wss = new ws_1.default.Server({
            port
        });
        this._wss.on('connection', (ws, req) => {
            console.log(`User connected (IP: ${req.connection.remoteAddress}).`);
            const iws = ws;
            iws.binaryType = 'arraybuffer';
            iws.uuid = count++;
            console.log(`gws.uuid: ${iws.uuid}`);
            iws.on('message', msg => {
                const packet = JSON.parse(msg);
                this.dispatch(iws, packet);
            });
            iws.on('close', () => {
                console.log(`User disconnected (IP: ${req.connection.remoteAddress}).`);
            });
        });
    }
    bind(event, callback) {
        this._callbacks.set(event, callback);
    }
    send(iws, packet) {
        const payload = JSON.stringify(packet);
        iws.send(payload);
    }
    dispatch(iws, packet) {
        const callback = this._callbacks.get(packet.event);
        if (callback !== undefined) {
            callback(iws, packet.data);
        }
    }
}
exports.JSONWebSocketServerHandler = JSONWebSocketServerHandler;
