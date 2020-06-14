interface JSONWebSocketPacket {
  eventName: string,
  data: object
}

export class JSONWebSocketHandler {
  private _callbacks = new Map<string, Function>();
  private _ws?: WebSocket;

  constructor(private _url: string) {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ws = new WebSocket(this._url);
      this._ws.binaryType = 'arraybuffer';
      this._ws.onmessage = evt => {
        const packet = JSON.parse(evt.data);
        this.dispatch(packet);
      };
      this._ws.onopen = () => {
        resolve();
      };
      this._ws.onerror = err => {
        reject(err);
      };
    });
  }

  bind(eventName: string, callback: (data: object) => void): void {
    this._callbacks.set(eventName, callback);
  }

  send(packet: JSONWebSocketPacket): void {
    const payload = JSON.stringify(packet);
    if (this._ws === undefined) throw 'WebSocket is undefined!';
    this._ws.send(payload);
  }

  dispatch(packet: JSONWebSocketPacket): void {
    const callback = this._callbacks.get(packet.eventName);
    if (callback !== undefined) {
      callback(packet.data);
    }
  }
}
