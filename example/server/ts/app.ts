import express from 'express';
const app = express();

import { UDPWebSocketServer } from '../../../src/server/ts/UDPWebSocketServer';

const wss = new UDPWebSocketServer(3000);
wss.on('connection', ws => {
	ws.on('message', data => {
		console.log(data);
	});

	ws.on('close', () => {
		console.log('close');
	});
});

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});