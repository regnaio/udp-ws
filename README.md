# udp-ws

## Motivation

<em>“I feel what is needed is an UDP version of WebSockets. That’s all I wish we had.”</em> - Matheus Valadares, creator of [agar.io](https://agar.io/)

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) is built on TCP. UDP is much preferred over TCP for networking in realtime multiplayer games. Refer to the awesome visualizations in [Gaffer On Games: Deterministic Lockstep](https://gafferongames.com/post/deterministic_lockstep/) to see why.

udp-ws is built on [WebRTC](https://webrtc.org/), which allows peer-to-peer UDP communication in the browser. However, udp-ws is designed for client-server communication (e.g. for server-authoritative browser games), not for peer-to-peer communication. udp-ws accomplishes this by treating your server as a peer.

udp-ws is inspired by and includes code snippets from [geckos.io](https://github.com/geckosio/geckos.io) by [yandeu](https://github.com/yandeu) and [node-webrtc-examples](https://github.com/node-webrtc/node-webrtc-examples).

## Example

Client:
```
const ws = new UDPWebSocket('ws://localhost:3000');

setInterval(() => {
  if (ws.readyState === 'open') {
    ws.send('hi');
  }
}, 1000);
```

Server:
```
const wss = new UDPWebSocketServer(3000);

wss.on('connection', ws => {
	ws.on('message', data => {
		console.log(data);
	});
});
```

In `example/server/`, run `npm run launch`, and see the client-server example running in [localhost](http://localhost/). Open your console log using `Ctrl` + `Shift` + `I`.

## Repository Structure

- `src/`
  - `client/`
    - `ts/` contains client-side `UDPWebSocket.ts`
  - `server/`
    - `ts/` contains server-side `UDPWebSocketServer.ts`

If you want Javascript sources, in `src/`, run `npm run build` to compile TypeScript to Javascript in `src/client/js/` and `src/server/js/`. Feel free to use [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en/) for browser compatibility (on the client side) and minification.

- `example/`
  - `client/`
    - `ts/` contains client-side example using `UDPWebSocket.ts`
  - `server/`
    - `ts/` contains server-side example using `UDPWebSocketServer.ts`

In `example/server/`, run `npm run launch` to run the client-server example, as mentioned above. Note that webpack is used on the client side for browser compatibility.

<br>

**gbz**
