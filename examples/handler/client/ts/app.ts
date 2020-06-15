import { WebSocketType, WebSocketHandler } from './../../../../src/client/ts/WebSocketHandler';

(async () => {
  const webSocketHandler = new WebSocketHandler('ws://localhost:3000', WebSocketType.UDP);
  // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);

  webSocketHandler.bind('server', data => {
    console.log(data);
  });

  try {
    await webSocketHandler.connect();
    
    setInterval(() => {
      webSocketHandler.send({
        event: 'client',
        data: {}
      });
    }, 1000);
  } catch (err) {
    throw err;
  }
})();