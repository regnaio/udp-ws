const wrtc = require('wrtc');

import { iceServers } from './iceServers';

const DefaultRTCPeerConnection: RTCPeerConnection = wrtc.RTCPeerConnection;

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _dataChannel: RTCDataChannel;
  
  private _onopen?: () => void;
  private _onmessage?: (data: string | Buffer | ArrayBuffer | Buffer[]) => void;
  private _onerror?: (err: Error) => void;
  private _onclose?: (code: number, reason: string) => void;

  constructor(configuration?: RTCConfiguration) {
    if (configuration === undefined) {
      configuration = {
        iceServers,

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

    this._dataChannel.onopen = (ev: Event) => {
      console.log(`onopen readyState: ${this._dataChannel.readyState}`);
      console.log(`onopen ev: ${ev}`);

      this._dataChannel.onmessage = (ev: MessageEvent) => {
        console.log(`onmessage event: ${event}`);

        if (this._onmessage !== undefined) {
          this._onmessage(ev.data);
        }
      };

    };
    this._dataChannel.onerror = (ev: Event) => {
      console.log(`onerror ev: ${ev}`);

    };
    this._dataChannel.onclose = (ev: Event) => {
      console.log(`onclose readyState: ${this._dataChannel.readyState}`);
      console.log(`onclose ev: ${ev}`);

    };
  }

  // Public API start
  on(event: string, cb: (data: string | Buffer | ArrayBuffer | Buffer[]) => void) {
    switch (event) {
      case 'message': {
        this._onmessage = cb;
        break;
      }
      case 'close': {
        this._onclose = cb;
        break;
      }
      default: {
        throw `Event ${event} does not exist for UDPWebSocket.on`;
      }
    }
  }

  send(data: any, cb?: ((err?: Error | undefined) => void) | undefined): void {

  }

  set binaryType(binaryType: string) {
    if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
    this._dataChannel.binaryType = binaryType;
  }
  // Public API end

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log(`onIceCandidate event: ${event}`);
    if (event.candidate === null) {
      this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
    }

    this._JSONWebSocketServerHandler.send(gws, {
      eventName: 'icecandidate',
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