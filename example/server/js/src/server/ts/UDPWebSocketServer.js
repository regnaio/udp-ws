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
const events_1 = require("events");
const JSONWebSocketServerHandler_1 = require("./JSONWebSocketServerHandler");
const UDPWebSocket_1 = require("./UDPWebSocket");
// Each client has a normal WebSocket for signaling (handshake) and a UDPWebSocket for UDP communication
exports.clients = new Map();
class UDPWebSocketServer extends events_1.EventEmitter {
    constructor(port, _configuration) {
        super();
        this._configuration = _configuration;
        this.clients = exports.clients;
        this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler_1.JSONWebSocketServerHandler(port);
        this.bindCallbacks();
    }
    on(event, cb) {
        return this;
    }
    set binaryType(binaryType) {
        if (binaryType !== 'blob' && binaryType !== 'arraybuffer')
            throw `binaryType ${binaryType} does not exist!`;
        for (const [id, { client }] of this.clients) {
            client.binaryType = binaryType;
        }
    }
    // Public API end
    get JSONWebSocketServerHandler() {
        return this._JSONWebSocketServerHandler;
    }
    bindCallbacks() {
        this._JSONWebSocketServerHandler.bind('connect', (iws, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('bind connect data: ', data);
            console.log(`iws.uuid: ${iws.uuid}`);
            const client = new UDPWebSocket_1.UDPWebSocket(iws.uuid, this, this._configuration);
            this.clients.set(iws.uuid, {
                iws,
                client
            });
            this.emit('connection', client);
            try {
                yield client.localPeerConnection.setLocalDescription(yield client.localPeerConnection.createOffer());
                this._JSONWebSocketServerHandler.send(iws, {
                    eventName: 'offer',
                    data: client.localPeerConnection.localDescription || {}
                });
            }
            catch (err) {
                throw err;
            }
        }));
        this._JSONWebSocketServerHandler.bind('answer', (iws, data) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            console.log('bind answer data: ', data);
            const client = (_a = this.clients.get(iws.uuid)) === null || _a === void 0 ? void 0 : _a.client;
            if (client === undefined) {
                throw `bind answer client === undefined`;
            }
            try {
                yield client.localPeerConnection.setRemoteDescription(data);
            }
            catch (err) {
                throw err;
            }
        }));
        this._JSONWebSocketServerHandler.bind('icecandidate', (iws, data) => {
            console.log('bind icecandidate data: ', data);
            const client = this.clients.get(iws.uuid);
            if (client === undefined) {
                throw `bind answer client === undefined`;
            }
            // @ts-ignore
            client.localPeerConnection.addIceCandidate(data.candidate);
        });
    }
}
exports.UDPWebSocketServer = UDPWebSocketServer;
