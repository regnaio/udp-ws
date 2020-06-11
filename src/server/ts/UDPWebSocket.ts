const wrtc = require('wrtc');

import { defaultIceServers } from './iceServers';

const DefaultRTCPeerConnection: RTCPeerConnection = wrtc.RTCPeerConnection;

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _dataChannel: RTCDataChannel;

  constructor(configuration: RTCConfiguration | undefined = undefined) {
    if (configuration === undefined) {
      configuration = {
        iceServers: defaultIceServers,

        // @ts-ignore
        sdpSemantics: 'unified-plan',
        iceTransportPolicy: 'all'
      };
    }

    // @ts-ignore
    this._localPeerConnection = new DefaultRTCPeerConnection(configuration);
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
    // this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);

    // console.log(JSON.stringify(this._localPeerConnection, null, 4));
    
    const dataChannelConfig = {
      ordered: false,
      maxRetransmits: 0
    };
    this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
    this._dataChannel.binaryType = 'arraybuffer';

    this._dataChannel.onopen = () => {
      console.log(`onopen readyState: ${this._dataChannel.readyState}`);
      this._dataChannel.onmessage = (event: MessageEvent) => {
        console.log(`onmessage event: ${event}`);

      };

    };
    this._dataChannel.onclose = () => {
      console.log(`onclose readyState: ${this._dataChannel.readyState}`);

    };
  }

  // Public API start
  on(event: string, cb: (data: string | Buffer | ArrayBuffer | Buffer[]) => void) {
    switch (event) {
      case 'message': {

        break;
      }
      case 'close': {

        break;
      }
    }
  }

  send(data: any, cb?: ((err?: Error | undefined) => void) | undefined): void {

  }
  // Public API end

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

  // private onDataChannelStateChange() {
  //   const readyState = this._dataChannel.readyState;
  //   if (readyState === 'open') {

  //   } else {
      
  //   }
  // }
}