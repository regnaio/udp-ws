"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const WebSocketServerHandler_1 = require("./../../../../src/server/ts/WebSocketServerHandler");
const webSocketServerHandler = new WebSocketServerHandler_1.WebSocketServerHandler(3000, WebSocketServerHandler_1.WebSocketType.UDP);
webSocketServerHandler.bind('client', (iws, data) => {
    console.log(data);
    webSocketServerHandler.send(iws, {
        event: 'server',
        data: {}
    });
});
// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express_1.default.static(__dirname + '/../../../../../../client/'));
app.listen(80, () => {
    console.log('Running on http://localhost/');
});
