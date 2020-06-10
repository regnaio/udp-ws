const wrtc = require('wrtc');

import { JSONWebSocketServerHandler } from './JSONWebSocketServerHandler';
import { defaultIceServers } from './iceServers';

const DefaultRTCPeerConnection: RTCPeerConnection = wrtc.RTCPeerConnection;

// let configuration: RTCConfiguration = {
//   // @ts-ignore
//   sdpSemantics: 'unified-plan'
// }

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketServerHandler: JSONWebSocketServerHandler;
  private _dataChannel: RTCDataChannel;

  constructor(port: number, configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler(port);

    this.bindCallbacks();

    if (configuration === undefined) {
      configuration = {
        // @ts-ignore
        sdpSemantics: 'unified-plan',
        iceServers: defaultIceServers
      };
    }

    // @ts-ignore
    this._localPeerConnection = new DefaultRTCPeerConnection(configuration);
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
    this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);

    console.log(JSON.stringify(this._localPeerConnection, null, 4));
    
    const dataChannelConfig = {
      ordered: false,
      maxRetransmits: 0
    };
    this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
    this._dataChannel.onopen = this.onDataChannelStateChange;
    this._dataChannel.onclose = this.onDataChannelStateChange;
    this._dataChannel.onmessage = this.onDataChannelMessage;
  }

  private bindCallbacks() {
    this._JSONWebSocketServerHandler.bind('connect', async (gws, data) => {
      console.log(`bind connect data: ${data}`);

      try {
        await this._localPeerConnection.setLocalDescription(await this._localPeerConnection.createOffer());

        this._localPeerConnection.localDescription
      } catch {

      }

      this._JSONWebSocketServerHandler.send(gws, {
        eventName: 'signal',
        data: {}
      });
    });

    this._JSONWebSocketServerHandler.bind('signal', (gws, data) => {
      console.log(`bind signal data: ${data}`);

    });

    this._JSONWebSocketServerHandler.bind('icecandidate', (gws, data) => {
      console.log(`bind icecandidate data: ${data}`);

    });
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log(`onIceCandidate event: ${event}`);
    if (event.candidate === null) {
      this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
    }

    this._JSONWebSocketServerHandler.send(gws, {
      eventName: 'icecandidate',
      // data: JSON.parse(JSON.stringify(event.candidate))
      data: event.candidate || {}
    });
  }

  private onIceConnectionChange() {

  }

  private onDataChannelStateChange() {
    const readyState = this._dataChannel.readyState;
    if (readyState === 'open') {

    } else {
      
    }
  }

  private onDataChannelMessage() {

  }
}