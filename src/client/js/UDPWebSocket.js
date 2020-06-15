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
const WebSocketHandler_1 = require("./WebSocketHandler");
class UDPWebSocket {
    constructor(url, configuration) {
        this.onopen = null;
        this.onmessage = null;
        this.onerror = null;
        this.onclose = null;
        this._webSocketHandler = new WebSocketHandler_1.WebSocketHandler(url);
        this.bindCallbacks();
        this.startSignaling();
        if (configuration === undefined) {
            configuration = {
                // @ts-ignore
                sdpSemantics: 'unified-plan',
                iceTransportPolicy: 'all'
            };
        }
        this._localPeerConnection = new RTCPeerConnection(configuration);
        this._localPeerConnection.ondatachannel = this.onDataChannel.bind(this);
    }
    // Public API start
    get readyState() {
        var _a;
        return ((_a = this._dataChannel) === null || _a === void 0 ? void 0 : _a.readyState) || 'closed';
    }
    set binaryType(binaryType) {
        if (binaryType !== 'blob' && binaryType !== 'arraybuffer')
            throw `binaryType ${binaryType} does not exist!`;
        if (this._dataChannel === undefined)
            throw `this._dataChannel === undefined`;
        this._dataChannel.binaryType = binaryType;
    }
    // send(data: string | Blob | ArrayBuffer | ArrayBufferView) {
    send(data) {
        if (this._dataChannel === undefined) {
            throw `send this._dataChannel === undefined`;
        }
        console.log('send data: ', data);
        this._dataChannel.send(data);
    }
    close() {
        this._localPeerConnection.close();
    }
    // Public API end
    startSignaling() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._webSocketHandler.connect();
                this._webSocketHandler.send({
                    event: 'connect',
                    data: {}
                });
            }
            catch (err) {
                throw err;
            }
        });
    }
    bindCallbacks() {
        this._webSocketHandler.bind('offer', (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('bind offer data: ', data);
            try {
                yield this._localPeerConnection.setRemoteDescription(data);
                yield this._localPeerConnection.setLocalDescription(yield this._localPeerConnection.createAnswer());
                this._webSocketHandler.send({
                    event: 'answer',
                    data: this._localPeerConnection.localDescription || {}
                });
            }
            catch (err) {
                throw err;
            }
        }));
        this._webSocketHandler.bind('icecandidate', (data) => {
            console.log('bind icecandidate data: ', data);
            // @ts-ignore
            this._localPeerConnection.addIceCandidate(data);
        });
    }
    onDataChannel(ev) {
        this._dataChannel = ev.channel;
        this._dataChannel.onopen = (ev) => {
            console.log('this._dataChannel.onopen this: ', this);
            console.log(`onopen readyState: ${this._dataChannel.readyState}`);
            console.log('onopen ev: ', ev);
            if (this.onopen !== null) {
                this.onopen(ev);
            }
            this._dataChannel.onmessage = (ev) => {
                console.log('onmessage ev: ', ev);
                if (this.onmessage !== null) {
                    this.onmessage(ev);
                }
            };
        };
        this._dataChannel.onerror = (ev) => {
            console.log('onerror ev: ', ev);
            if (this.onerror !== null) {
                this.onerror(ev);
            }
        };
        this._dataChannel.onclose = (ev) => {
            console.log(`onclose readyState: ${this._dataChannel.readyState}`);
            console.log('onclose ev: ', ev);
            if (this.onclose !== null) {
                this.onclose(ev);
            }
        };
    }
}
exports.UDPWebSocket = UDPWebSocket;
