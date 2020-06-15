import express from 'express';
const app = express();

import { WebSocketType, BinaryWebSocketServerHandler } from './../../../../src/server/ts/WebSocketServerHandler';
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
	NumberEvent = 0,
	StringEvent
}

const webSocketServerHandler = new BinaryWebSocketServerHandler(3000, WebSocketType.UDP);

webSocketServerHandler.bind(WebSocketEvent.NumberEvent, (iws, buffer) => {
	const inView = new DataView(buffer);
	console.log(inView.getFloat64(NUM_BYTES_UINT8));

	const outBuffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
	const outView = new DataView(outBuffer);
	outView.setUint8(0, WebSocketEvent.NumberEvent);
	outView.setFloat64(NUM_BYTES_UINT8, 9876.54321);
	webSocketServerHandler.send(iws, outBuffer);
});

webSocketServerHandler.bind(WebSocketEvent.StringEvent, (iws, buffer) => {
	console.log(bufferToString(buffer.slice(NUM_BYTES_UINT8)));

	const outBuffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 14);
	const outView = new DataView(outBuffer);
	outView.setUint8(0, WebSocketEvent.StringEvent);
	writeStringToBuffer('server says hi', outBuffer, NUM_BYTES_UINT8);
	webSocketServerHandler.send(iws, outBuffer);
});

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});