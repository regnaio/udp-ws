"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wrtc = require('wrtc');
const JSONWebSocketServerHandler_1 = require("./JSONWebSocketServerHandler");
const iceServers_1 = require("./iceServers");
const DefaultRTCPeerConnection = wrtc.RTCPeerConnection;
// let configuration: RTCConfiguration = {
//   // @ts-ignore
//   sdpSemantics: 'unified-plan'
// }
class UDPWebSocket {
    constructor(port, configuration = undefined) {
        this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler_1.JSONWebSocketServerHandler(port);
        this.bindCallbacks();
        if (configuration === undefined) {
            configuration = { iceServers: iceServers_1.defaultIceServers };
        }
        // @ts-ignore
        this._localPeerConnection = new DefaultRTCPeerConnection(configuration);
        console.log(JSON.stringify(this._localPeerConnection, null, 4));
    }
    bindCallbacks() {
        this._JSONWebSocketServerHandler.bind('signal', (gws, data) => {
        });
    }
}
exports.UDPWebSocket = UDPWebSocket;
