import express from 'express';
const app = express();

import { WebSocketType, WebSocketServerHandler } from './../../../../src/server/ts/WebSocketServerHandler';

// WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
const webSocketServerHandler = new WebSocketServerHandler(3000, WebSocketType.UDP);

webSocketServerHandler.bind('ClientMessageEvent', (iws, data) => {
	console.log(data);
	webSocketServerHandler.send(iws, {
		event: 'ServerResponseEvent',
		data: {
			reply: 'server says hi'
		}
	});
});

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});