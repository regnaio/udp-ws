import express from 'express';
const app = express();

import { UDPWebSocket } from './../../../src/server/ts/UDPWebSocket';

new UDPWebSocket(3000);

// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express.static(__dirname + '/../../../../../client/'));

app.listen(80, () => {
	console.log('Running on http://localhost/');
});