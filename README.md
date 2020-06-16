# udp-ws

## Motivation

<em>“I feel what is needed is an UDP version of WebSockets. That’s all I wish we had.”</em> - Matheus Valadares, creator of [agar.io](https://agar.io/)

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) is built on TCP. However, UDP is much preferred over TCP for networking in realtime multiplayer games. Refer to the awesome visualizations in [Gaffer On Games: Deterministic Lockstep](https://gafferongames.com/post/deterministic_lockstep/) to see why.

<em>udp-ws</em> is a UDP version of WebSocket built on [WebRTC](https://webrtc.org/), which allows peer-to-peer UDP communication in the browser. However, <em>udp-ws</em> is designed for client-server communication (e.g. for server-authoritative browser games), not for peer-to-peer communication. <em>udp-ws</em> accomplishes this by treating your server as a peer.

<em>udp-ws</em> is inspired by and includes code snippets from [geckos.io](https://github.com/geckosio/geckos.io) by [yandeu](https://github.com/yandeu) and [node-webrtc-examples](https://github.com/node-webrtc/node-webrtc-examples).

<br>

## Examples

#### 1. `examples/barebones/` - Barebones example of
- [`UDPWebSocket`](https://github.com/regnaio/udp-ws/blob/master/src/client/ts/UDPWebSocket.ts)
- [`UDPWebSocketServer`](https://github.com/regnaio/udp-ws/blob/master/src/server/ts/UDPWebSocketServer.ts)

<br>

Client (resembles [WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)):
```ts
const ws = new UDPWebSocket('ws://localhost:3000');

ws.onmessage = ev => {
    console.log(ev.data);
};

setInterval(() => {
    if (ws.readyState === 'open') {
        ws.send('client says hi');
    }
}, 1000);
```

Server (resembles [ws](https://www.npmjs.com/package/ws)):
```ts
const wss = new UDPWebSocketServer(3000);

wss.on('connection', ws => {
    ws.on('message', data => {
        console.log(data);
        if (ws.readyState === 'open') {
            ws.send('server says hi');
        }
    });
});
```

In `examples/barebones/server/`, run `npm i` followed by `npm run launch`, and see the client-server example running in [localhost](http://localhost/). Observe the output in your console log (e.g. using `Ctrl` + `Shift` + `I` in Windows Chrome).

<br>

#### 2. `examples/handler/` - Handling WebSocket life cycle, messaging, and events using
- [`WebSocketHandler`](https://github.com/regnaio/udp-ws/blob/master/src/client/ts/WebSocketHandler.ts)
- [`WebSocketServerHandler`](https://github.com/regnaio/udp-ws/blob/master/src/server/ts/WebSocketServerHandler.ts)

<br>

Structure of packet: object conforming to [`JSON.stringify`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify) and [`JSON.parse`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse):
<pre>
{
    event: '<em>string representing event</em>',
    data: { <em>arbitrary object representing data</em> }
}
</pre>

<br>

Client:
```ts
(async () => {
    // WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
    const webSocketHandler = new WebSocketHandler('ws://localhost:3000', WebSocketType.UDP);

    webSocketHandler.bind('ServerResponseEvent', data => {
        console.log(data);
    });

    try {
        await webSocketHandler.connect();

        // Code that must be executed only after the WebSocket is open
        setInterval(() => {
            webSocketHandler.send({
                event: 'ClientMessageEvent',
                data: {
                    message: 'client says hi'
                }
            });
        }, 1000);
    } catch (err) {
        throw err;
    }
})();
```

Server:
```ts
// WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
const webSocketServerHandler = new WebSocketServerHandler(3000, WebSocketType.UDP);

webSocketServerHandler.bind('client', (iws, data) => {
    console.log(data);
    webSocketServerHandler.send(iws, {
        event: 'ServerResponseEvent',
        data: {
            reply: 'server says hi'
        }
    });
});
```

In `examples/handler/server/`, run `npm i` followed by `npm run launch`.

<br>

#### 3. `examples/binaryHandler/` - Handling WebSocket life cycle, binary messaging, and events using
- [`BinaryWebSocketHandler`](https://github.com/regnaio/udp-ws/blob/master/src/client/ts/WebSocketHandler.ts)
- [`BinaryWebSocketServerHandler`](https://github.com/regnaio/udp-ws/blob/master/src/server/ts/WebSocketServerHandler.ts)

<br>

Structure of packet: [`ArrayBuffer`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ArrayBuffer) with leading `Uint8` byte representing the event (thus 2^8 = 256 maximum handled events unless `Uint8` is replaced with something greater, e.g. `Uint16`) followed by an arbitrary number of bytes representing the data
```ts
ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_UINT32 * X + NUM_BYTES_FLOAT64 * Y + NUM_BYTES_CHAR * Z + ...)
```

<br>

Client:
```ts
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

// Uint8 representing event (NumberEvent = 0, StringEvent = 1),
// which is the first byte of each packet sent and received
enum WebSocketEvent {
    NumberEvent = 0,
    StringEvent
}

(async () => {
    // WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
    const webSocketHandler = new BinaryWebSocketHandler('ws://localhost:3000', WebSocketType.UDP);

    webSocketHandler.bind(WebSocketEvent.NumberEvent, buffer => {
        const view = new DataView(buffer);
        // read Float64 after first byte representing event
        console.log(view.getFloat64(NUM_BYTES_UINT8));
    });

    webSocketHandler.bind(WebSocketEvent.StringEvent, buffer => {
        // read string after first byte representing event
        console.log(bufferToString(buffer.slice(NUM_BYTES_UINT8)));
    });

    try {
        await webSocketHandler.connect();
        
        // Code that must be executed only after the WebSocket is open
        setInterval(() => {
            const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_FLOAT64);
            const view = new DataView(buffer);
            // set first byte representing event
            view.setUint8(0, WebSocketEvent.NumberEvent);
            // set Float64 after first byte
            view.setFloat64(NUM_BYTES_UINT8, 12345.6789);
            webSocketHandler.send(buffer);
        }, 1000);

        setInterval(() => {
            // 14 characters needed for 'client says hi'
            const buffer = new ArrayBuffer(NUM_BYTES_UINT8 + NUM_BYTES_CHAR * 14);
            const view = new DataView(buffer);
            // set first byte representing event
            view.setUint8(0, WebSocketEvent.StringEvent);
            // set string after first byte
            writeStringToBuffer('client says hi', buffer, NUM_BYTES_UINT8);
            webSocketHandler.send(buffer);
        }, 1000);
    } catch (err) {
        throw err;
    }
})();
```

Server:
```ts
import { NUM_BYTES_UINT8, NUM_BYTES_FLOAT64, NUM_BYTES_CHAR, writeStringToBuffer, bufferToString } from './binaryTools';

enum WebSocketEvent {
    NumberEvent = 0,
    StringEvent
}

// WebSocketType.TCP for WebSocket, WebSocketType.UDP for UDPWebSocket
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
```

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

Run `npm i` in `examples/<name of example>/server/` to install all npm packages for all required folders (via [postinstall](https://docs.npmjs.com/misc/scripts)).

You can then run `npm run launch` in `examples/<name of example>/server/`, as mentioned above.

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
