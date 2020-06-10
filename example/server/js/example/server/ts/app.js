"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = express_1.default();
const UDPWebSocket_1 = require("./../../../src/server/ts/UDPWebSocket");
new UDPWebSocket_1.UDPWebSocket(3000);
// see tsconfig rootDirs and js folder to see why we have so many ../
app.use(express_1.default.static(__dirname + '/../../../../../client/'));
app.listen(80, () => {
    console.log('Running on http://localhost/');
});
