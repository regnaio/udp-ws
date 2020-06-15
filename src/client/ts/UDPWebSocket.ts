import { WebSocketHandler } from './WebSocketHandler';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _webSocketHandler: WebSocketHandler;
  private _dataChannel?: RTCDataChannel;

  onopen: ((ev: Event) => any) = ev => {};
  onmessage: ((ev: MessageEvent) => any) = ev => {};
  onerror: ((ev: Event) => any) = ev => {};
  onclose: ((ev: CloseEvent) => any) = ev => {};

  constructor(url: string, configuration?: RTCConfiguration) {
    this._webSocketHandler = new WebSocketHandler(url);
    this.bindCallbacks();
    this.startSignaling();

    if (configuration === undefined) {
      configuration = {
        // @ts-ignore
        sdpSemantics: 'unified-plan',
        iceTransportPolicy: 'all'
      };
    }

    this._localPeerConnection = new RTCPeerConnection(configuration);
    this._localPeerConnection.ondatachannel = this.onDataChannel.bind(this);
  }

  // Public API start
  get readyState(): RTCDataChannelState {
    return this._dataChannel?.readyState || 'closed';
  }

  set binaryType(binaryType: string) {
    if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
    if (this._dataChannel === undefined) throw `this._dataChannel === undefined`;
    this._dataChannel.binaryType = binaryType;
  }

  send(data: any): void {
    if (this._dataChannel === undefined) {
      throw `send this._dataChannel === undefined`;
    }
    
    this._dataChannel.send(data);
  }
  
  close(): void {
    this._localPeerConnection.close();
  }
  // Public API end

  private async startSignaling(): Promise<void> {
    try {
      await this._webSocketHandler.connect();
      this._webSocketHandler.send({
        event: 'connect',
        data: {}
      });
    } catch (err) {
      throw err;
    }
  }

  private bindCallbacks(): void {
    this._webSocketHandler.bind('offer', async (data) => {
      console.log('bind offer data: ', data);

      try {
        await this._localPeerConnection.setRemoteDescription(data as RTCSessionDescriptionInit);
        await this._localPeerConnection.setLocalDescription(await this._localPeerConnection.createAnswer());
        this._webSocketHandler.send({
          event: 'answer',
          data: this._localPeerConnection.localDescription || {}
        });
      } catch (err) {
        throw err;
      }
    });

    this._webSocketHandler.bind('icecandidate', (data) => {
      console.log('bind icecandidate data: ', data);
      
      // @ts-ignore
      this._localPeerConnection.addIceCandidate(data);
    });
  }

  private onDataChannel(ev: RTCDataChannelEvent): void {
    this._dataChannel = ev.channel;

    this._dataChannel.onopen = (ev: Event) => {
      console.log('this._dataChannel.onopen this: ', this)
      console.log(`onopen readyState: ${this._dataChannel!.readyState}`);
      console.log('onopen ev: ', ev);

      this.onopen(ev);

      this._dataChannel!.onmessage = (ev: MessageEvent) => {
        console.log('onmessage ev: ', ev);

        this.onmessage(ev);
      };

    };
    this._dataChannel.onerror = (ev: Event) => {
      console.log('onerror ev: ', ev);

      this.onerror(ev);
    };
    this._dataChannel.onclose = (ev: Event) => {
      console.log(`onclose readyState: ${this._dataChannel!.readyState}`);
      console.log('onclose ev: ', ev);

      this.onclose(ev as CloseEvent);
    };
  }
}