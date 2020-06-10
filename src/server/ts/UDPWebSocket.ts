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

  constructor(port: number, configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler(port);

    this.bindCallbacks();

    if (configuration === undefined) {
      configuration = { iceServers: defaultIceServers };
    }

    // @ts-ignore
    this._localPeerConnection = new DefaultRTCPeerConnection(configuration);

    console.log(JSON.stringify(this._localPeerConnection, null, 4));
  }

  private bindCallbacks() {
    this._JSONWebSocketServerHandler.bind('signal', (gws, data) => {

    });
  }
}