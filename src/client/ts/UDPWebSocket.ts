import { JSONWebSocketHandler } from './JSONWebSocketHandler';
// import { defaultIceServers } from './iceServers';

export class UDPWebSocket {
  private _localPeerConnection: RTCPeerConnection;
  private _JSONWebSocketHandler: JSONWebSocketHandler;
  private _dataChannel: RTCDataChannel;

  constructor(url: string, configuration: RTCConfiguration | undefined = undefined) {
    this._JSONWebSocketHandler = new JSONWebSocketHandler(url, {
      eventName: 'connect',
      data: {}
    });
    this.bindCallbacks();

    if (configuration === undefined) {
      configuration = {
        // @ts-ignore
        sdpSemantics: 'unified-plan',
        // iceServers: defaultIceServers
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

    this._dataChannel.onopen = () => {
      console.log(`onopen readyState: ${this._dataChannel.readyState}`);
      this._dataChannel.onmessage = (event: MessageEvent) => {
        console.log(`onmessage event: ${event}`);

      };

    };
    this._dataChannel.onclose = () => {
      console.log(`onclose readyState: ${this._dataChannel.readyState}`);

    };
  }

  get readyState(): RTCDataChannelState {
    return this._dataChannel.readyState;
  }

  // Public API start
  onmessage() {}

  onopen() {}

  onerror() {}

  send(data: string | ArrayBuffer | SharedArrayBuffer | Blob | ArrayBufferView) {}
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