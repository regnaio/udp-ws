import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';

interface GameWebSocket extends WebSocket {
  uuid: string
}

// type JSONData = { [key: string]: string }

interface JSONWebSocketPacket {
  eventName: string,
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
      console.log(`User connected to game (IP: ${req.connection.remoteAddress}).`);
      const gws = ws as GameWebSocket;
      gws.uuid = uuidv4();
      console.log(`gws.uuid: ${gws.uuid}`);
      
      gws.on('message', msg => {
        console.log(msg);
        const packet = JSON.parse(msg as string);
        this.dispatch(gws, packet);
      });
    
      gws.on('close', () => {
        console.log(`User disconnected from game (IP: ${req.connection.remoteAddress}).`);
      });
    });
  }

  bind(eventName: string, callback: (gws: GameWebSocket, data: object) => void): void {
    this._callbacks.set(eventName, callback);
  }

  send(gws: GameWebSocket, packet: JSONWebSocketPacket): void {
    const payload = JSON.stringify(packet);
    gws.send(payload);
  }

  dispatch(gws: GameWebSocket, packet: JSONWebSocketPacket): void {
    const callback = this._callbacks.get(packet.eventName);
    if (callback !== undefined) {
      callback(gws, packet.data);
    }
  }
}