# udp-ws

## Motivation

As quoted in [Gaffer On Games](https://gafferongames.com/post/why_cant_i_send_udp_packets_from_a_browser/),

<em>“I feel what is needed is an UDP version of WebSockets. That’s all I wish we had.”</em> - Matheus Valadares, creator of [agar.io](https://agar.io/)

[WebSocket](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) is built on TCP. UDP preferred over TCP for networking in realtime multiplayer games. See why this is according to [Gaffer On Games: Deterministic Lockstep](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket).

udp-ws is built on [WebRTC](https://webrtc.org/), which allows peer-to-peer UDP communication in the browser. However, udp-ws is designed for client-server communication (e.g. for server-authoritative browser games), not for peer-to-peer communication. udp-ws accomplishes this by treating your server as a peer.

## Example

Client:
```
TBD
```

Server:
```
TBD
```

In `example/server/`, run `npm run launch`, and see the client-server example running in [localhost](http://localhost/). Open your console log using `Ctrl` + `Shift` + `I`.

## Repository Structure

- `src/`
  - `client/`
    - `ts/` contains client-side `UDPWebSocket.ts`
  - `server/`
    - `ts/` contains server-side `UDPWebSocket.ts`

If you want Javascript sources, in `src/`, run `npm run build` to compile TypeScript to Javascript in `src/client/js/` and `src/server/js/`. Feel free to use [webpack](https://webpack.js.org/) or [rollup](https://rollupjs.org/guide/en/) for browser compatibility and minification.

- `example/`
  - `client/`
    - `ts/` contains client-side example using `UDPWebSocket.ts`
  - `server/`
    - `ts/` contains server-side example using `UDPWebSocket.ts`

In `example/server/`, run `npm run launch` to run the client-server example, as mentioned above.

<br>

**gbz**
