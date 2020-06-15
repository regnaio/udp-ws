import { UDPWebSocket } from './UDPWebSocket';

// Type of WebSocket being handled
export enum WebSocketType {
  TCP, // WebSocket
  UDP // UDPWebSocket
}

interface JSONPacket {
  event: string,
  data: object
}

// Handles WebSocket or UDPWebSocket with JSON packets
export class WebSocketHandler {
  private _callbacks = new Map<string, Function>();
  private _ws: WebSocket | UDPWebSocket;

  constructor(private _url: string, private _type: WebSocketType = WebSocketType.TCP) {
    this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket(this._url);
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ws.onmessage = ev => {
        const packet = JSON.parse(ev.data);
        this.dispatch(packet);
      };
      this._ws.onclose = ev => {

      };
      this._ws.onopen = ev => {
        resolve();
      };
      this._ws.onerror = ev => {
        reject(ev);
      };

      if (this._ws.readyState === WebSocket.OPEN) {
        resolve();
      }
    });
  }

  bind(event: string, callback: (data: object) => void): void {
    this._callbacks.set(event, callback);
  }

  send(packet: JSONPacket): void {
    this._ws.send(JSON.stringify(packet));
  }

  dispatch(packet: JSONPacket): void {
    const callback = this._callbacks.get(packet.event);
    if (callback !== undefined) {
      callback(packet.data);
    }
  }
}

// Handles WebSocket or UDPWebSocket with ArrayBuffer packets
export class BinaryWebSocketHandler {
  private _callbacks = new Array<Function>();
  private _ws: WebSocket | UDPWebSocket;

  constructor(private _url: string, private _type: WebSocketType = WebSocketType.TCP) {
    this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket(this._url);
    this._ws.binaryType = 'arraybuffer';
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ws.onmessage = ev => {
        this.dispatch(ev.data as ArrayBuffer);
      };
      this._ws.onclose = ev => {

      };
      this._ws.onopen = ev => {
        resolve();
      };
      this._ws.onerror = ev => {
        reject(ev);
      };
      
      if (this._ws.readyState === WebSocket.OPEN) {
        resolve();
      }
    });
  }

  bind(event: number, callback: (data: ArrayBuffer) => void): void {
    this._callbacks[event] = callback;
  }

  send(packet: ArrayBuffer): void {
    this._ws.send(packet);
  }

  dispatch(packet: ArrayBuffer): void {
    const view = new DataView(packet, 0, 1);
    this._callbacks[view.getUint8(0)](packet);
  }
}