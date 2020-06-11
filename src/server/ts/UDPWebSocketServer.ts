import { JSONWebSocketServerHandler } from './JSONWebSocketServerHandler';
import { UDPWebSocket } from './UDPWebSocket';

export class UDPWebSocketServer {
  private _JSONWebSocketServerHandler: JSONWebSocketServerHandler;

  clients = new Map<number, UDPWebSocket>();

  constructor(port: number, private _configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler(port);

    this.bindCallbacks();

  }

  // Public API start
  on(event: string, cb: (socket: UDPWebSocket) => void) {
    switch (event) {
      case 'connection': {

        break;
      }
    }
  }
  // Public API end

  private bindCallbacks() {
    this._JSONWebSocketServerHandler.bind('connect', async (gws, data) => {
      console.log(`bind connect data: ${data}`);
      const client = new UDPWebSocket(this._configuration);

      try {
        await this._localPeerConnection.setLocalDescription(await this._localPeerConnection.createOffer());

        this._JSONWebSocketServerHandler.send(gws, {
          eventName: 'offer',
          data: this._localPeerConnection.localDescription || {}
        });
      } catch (err) {
        throw err;
      }
    });

    this._JSONWebSocketServerHandler.bind('answer', async (gws, data) => {
      console.log(`bind answer data: ${data}`);

      try {
        await this._localPeerConnection.setRemoteDescription(data);
      } catch (err) {
        throw err;
      }
    });

    this._JSONWebSocketServerHandler.bind('icecandidate', (gws, data) => {
      console.log(`bind icecandidate data: ${data}`);

      // @ts-ignore
      this._localPeerConnection.addIceCandidate(data.candidate);
    });
  }
}