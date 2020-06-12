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
const JSONWebSocketHandler_1 = require("./JSONWebSocketHandler");
class UDPWebSocket {
    constructor(url, configuration) {
        this.onopen = null;
        this.onmessage = null;
        this.onerror = null;
        this.onclose = null;
        this._JSONWebSocketHandler = new JSONWebSocketHandler_1.JSONWebSocketHandler(url, {
            eventName: 'connect',
            data: {}
        });
        this.bindCallbacks();
        if (configuration === undefined) {
            configuration = {
                // @ts-ignore
                sdpSemantics: 'unified-plan',
                iceTransportPolicy: 'all'
            };
        }
        this._localPeerConnection = new RTCPeerConnection(configuration);
        this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
        // this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);
        const dataChannelConfig = {
            ordered: false,
            maxRetransmits: 0
        };
        this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
        this._dataChannel.binaryType = 'arraybuffer';
        this._dataChannel.onopen = (ev) => {
            console.log(`onopen readyState: ${this._dataChannel.readyState}`);
            console.log(`onopen ev: ${ev}`);
            if (this.onopen !== null) {
                this.onopen(ev);
            }
            this._dataChannel.onmessage = (ev) => {
                console.log(`onmessage ev: ${ev}`);
                if (this.onmessage !== null) {
                    this.onmessage(ev);
                }
            };
        };
        this._dataChannel.onerror = (ev) => {
            console.log(`onerror ev: ${ev}`);
            if (this.onerror !== null) {
                this.onerror(ev);
            }
        };
        this._dataChannel.onclose = (ev) => {
            console.log(`onclose readyState: ${this._dataChannel.readyState}`);
            console.log(`onclose ev: ${ev}`);
            if (this.onclose !== null) {
                this.onclose(ev);
            }
        };
    }
    get readyState() {
        return this._dataChannel.readyState;
    }
    // Public API start
    send(data) {
    }
    set binaryType(binaryType) {
        if (binaryType !== 'blob' && binaryType !== 'arraybuffer')
            throw `binaryType ${binaryType} does not exist!`;
        this._dataChannel.binaryType = binaryType;
    }
    // Public API end
    bindCallbacks() {
        this._JSONWebSocketHandler.bind('offer', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`bind offer data: ${data}`);
            try {
                yield this._localPeerConnection.setRemoteDescription(data);
                yield this._localPeerConnection.setLocalDescription(yield this._localPeerConnection.createAnswer());
                this._JSONWebSocketHandler.send({
                    eventName: 'answer',
                    data: this._localPeerConnection.localDescription || {}
                });
            }
            catch (err) {
                throw err;
            }
        }));
        this._JSONWebSocketHandler.bind('icecandidate', (data) => {
            console.log(`bind icecandidate data: ${data}`);
            // @ts-ignore
            this._localPeerConnection.addIceCandidate(data.candidate);
        });
    }
    onIceCandidate(event) {
        console.log(`onIceCandidate event: ${event}`);
        if (event.candidate === null) {
            this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
        }
        this._JSONWebSocketHandler.send({
            eventName: 'icecandidate',
            data: event.candidate || {}
        });
    }
}
exports.UDPWebSocket = UDPWebSocket;
