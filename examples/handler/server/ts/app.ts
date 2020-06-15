import express from 'express';
const app = express();

import { WebSocketType, WebSocketServerHandler } from './../../../../src/server/ts/WebSocketServerHandler';

const webSocketServerHandler = new WebSocketServerHandler(3000, WebSocketType.UDP);

webSocketServerHandler.bind('client', (iws, data) => {
	console.log(data);
	webSocketServerHandler.send(iws, {
		event: 'server',
		data: {}
	})
});

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});