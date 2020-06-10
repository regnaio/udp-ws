type JSONData = { [key: string]: string }

interface JSONWebSocketPacket {
  eventName: string,
  data: JSONData
}

export class JSONWebSocketHandler {
  private _callbacks = new Map<string, Function>();
  private _ws?: WebSocket;

  constructor(private _url: string, private _firstPacket: JSONWebSocketPacket) {
    this.use();
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._ws = new WebSocket(this._url);
      this._ws.onopen = () => {
        resolve();
      };
      this._ws.onerror = err => {
        reject(err);
      };
    });
  }

  async use(): Promise<void> {
    try {
      await this.connect();
      if (!this._ws) throw 'WebSocket is undefined!';
      this._ws.onmessage = evt => {
        const packet = JSON.parse(evt.data);
        this.dispatch(packet);
      };
      this.send(this._firstPacket);
    } catch (err) {
      throw err;
    }
  }

  bind(eventName: string, callback: (data: JSONData) => void): void {
    this._callbacks.set(eventName, callback);
  }

  send(packet: JSONWebSocketPacket): void {
    const payload = JSON.stringify(packet);
    if (!this._ws) throw 'WebSocket is undefined!';
    this._ws.send(payload);
  }

  dispatch(packet: JSONWebSocketPacket): void {
    const callback = this._callbacks.get(packet.eventName);
    if (callback !== undefined) {
      callback(packet.data);
    }
  }
}
