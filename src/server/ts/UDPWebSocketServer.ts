import { EventEmitter } from 'events';

import { IDWebSocket, JSONWebSocketServerHandler } from './JSONWebSocketServerHandler';
import { UDPWebSocket } from './UDPWebSocket';

// Each client has a normal WebSocket for signaling (handshake) and a UDPWebSocket for UDP communication
export const clients = new Map<number, {
  iws: IDWebSocket,
  client: UDPWebSocket
}>();

export declare interface UDPWebSocketServer {
  on(event: 'connection', listener: (socket: UDPWebSocket) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
}

export class UDPWebSocketServer extends EventEmitter {
  private _JSONWebSocketServerHandler: JSONWebSocketServerHandler;

  clients = clients;

  constructor(port: number, private _configuration?: RTCConfiguration) {
    super();
    this._JSONWebSocketServerHandler = new JSONWebSocketServerHandler(port);

    this.bindCallbacks();
  }

  // Public API start
  set binaryType(binaryType: string) {
    if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
    for (const [id, { client }] of this.clients) {
      client.binaryType = binaryType;
    }
  }
  // Public API end

  get JSONWebSocketServerHandler(): JSONWebSocketServerHandler {
    return this._JSONWebSocketServerHandler;
  }

  private bindCallbacks() {
    this._JSONWebSocketServerHandler.bind('connect', async (iws, data) => {
      console.log('bind connect data: ', data);
      console.log(`iws.uuid: ${iws.uuid}`);
      const client = new UDPWebSocket(iws.uuid, this, this._configuration);
      this.clients.set(iws.uuid, {
        iws,
        client
      });

      this.emit('connection', client);

      try {
        await client.localPeerConnection.setLocalDescription(await client.localPeerConnection.createOffer());

        this._JSONWebSocketServerHandler.send(iws, {
          eventName: 'offer',
          data: client.localPeerConnection.localDescription || {}
        });
      } catch (err) {
        throw err;
      }
    });

    this._JSONWebSocketServerHandler.bind('answer', async (iws, data) => {
      console.log('bind answer data: ', data);

      const client = this.clients.get(iws.uuid)?.client;
      if (client === undefined) {
        throw `bind answer client === undefined`;
      }

      try {
        await client.localPeerConnection.setRemoteDescription(data as RTCSessionDescriptionInit);
      } catch (err) {
        throw err;
      }
    });

    this._JSONWebSocketServerHandler.bind('icecandidate', (iws, data) => {
      console.log('bind icecandidate data: ', data);

      const client = this.clients.get(iws.uuid);
      if (client === undefined) {
        throw `bind answer client === undefined`;
      }

      // @ts-ignore
      client.localPeerConnection.addIceCandidate(data.candidate);
    });
  }
}