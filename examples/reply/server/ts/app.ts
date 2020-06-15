import express from 'express';
const app = express();

import { UDPWebSocketServer } from './../../../../src/server/ts/UDPWebSocketServer';
import { WebSocketServerHandler } from './../../../../src/server/ts/WebSocketServerHandler';

const wss = new UDPWebSocketServer(3000);

wss.on('connection', ws => {
	// setTimeout(() => {
	// 	ws.close();
	// }, 5000);

	ws.on('message', data => {
		console.log(data);
		if (ws.readyState === 'open') {
			ws.send('server says hi');
		}
	});

	ws.on('close', () => {
		console.log('close');
	});
});


// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});