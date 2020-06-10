import { JSONWebSocketHandler } from './JSONWebSocketHandler';
import { defaultIceServers } from './iceServers';
import { read } from 'fs';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketHandler: JSONWebSocketHandler;
  private _dataChannel: RTCDataChannel;

  constructor(url: string, configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketHandler = new JSONWebSocketHandler(url, {
      eventName: 'connect',
      data: {}
    });

    this.bindCallbacks();

    if (configuration === undefined) {
      configuration = {
        // @ts-ignore
        sdpSemantics: 'unified-plan',
        iceServers: defaultIceServers
      };
    }

    this._localPeerConnection = new RTCPeerConnection(configuration);
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
    this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);

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
    this._JSONWebSocketHandler.bind('connect', (data) => {
      console.log(`bind connect data: ${data}`);

    });

    this._JSONWebSocketHandler.bind('signal', (data) => {
      console.log(`bind signal data: ${data}`);

    });

    this._JSONWebSocketHandler.bind('icecandidate', (data) => {
      console.log(`bind icecandidate data: ${data}`);

    });
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log(`onIceCandidate event: ${event}`);
    if (event.candidate === null) {
      this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
    }

    this._JSONWebSocketHandler.send({
      eventName: 'icecandidate',
      data: JSON.parse(JSON.stringify(event.candidate))
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