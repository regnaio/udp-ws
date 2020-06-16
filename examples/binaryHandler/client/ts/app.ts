import { WebSocketType, BinaryWebSocketHandler } from './../../../../src/client/ts/WebSocketHandler';
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

// Uint8 representing event (NumberEvent = 0, StringEvent = 1),
// which is the first byte of each packet sent and received
enum WebSocketEvent {
  NumberEvent = 0,
  StringEvent
}

(async () => {
  // WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
  const webSocketHandler = new BinaryWebSocketHandler('ws://localhost:3000', WebSocketType.UDP);
  // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);

  webSocketHandler.bind(WebSocketEvent.NumberEvent, buffer => {
    const view = new DataView(buffer);
    // read Float64 after first byte representing event
    console.log(view.getFloat64(NUM_BYTES_UINT8));
  });

  webSocketHandler.bind(WebSocketEvent.StringEvent, buffer => {
    // read string after first byte representing event
    console.log(bufferToString(buffer.slice(NUM_BYTES_UINT8)));
  });

  try {
    await webSocketHandler.connect();

    // Code that must be executed only after the WebSocket is open
    setInterval(() => {
      const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
      const view = new DataView(buffer);
      // set first byte representing event
      view.setUint8(0, WebSocketEvent.NumberEvent);
      // set Float64 after first byte
      view.setFloat64(NUM_BYTES_UINT8, 12345.6789);
      webSocketHandler.send(buffer);
    }, 1000);

    setInterval(() => {
      // 14 characters needed for 'client says hi'
      const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 14);
      const view = new DataView(buffer);
      // set first byte representing event
      view.setUint8(0, WebSocketEvent.StringEvent);
      // set string after first byte
      writeStringToBuffer('client says hi', buffer, NUM_BYTES_UINT8);
      webSocketHandler.send(buffer);
    }, 1000);
  } catch (err) {
    throw err;
  }
})();