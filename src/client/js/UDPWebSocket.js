"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const JSONWebSocketHandler_1 = require("./JSONWebSocketHandler");
const iceServers_1 = require("./iceServers");
class UDPWebSocket {
    constructor(url, configuration = undefined) {
        this._JSONWebSocketHandler = new JSONWebSocketHandler_1.JSONWebSocketHandler(url, {
            eventName: 'signal',
            data: {}
        });
        this.bindCallbacks();
        if (configuration === undefined) {
            configuration = { iceServers: iceServers_1.defaultIceServers };
        }
        this._localPeerConnection = new RTCPeerConnection(configuration);
        this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
        this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);
    }
    bindCallbacks() {
        this._JSONWebSocketHandler.bind('signal', (data) => {
        });
    }
    onIceCandidate() {
    }
    onIceConnectionChange() {
    }
}
exports.UDPWebSocket = UDPWebSocket;
