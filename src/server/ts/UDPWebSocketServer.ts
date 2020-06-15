import { EventEmitter } from 'events';

import { IDWebSocket, WebSocketServerHandler } from './WebSocketServerHandler';
import { UDPWebSocket } from './UDPWebSocket';

// Each client has a normal WebSocket for signaling and a UDPWebSocket for UDP communication
export const clients = new Map<number, {
  iws: IDWebSocket,
  client: UDPWebSocket
}>();

export declare interface UDPWebSocketServer {
  on(event: 'connection', listener: (socket: UDPWebSocket) => void): this;
  on(event: string, listener: (...args: any[]) => void): this;
}

export class UDPWebSocketServer extends EventEmitter {
  private _webSocketServerHandler: WebSocketServerHandler;

  clients = clients;

  constructor(port: number, private _configuration?: RTCConfiguration) {
    super();
    this._webSocketServerHandler = new WebSocketServerHandler(port);

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

  get webSocketServerHandler(): WebSocketServerHandler {
    return this._webSocketServerHandler;
  }

  private bindCallbacks() {
    this._webSocketServerHandler.bind('connect', async (iws, data) => {
      console.log('bind connect data: ', data);
      console.log(`iws.uuid: ${iws.uuid}`);
      const client = new UDPWebSocket(iws.uuid, this, this._configuration);
      client.binaryType = 'arraybuffer';
      this.clients.set(iws.uuid, {
        iws,
        client
      });

      this.emit('connection', client);

      try {
        await client.localPeerConnection.setLocalDescription(await client.localPeerConnection.createOffer());

        this._webSocketServerHandler.send(iws, {
          event: 'offer',
          data: client.localPeerConnection.localDescription || {}
        });
      } catch (err) {
        throw err;
      }
    });

    this._webSocketServerHandler.bind('answer', async (iws, data) => {
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

    this._webSocketServerHandler.bind('icecandidate', (iws, data) => {
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