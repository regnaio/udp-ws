import { EventEmitter } from 'events';

const wrtc = require('wrtc');

import { clients, UDPWebSocketServer } from './UDPWebSocketServer';
import { iceServers } from './iceServers';

const DefaultRTCPeerConnection: RTCPeerConnection = wrtc.RTCPeerConnection;

export declare interface UDPWebSocket {
  on(event: 'open' , cb: () => void): this;
  on(event: 'message', cb: (data: string | Buffer | ArrayBuffer | Buffer[]) => void): this;
  on(event: 'error', cb: (err: Error) => void): this;
  on(event: 'close', cb: (code: number, reason: string) => void): this;
  on(event: string, cb: (...args: any[]) => void): this;
}

export class UDPWebSocket extends EventEmitter {
  private _localPeerConnection: RTCPeerConnection;
  private _dataChannel: RTCDataChannel;

  constructor(private _uuid: number, private _UDPWebSocketServer: UDPWebSocketServer, configuration?: RTCConfiguration) {
    super();
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
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate.bind(this));

    const dataChannelConfig = {
      ordered: false,
      maxRetransmits: 0
    };
    this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
    this._dataChannel.binaryType = 'arraybuffer';

    this._dataChannel.onopen = (ev: Event) => {
      console.log(`onopen readyState: ${this._dataChannel.readyState}`);
      console.log('onopen ev: ', ev);

      this.emit('open');

      this._dataChannel.onmessage = (ev: MessageEvent) => {
        console.log('onmessage ev: ', ev);

        this.emit('message', ev.data);
      };

    };
    this._dataChannel.onerror = (ev: RTCErrorEvent) => {
      console.log('onerror ev: ', ev);

      this.emit('error', ev);
    };
    this._dataChannel.onclose = (ev: Event) => {
      console.log(`onclose readyState: ${this._dataChannel.readyState}`);
      console.log('onclose ev: ', ev);

      // this.emit('close', ev);
    };
  }

  // Public API start
  send(data: any) {
    console.log('send data: ', data);
    this._dataChannel.send(data);
  }

  set binaryType(binaryType: string) {
    if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
    this._dataChannel.binaryType = binaryType;
  }
  // Public API end

  get localPeerConnection(): RTCPeerConnection {
    return this._localPeerConnection;
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log('onIceCandidate event: ', event);
    if (event.candidate === null) {
      this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
      return;
    }

    const iws = clients.get(this._uuid)?.iws;
    if (iws === undefined) {
      throw `onIceCandidate iws === undefined`;
    }

    this._UDPWebSocketServer.JSONWebSocketServerHandler.send(iws, {
      eventName: 'icecandidate',
      data: event.candidate || {}
    });
  }
}