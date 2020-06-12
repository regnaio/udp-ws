import { UDPWebSocket } from './../../../src/client/ts/UDPWebSocket';

const ws = new UDPWebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('open');
};

ws.onmessage = ev => {
  console.log(`onmessage ev: ${ev}`);
};

ws.onerror = ev => {
  console.log(`onerror ev: ${ev}`);
};

ws.onclose = () => {
  console.log('close');
};