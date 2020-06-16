# udp-ws

## Motivation

<em>“I feel what is needed is an UDP version of WebSockets. That’s all I wish we had.”</em> - Matheus Valadares, creator of [agar.io](https://agar.io/)

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) is built on TCP. UDP is much preferred over TCP for networking in realtime multiplayer games. Refer to the awesome visualizations in [Gaffer On Games: Deterministic Lockstep](https://gafferongames.com/post/deterministic_lockstep/) to see why.

<em>udp-ws</em> is built on [WebRTC](https://webrtc.org/), which allows peer-to-peer UDP communication in the browser. However, <em>udp-ws</em> is designed for client-server communication (e.g. for server-authoritative browser games), not for peer-to-peer communication. <em>udp-ws</em> accomplishes this by treating your server as a peer.

<em>udp-ws</em> is inspired by and includes code snippets from [geckos.io](https://github.com/geckosio/geckos.io) by [yandeu](https://github.com/yandeu) and [node-webrtc-examples](https://github.com/node-webrtc/node-webrtc-examples).

<br>

## Examples

#### 1. `examples/barebones/` - Barebones example of
- [`UDPWebSocket`](https://github.com/regnaio/udp-ws/blob/master/src/client/ts/UDPWebSocket.ts)
- [`UDPWebSocketServer`](https://github.com/regnaio/udp-ws/blob/master/src/server/ts/UDPWebSocketServer.ts)

<br>

Client (resembles [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)):
<pre>
const ws = new <b>UDPWebSocket</b>('ws://localhost:3000');

ws.onmessage = ev => {
    console.log(ev.data);
};

setInterval(() => {
    if (ws.readyState === 'open') {
        ws.send('client says hi');
    }
}, 1000);
</pre>

Server (resembles [ws](https://www.npmjs.com/package/ws)):
<pre>
const wss = new <b>UDPWebSocketServer</b>(3000);

wss.on('connection', ws => {
    ws.on('message', data => {
        console.log(data);
        if (ws.readyState === 'open') {
            ws.send('server says hi');
        }
    });
});
</pre>

In `examples/barebones/server/`, run `npm i` followed by `npm run launch`, and see the client-server example running in [localhost](http://localhost/). Observe the output in your console log (e.g. using `Ctrl` + `Shift` + `I` in Windows Chrome).

<br>

#### 2. `examples/handler/` - Handling WebSocket life cycle, messaging, and events using
- `WebSocketHandler`
- `WebSocketServerHandler`

<br>

Structure of packet: JSON object:
<pre>
{
    event: '<em>string representing event</em>',
    data: { <em>arbitrary object representing data</em> }
}
</pre>

<br>

Client:
<pre>
(async () => {
    const webSocketHandler = new <b>WebSocketHandler</b>('ws://localhost:3000', WebSocketType.UDP);

    webSocketHandler.bind('server', data => {
        console.log(data);
    });

    try {
        await webSocketHandler.connect();

        setInterval(() => {
            webSocketHandler.send({
                event: 'client',
                data: {}
            });
        }, 1000);
    } catch (err) {
        throw err;
    }
})();
</pre>

Server:
<pre>
const webSocketServerHandler = new <b>WebSocketServerHandler</b>(3000, WebSocketType.UDP);

webSocketServerHandler.bind('client', (iws, data) => {
    console.log(data);
    webSocketServerHandler.send(iws, {
        event: 'server',
        data: {}
    });
});
</pre>

In `examples/handler/server/`, run `npm i` followed by `npm run launch`.

<br>

#### 3. `examples/binaryHandler/` - Handling WebSocket life cycle, binary messaging, and events using
- `BinaryWebSocketHandler`
- `BinaryWebSocketServerHandler`

<br>

Structure of packet: `ArrayBuffer` with leading `Uint8` representing the event (thus 2^8 = 256 maximum handled events unless `Uint8` is replaced with something greater, e.g. `Uint16`) followed by an arbitrary number of bytes representing the data

<br>

Client:
<pre>
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
  NumberEvent = 0,
  StringEvent
}

(async () => {
    const webSocketHandler = new <b>BinaryWebSocketHandler</b>('ws://localhost:3000', WebSocketType.UDP);

    webSocketHandler.bind(WebSocketEvent.NumberEvent, buffer => {
        const inView = new DataView(buffer);
        console.log(inView.getFloat64(NUM_BYTES_UINT8));
    });

    webSocketHandler.bind(WebSocketEvent.StringEvent, buffer => {
        console.log(bufferToString(buffer.slice(NUM_BYTES_UINT8)));
    });

    try {
        await webSocketHandler.connect();

        setInterval(() => {
            const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
            const view = new DataView(buffer);
            view.setUint8(0, WebSocketEvent.NumberEvent);
            view.setFloat64(NUM_BYTES_UINT8, 12345.6789);
            webSocketHandler.send(buffer);
        }, 1000);

        setInterval(() => {
            const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 14);
            const view = new DataView(buffer);
            view.setUint8(0, WebSocketEvent.StringEvent);
            writeStringToBuffer('client says hi', buffer, NUM_BYTES_UINT8);
            webSocketHandler.send(buffer);
        }, 1000);
    } catch (err) {
        throw err;
    }
})();
</pre>

Server:
<pre>
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
    NumberEvent = 0,
    StringEvent
}

const webSocketServerHandler = new <b>BinaryWebSocketServerHandler</b>(3000, WebSocketType.UDP);

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
</pre>

<br>

In `examples/binaryHandler/server/`, run `npm i` followed by `npm run launch`.

<br>

## Prerequisites

- Install `node` and `npm`
- Install TypeScript
    - `npm i -g typescript`
- Install [webpack](https://webpack.js.org/)
    - `npm i -g webpack`
- Install webpack-cli
    - `npm i -g webpack-cli`

Run `npm i` in `examples/barebones/server/` to install all npm packages for all required folders (via [postinstall](https://docs.npmjs.com/misc/scripts)).

You can then run `npm run launch` in `example/server/`, as mentioned above.

<br>

## Repository Structure

#### `src/` contains the library source code
- `src/`
  - `client/`
    - `ts/` contains client-side `UDPWebSocket.ts` and `WebSocketHandler.ts`
  - `server/`
    - `ts/` contains server-side `UDPWebSocketServer.ts` and `WebSocketServerHandler.ts`

If you want Javascript sources, in `src/`, run `npm run build` to compile TypeScript to Javascript in `src/client/js/` and `src/server/js/`. Feel free to use [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en/) for browser compatibility (on the client side) and/or minification.

<br>

#### `examples/` contains examples using the library source code
- `examples/`
  - `barebones/`
    - `client/`
      - `ts/` contains a client-side example using `UDPWebSocket.ts`
    - `server/`
      - `ts/` contains a server-side example using `UDPWebSocketServer.ts`
  - `handler/`
    - `client/`
      - `ts/` contains a client-side example using `WebSocketHandler.ts`
    - `server/`
      - `ts/` contains a server-side example using `WebSocketServerHandler.ts`
  - `binaryHandler/`
    - `client/`
      - `ts/` contains a client-side example using `BinaryWebSocketHandler.ts`
    - `server/`
      - `ts/` contains a server-side example using `BinaryWebSocketServerHandler.ts`

<br>

**gbz**
