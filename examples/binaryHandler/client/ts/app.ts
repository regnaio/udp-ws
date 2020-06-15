import { WebSocketType, BinaryWebSocketHandler } from './../../../../src/client/ts/WebSocketHandler';
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
  NumberEvent = 0,
  StringEvent
}

(async () => {
  const webSocketHandler = new BinaryWebSocketHandler('ws://localhost:3000', WebSocketType.UDP);
  // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);

  webSocketHandler.bind(WebSocketEvent.NumberEvent, data => {
    console.log(data);
  });

  webSocketHandler.bind(WebSocketEvent.StringEvent, data => {
    console.log(data);
  });

  try {
    await webSocketHandler.connect();

    setInterval(() => {
      const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
      const view = new DataView(buffer);
      view.setUint8(0, WebSocketEvent.NumberEvent);
      view.setFloat64(NUM_BYTES_UINT8, 12345.6789);
      webSocketHandler.send(buffer);
    }, 1000);

    // setInterval(() => {
    //   const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 20);
    //   const view = new DataView(buffer);
    //   view.setUint8(0, WebSocketEvent.StringEvent);
    //   writeStringToBuffer('client says hi', buffer, NUM_BYTES_UINT8);
    //   webSocketHandler.send(buffer);
    // }, 1000);
  } catch (err) {
    throw err;
  }
})();