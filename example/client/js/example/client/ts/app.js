"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UDPWebSocket_1 = require("./../../../src/client/ts/UDPWebSocket");
const ws = new UDPWebSocket_1.UDPWebSocket('ws://localhost:3000');
// const ws = new UDPWebSocket('ws://13.59.33.46:3000');
ws.onopen = ev => {
    console.log('open ev', ev);
    ws.binaryType = 'arraybuffer';
};
ws.onmessage = ev => {
    console.log('onmessage ev.data: ', ev.data);
};
ws.onerror = ev => {
    console.log('onerror ev: ', ev);
};
ws.onclose = ev => {
    console.log('close ev', ev);
};
setInterval(() => {
    if (ws.readyState === 'open') {
        ws.send('client says hi');
    }
}, 1000);
