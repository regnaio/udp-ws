import WebSocket from 'ws';
// import { v4 as uuidv4 } from 'uuid';

import { UDPWebSocket } from './UDPWebSocket';
import { UDPWebSocketServer } from './UDPWebSocketServer';

let count = 0;

// Type of WebSocket being handled
export enum WebSocketType {
  TCP, // WebSocket
  UDP // UDPWebSocket
}

export interface IDWebSocket extends WebSocket {
  uuid: number
}

export interface IDUDPWebSocket extends UDPWebSocket {
  uuid: number
}

interface JSONPacket {
  event: string,
  data: object
}

export class WebSocketServerHandler {
  private _wss: WebSocket.Server | UDPWebSocketServer;
  private _callbacks = new Map<string, Function>();
  
  constructor(port: number, private _type: WebSocketType = WebSocketType.TCP) {
    this._wss = this._type === WebSocketType.TCP ? new WebSocket.Server({ port }) : new UDPWebSocketServer(port);
    
    this._wss.on('connection', ws => {
      console.log('User connected');
      const iws = this._type === WebSocketType.TCP ? ws as IDWebSocket : ws as IDUDPWebSocket;
      iws.uuid = count++;
      console.log(`iws.uuid: ${iws.uuid}`);
      
      iws.on('message', data => {
        const packet = JSON.parse(data as string);
        this.dispatch(iws, packet);
      });
    
      iws.on('close', () => {
        console.log('User disconnected');
      });
    });
  }

  bind(event: string, callback: (iws: IDWebSocket, data: object) => void): void {
    this._callbacks.set(event, callback);
  }

  send(iws: IDWebSocket | IDUDPWebSocket, packet: JSONPacket): void {
    iws.send(JSON.stringify(packet));
  }

  dispatch(iws: IDWebSocket | IDUDPWebSocket, packet: JSONPacket): void {
    const callback = this._callbacks.get(packet.event);
    if (callback !== undefined) {
      callback(iws, packet.data);
    }
  }
}

export class BinaryWebSocketServerHandler {
  private _wss: WebSocket.Server | UDPWebSocketServer;
  private _callbacks = new Array<Function>();
  
  constructor(port: number, private _type: WebSocketType = WebSocketType.TCP) {
    this._wss = this._type === WebSocketType.TCP ? new WebSocket.Server({ port }) : new UDPWebSocketServer(port);
    
    this._wss.on('connection', ws => {
      console.log('User connected');
      const iws = this._type === WebSocketType.TCP ? ws as IDWebSocket : ws as IDUDPWebSocket;
      iws.binaryType = 'arraybuffer';
      iws.uuid = count++;
      console.log(`iws.uuid: ${iws.uuid}`);
      
      iws.on('message', data => {
        this.dispatch(iws, data as ArrayBuffer);
      });
    
      iws.on('close', () => {
        console.log('User disconnected');
      });
    });
  }

  bind(event: number, callback: (iws: IDWebSocket, data: ArrayBuffer) => void): void {
    this._callbacks[event] = callback;
  }

  send(iws: IDWebSocket | IDUDPWebSocket, buffer: ArrayBuffer): void {
    iws.send(buffer);
  }

  dispatch(iws: IDWebSocket | IDUDPWebSocket, buffer: ArrayBuffer): void {
    const view = new DataView(buffer);
    this._callbacks[view.getUint8(0)](iws, buffer);
  }
}