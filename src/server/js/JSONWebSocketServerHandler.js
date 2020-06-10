"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = __importDefault(require("ws"));
const uuid_1 = require("uuid");
class JSONWebSocketServerHandler {
    constructor(port) {
        this._callbacks = new Map();
        this._wss = new ws_1.default.Server({
            port
        });
        this._wss.on('connection', (ws, req) => {
            console.log(`User connected to game (IP: ${req.connection.remoteAddress}).`);
            const gws = ws;
            gws.uuid = uuid_1.v4();
            console.log(`gws.uuid: ${gws.uuid}`);
            gws.on('message', msg => {
                console.log(msg);
                const packet = JSON.parse(msg);
                this.dispatch(gws, packet);
            });
            gws.on('close', () => {
                console.log(`User disconnected from game (IP: ${req.connection.remoteAddress}).`);
            });
        });
    }
    bind(eventName, callback) {
        this._callbacks.set(eventName, callback);
    }
    send(gws, packet) {
        const payload = JSON.stringify(packet);
        gws.send(payload);
    }
    dispatch(gws, packet) {
        const callback = this._callbacks.get(packet.eventName);
        if (callback !== undefined) {
            callback(gws, packet.data);
        }
    }
}
exports.JSONWebSocketServerHandler = JSONWebSocketServerHandler;
