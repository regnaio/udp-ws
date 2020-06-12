import { JSONWebSocketHandler } from './JSONWebSocketHandler';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketHandler: JSONWebSocketHandler;
  private _dataChannel?: RTCDataChannel;

  onopen: ((ev: Event) => any) | null = null;
  onmessage: ((ev: MessageEvent) => any) | null = null;
  onerror: ((ev: Event) => any) | null = null;
  onclose: ((ev: CloseEvent) => any) | null = null;

  constructor(url: string, configuration?: RTCConfiguration) {
    this._JSONWebSocketHandler = new JSONWebSocketHandler(url, {
      eventName: 'connect',
      data: {}
    });
    this.bindCallbacks();

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

  get readyState(): RTCDataChannelState {
    return this._dataChannel?.readyState || 'closed';
  }

  // Public API start
  // send(data: string | Blob | ArrayBuffer | ArrayBufferView) {
  send(data: any) {
    if (this._dataChannel === undefined) {
      throw `send this._dataChannel === undefined`;
    }
    
    console.log('send data: ', data);
    this._dataChannel.send(data);
  }

  // set binaryType(binaryType: string) {
  //   if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
  //   this._dataChannel.binaryType = binaryType;
  // }
  // Public API end

  private bindCallbacks() {
    this._JSONWebSocketHandler.bind('offer', async (data) => {
      console.log('bind offer data: ', data);

      try {
        await this._localPeerConnection.setRemoteDescription(data as RTCSessionDescriptionInit);
        await this._localPeerConnection.setLocalDescription(await this._localPeerConnection.createAnswer());
        this._JSONWebSocketHandler.send({
          eventName: 'answer',
          data: this._localPeerConnection.localDescription || {}
        });
      } catch (err) {
        throw err;
      }
    });

    this._JSONWebSocketHandler.bind('icecandidate', (data) => {
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

      if (this.onopen !== null) {
        this.onopen(ev);
      }

      this._dataChannel!.onmessage = (ev: MessageEvent) => {
        console.log('onmessage ev: ', ev);

        if (this.onmessage !== null) {
          this.onmessage(ev);
        }
      };

    };
    this._dataChannel.onerror = (ev: Event) => {
      console.log('onerror ev: ', ev);

      if (this.onerror !== null) {
        this.onerror(ev);
      }
    };
    this._dataChannel.onclose = (ev: Event) => {
      console.log(`onclose readyState: ${this._dataChannel!.readyState}`);
      console.log('onclose ev: ', ev);

      if (this.onclose !== null) {
        this.onclose(ev as CloseEvent);
      }
    };
  }
}