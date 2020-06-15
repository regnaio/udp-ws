"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const wrtc = require('wrtc');
const UDPWebSocketServer_1 = require("./UDPWebSocketServer");
const iceServers_1 = require("./iceServers");
const DefaultRTCPeerConnection = wrtc.RTCPeerConnection;
class UDPWebSocket extends events_1.EventEmitter {
    constructor(_uuid, _UDPWebSocketServer, configuration) {
        super();
        this._uuid = _uuid;
        this._UDPWebSocketServer = _UDPWebSocketServer;
        if (configuration === undefined) {
            configuration = {
                iceServers: iceServers_1.iceServers,
                // @ts-ignore
                sdpSemantics: 'unified-plan',
                iceTransportPolicy: 'all'
            };
        }
        // @ts-ignore
        this._localPeerConnection = new DefaultRTCPeerConnection(configuration);
        this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate.bind(this));
        const dataChannelConfig = {
            ordered: false,
            maxRetransmits: 0
        };
        this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
        // this._dataChannel.binaryType = 'arraybuffer';
        this._dataChannel.onopen = (ev) => {
            console.log(`onopen readyState: ${this._dataChannel.readyState}`);
            console.log('onopen ev: ', ev);
            this.emit('open');
            this._dataChannel.onmessage = (ev) => {
                console.log('onmessage ev: ', ev);
                this.emit('message', ev.data);
            };
        };
        this._dataChannel.onerror = (ev) => {
            console.log('onerror ev: ', ev);
            this.emit('error', ev);
        };
        this._dataChannel.onclose = (ev) => {
            console.log(`onclose readyState: ${this._dataChannel.readyState}`);
            console.log('onclose ev: ', ev);
            // this.emit('close', ev);
        };
    }
    // Public API start
    get readyState() {
        return this._dataChannel.readyState;
    }
    set binaryType(binaryType) {
        if (binaryType !== 'blob' && binaryType !== 'arraybuffer')
            throw `binaryType ${binaryType} does not exist!`;
        this._dataChannel.binaryType = binaryType;
    }
    send(data) {
        console.log('send data: ', data);
        this._dataChannel.send(data);
    }
    close() {
        // this._dataChannel.close();
        this._localPeerConnection.close();
    }
    // Public API end
    get localPeerConnection() {
        return this._localPeerConnection;
    }
    onIceCandidate(event) {
        var _a;
        console.log('onIceCandidate event: ', event);
        if (event.candidate === null) {
            this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
            return;
        }
        const iws = (_a = UDPWebSocketServer_1.clients.get(this._uuid)) === null || _a === void 0 ? void 0 : _a.iws;
        if (iws === undefined) {
            throw `onIceCandidate iws === undefined`;
        }
        this._UDPWebSocketServer.webSocketServerHandler.send(iws, {
            event: 'icecandidate',
            data: event.candidate || {}
        });
    }
}
exports.UDPWebSocket = UDPWebSocket;
