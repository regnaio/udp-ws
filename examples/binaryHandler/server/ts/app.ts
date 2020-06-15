import express from 'express';
const app = express();

import { WebSocketType, BinaryWebSocketServerHandler } from './../../../../src/server/ts/WebSocketServerHandler';
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
	NumberEvent = 0,
	StringEvent
}

const webSocketServerHandler = new BinaryWebSocketServerHandler(3000, WebSocketType.UDP)

webSocketServerHandler.bind(WebSocketEvent.NumberEvent, (iws, data) => {
	console.log(data);
	const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
	const view = new DataView(buffer);
	view.setUint8(0, WebSocketEvent.NumberEvent);
	view.setFloat64(NUM_BYTES_FLOAT64, 9876.54321);
	webSocketServerHandler.send(iws, buffer);
});

webSocketServerHandler.bind(WebSocketEvent.StringEvent, (iws, data) => {
	console.log(data);
	const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 14);
	const view = new DataView(buffer);
	view.setUint8(0, WebSocketEvent.StringEvent);
	writeStringToBuffer('server says hi', buffer, NUM_BYTES_UINT8);
	webSocketServerHandler.send(iws, buffer);
});

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});