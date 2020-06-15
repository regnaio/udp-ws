# udp-ws

## Motivation

<em>“I feel what is needed is an UDP version of WebSockets. That’s all I wish we had.”</em> - Matheus Valadares, creator of [agar.io](https://agar.io/)

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) is built on TCP. UDP is much preferred over TCP for networking in realtime multiplayer games. Refer to the awesome visualizations in [Gaffer On Games: Deterministic Lockstep](https://gafferongames.com/post/deterministic_lockstep/) to see why.

<em>udp-ws</em> is built on [WebRTC](https://webrtc.org/), which allows peer-to-peer UDP communication in the browser. However, <em>udp-ws</em> is designed for client-server communication (e.g. for server-authoritative browser games), not for peer-to-peer communication. <em>udp-ws</em> accomplishes this by treating your server as a peer.

<em>udp-ws</em> is inspired by and includes code snippets from [geckos.io](https://github.com/geckosio/geckos.io) by [yandeu](https://github.com/yandeu) and [node-webrtc-examples](https://github.com/node-webrtc/node-webrtc-examples).

<br>

## Examples

#### 1. `examples/barebones/` - Barebones example of
- `UDPWebSocket`
- `UDPWebSocketServer`

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

In `examples/handler/server/`, run `npm i` followed by `npm run launch`.

<br>

#### 3. `examples/binaryHandler/` - Handling WebSocket live cycle, binary messaging, and events using
- `BinaryWebSocketHandler`
- `BinaryWebSocketServerHandler`

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

If you want Javascript sources, in `src/`, run `npm run build` to compile TypeScript to Javascript in `src/client/js/` and `src/server/js/`. Feel free to use [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en/) for browser compatibility (on the client side) and minification.

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
