import { JSONWebSocketHandler } from './JSONWebSocketHandler';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketHandler: JSONWebSocketHandler;
  private _dataChannel: RTCDataChannel;

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
    this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);
    // this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);

    const dataChannelConfig = {
      ordered: false,
      maxRetransmits: 0
    };
    this._dataChannel = this._localPeerConnection.createDataChannel('dataChannel', dataChannelConfig);
    this._dataChannel.binaryType = 'arraybuffer';

    this._dataChannel.onopen = (ev: Event) => {
      console.log(`onopen readyState: ${this._dataChannel.readyState}`);
      console.log(`onopen ev: ${ev}`);

      if (this.onopen !== null) {
        this.onopen(ev);
      }

      this._dataChannel.onmessage = (ev: MessageEvent) => {
        console.log(`onmessage ev: ${ev}`);

        if (this.onmessage !== null) {
          this.onmessage(ev);
        }
      };

    };
    this._dataChannel.onerror = (ev: Event) => {
      console.log(`onerror ev: ${ev}`);

      if (this.onerror !== null) {
        this.onerror(ev);
      }
    };
    this._dataChannel.onclose = (ev: Event) => {
      console.log(`onclose readyState: ${this._dataChannel.readyState}`);
      console.log(`onclose ev: ${ev}`);

      if (this.onclose !== null) {
        this.onclose(ev as CloseEvent);
      }
    };
  }

  get readyState(): RTCDataChannelState {
    return this._dataChannel.readyState;
  }

  // Public API start
  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {

  }

  set binaryType(binaryType: string) {
    if (binaryType !== 'blob' && binaryType !== 'arraybuffer') throw `binaryType ${binaryType} does not exist!`;
    this._dataChannel.binaryType = binaryType;
  }
  // Public API end

  private bindCallbacks() {
    this._JSONWebSocketHandler.bind('offer', async (data) => {
      console.log(`bind offer data: ${data}`);

      try {
        await this._localPeerConnection.setRemoteDescription(data);
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
      console.log(`bind icecandidate data: ${data}`);
      
      // @ts-ignore
      this._localPeerConnection.addIceCandidate(data.candidate);
    });
  }

  private onIceCandidate(event: RTCPeerConnectionIceEvent) {
    console.log(`onIceCandidate event: ${event}`);
    if (event.candidate === null) {
      this._localPeerConnection.removeEventListener('icecandidate', this.onIceCandidate);
    }

    this._JSONWebSocketHandler.send({
      eventName: 'icecandidate',
      data: event.candidate || {}
    });
  }
  
  // private onDataChannelStateChange() {
  //   const readyState = this._dataChannel.readyState;
  //   console.log(`onDataChannelStateChange readyState: ${readyState}`);
  //   if (readyState === 'open') {

  //   } else {

  //   }
  // }
}