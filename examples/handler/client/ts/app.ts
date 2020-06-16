import { WebSocketType, WebSocketHandler } from './../../../../src/client/ts/WebSocketHandler';

(async () => {
  const webSocketHandler = new WebSocketHandler('ws://localhost:3000', WebSocketType.UDP);
  // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);

  webSocketHandler.bind('ServerResponseEvent', data => {
    console.log(data);
  });

  try {
    await webSocketHandler.connect();

    // Code that must be executed only after the WebSocket is open
    setInterval(() => {
      webSocketHandler.send({
        event: 'ClientMessageEvent',
        data: {
          message: 'client says hi'
        }
      });
    }, 1000);
  } catch (err) {
    throw err;
  }
})();