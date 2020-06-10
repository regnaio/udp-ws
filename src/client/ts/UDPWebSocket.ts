import { JSONWebSocketHandler } from './JSONWebSocketHandler';
import { defaultIceServers } from './iceServers';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketHandler: JSONWebSocketHandler;

  constructor(url: string, configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketHandler = new JSONWebSocketHandler(url, {
      eventName: 'signal',
      data: {}
    });

    this.bindCallbacks();

    if (configuration === undefined) {
      configuration = { iceServers: defaultIceServers };
    }

    this._localPeerConnection = new RTCPeerConnection(configuration);
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
    this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);
  }

  private bindCallbacks() {
    this._JSONWebSocketHandler.bind('signal', (data) => {

    });
  }

  private onIceCandidate() {

  }

  private onIceConnectionChange() {

  }
}