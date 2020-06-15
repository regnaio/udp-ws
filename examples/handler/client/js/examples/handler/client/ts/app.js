"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const WebSocketHandler_1 = require("./../../../../src/client/ts/WebSocketHandler");
(() => __awaiter(void 0, void 0, void 0, function* () {
    const webSocketHandler = new WebSocketHandler_1.WebSocketHandler('ws://localhost:3000', WebSocketHandler_1.WebSocketType.UDP);
    // const webSocketHandler = new WebSocketHandler('ws://13.59.33.46:3000', WebSocketType.UDP);
    webSocketHandler.bind('server', data => {
        console.log(data);
    });
    try {
        yield webSocketHandler.connect();
        setInterval(() => {
            webSocketHandler.send({
                event: 'client',
                data: {}
            });
        }, 1000);
    }
    catch (err) {
        throw err;
    }
}))();
