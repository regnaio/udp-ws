"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UDPWebSocket_1 = require("./../../../src/client/ts/UDPWebSocket");
const ws = new UDPWebSocket_1.UDPWebSocket('ws://localhost:3000');
ws.onopen = ev => {
    console.log('open');
};
ws.onmessage = ev => {
    console.log(`onmessage ev: ${ev}`);
};
ws.onerror = ev => {
    console.log(`onerror ev: ${ev}`);
};
ws.onclose = ev => {
    console.log('close');
};
setInterval(() => {
    if (ws.readyState === 'open') {
        ws.send('hi');
    }
}, 1000);
