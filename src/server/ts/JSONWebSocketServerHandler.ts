import WebSocket from 'ws';
// import { v4 as uuidv4 } from 'uuid';

let count = 0;

export interface IDWebSocket extends WebSocket {
  uuid: number
}

interface JSONWebSocketPacket {
  event: string,
  data: object
}

export class JSONWebSocketServerHandler {
  private _wss: WebSocket.Server;
  private _callbacks = new Map<string, Function>();
  
  constructor(port: number) {
    this._wss = new WebSocket.Server({
      port
    });

    this._wss.on('connection', (ws, req) => {
      console.log(`User connected (IP: ${req.connection.remoteAddress}).`);
      const iws = ws as IDWebSocket;
      iws.binaryType = 'arraybuffer';
      iws.uuid = count++;
      console.log(`gws.uuid: ${iws.uuid}`);
      
      iws.on('message', msg => {
        const packet = JSON.parse(msg as string);
        this.dispatch(iws, packet);
      });
    
      iws.on('close', () => {
        console.log(`User disconnected (IP: ${req.connection.remoteAddress}).`);
      });
    });
  }

  bind(event: string, callback: (iws: IDWebSocket, data: object) => void): void {
    this._callbacks.set(event, callback);
  }

  send(iws: IDWebSocket, packet: JSONWebSocketPacket): void {
    const payload = JSON.stringify(packet);
    iws.send(payload);
  }

  dispatch(iws: IDWebSocket, packet: JSONWebSocketPacket): void {
    const callback = this._callbacks.get(packet.event);
    if (callback !== undefined) {
      callback(iws, packet.data);
    }
  }
}