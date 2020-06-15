/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/examples/barebones/client/ts/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/examples/barebones/client/ts/app.js":
/*!************************************************!*\
  !*** ./js/examples/barebones/client/ts/app.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst UDPWebSocket_1 = __webpack_require__(/*! ./../../../../src/client/ts/UDPWebSocket */ \"./js/src/client/ts/UDPWebSocket.js\");\r\nconst ws = new UDPWebSocket_1.UDPWebSocket('ws://localhost:3000');\r\n// const ws = new UDPWebSocket('ws://13.59.33.46:3000');\r\nws.onopen = ev => {\r\n    console.log('open ev', ev);\r\n    ws.binaryType = 'arraybuffer';\r\n};\r\nws.onmessage = ev => {\r\n    console.log('onmessage ev.data: ', ev.data);\r\n};\r\nws.onerror = ev => {\r\n    console.log('onerror ev: ', ev);\r\n};\r\nws.onclose = ev => {\r\n    console.log('close ev', ev);\r\n};\r\nsetInterval(() => {\r\n    if (ws.readyState === 'open') {\r\n        ws.send('client says hi');\r\n    }\r\n}, 1000);\r\n\n\n//# sourceURL=webpack:///./js/examples/barebones/client/ts/app.js?");

/***/ }),

/***/ "./js/src/client/ts/UDPWebSocket.js":
/*!******************************************!*\
  !*** ./js/src/client/ts/UDPWebSocket.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst WebSocketHandler_1 = __webpack_require__(/*! ./WebSocketHandler */ \"./js/src/client/ts/WebSocketHandler.js\");\r\nclass UDPWebSocket {\r\n    constructor(url, configuration) {\r\n        this.onopen = ev => { };\r\n        this.onmessage = ev => { };\r\n        this.onerror = ev => { };\r\n        this.onclose = ev => { };\r\n        this._webSocketHandler = new WebSocketHandler_1.WebSocketHandler(url);\r\n        this.bindCallbacks();\r\n        this.startSignaling();\r\n        if (configuration === undefined) {\r\n            configuration = {\r\n                // @ts-ignore\r\n                sdpSemantics: 'unified-plan',\r\n                iceTransportPolicy: 'all'\r\n            };\r\n        }\r\n        this._localPeerConnection = new RTCPeerConnection(configuration);\r\n        this._localPeerConnection.ondatachannel = this.onDataChannel.bind(this);\r\n    }\r\n    // Public API start\r\n    get readyState() {\r\n        var _a;\r\n        return ((_a = this._dataChannel) === null || _a === void 0 ? void 0 : _a.readyState) || 'closed';\r\n    }\r\n    set binaryType(binaryType) {\r\n        if (binaryType !== 'blob' && binaryType !== 'arraybuffer')\r\n            throw `binaryType ${binaryType} does not exist!`;\r\n        if (this._dataChannel === undefined)\r\n            throw `this._dataChannel === undefined`;\r\n        this._dataChannel.binaryType = binaryType;\r\n    }\r\n    send(data) {\r\n        if (this._dataChannel === undefined) {\r\n            throw `send this._dataChannel === undefined`;\r\n        }\r\n        this._dataChannel.send(data);\r\n    }\r\n    close() {\r\n        this._localPeerConnection.close();\r\n    }\r\n    // Public API end\r\n    startSignaling() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            try {\r\n                yield this._webSocketHandler.connect();\r\n                this._webSocketHandler.send({\r\n                    event: 'connect',\r\n                    data: {}\r\n                });\r\n            }\r\n            catch (err) {\r\n                throw err;\r\n            }\r\n        });\r\n    }\r\n    bindCallbacks() {\r\n        this._webSocketHandler.bind('offer', (data) => __awaiter(this, void 0, void 0, function* () {\r\n            console.log('bind offer data: ', data);\r\n            try {\r\n                yield this._localPeerConnection.setRemoteDescription(data);\r\n                yield this._localPeerConnection.setLocalDescription(yield this._localPeerConnection.createAnswer());\r\n                this._webSocketHandler.send({\r\n                    event: 'answer',\r\n                    data: this._localPeerConnection.localDescription || {}\r\n                });\r\n            }\r\n            catch (err) {\r\n                throw err;\r\n            }\r\n        }));\r\n        this._webSocketHandler.bind('icecandidate', (data) => {\r\n            console.log('bind icecandidate data: ', data);\r\n            // @ts-ignore\r\n            this._localPeerConnection.addIceCandidate(data);\r\n        });\r\n    }\r\n    onDataChannel(ev) {\r\n        this._dataChannel = ev.channel;\r\n        this._dataChannel.onopen = (ev) => {\r\n            console.log('this._dataChannel.onopen this: ', this);\r\n            console.log(`onopen readyState: ${this._dataChannel.readyState}`);\r\n            console.log('onopen ev: ', ev);\r\n            this.onopen(ev);\r\n            this._dataChannel.onmessage = (ev) => {\r\n                console.log('onmessage ev: ', ev);\r\n                this.onmessage(ev);\r\n            };\r\n        };\r\n        this._dataChannel.onerror = (ev) => {\r\n            console.log('onerror ev: ', ev);\r\n            this.onerror(ev);\r\n        };\r\n        this._dataChannel.onclose = (ev) => {\r\n            console.log(`onclose readyState: ${this._dataChannel.readyState}`);\r\n            console.log('onclose ev: ', ev);\r\n            this.onclose(ev);\r\n        };\r\n    }\r\n}\r\nexports.UDPWebSocket = UDPWebSocket;\r\n\n\n//# sourceURL=webpack:///./js/src/client/ts/UDPWebSocket.js?");

/***/ }),

/***/ "./js/src/client/ts/WebSocketHandler.js":
/*!**********************************************!*\
  !*** ./js/src/client/ts/WebSocketHandler.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst UDPWebSocket_1 = __webpack_require__(/*! ./UDPWebSocket */ \"./js/src/client/ts/UDPWebSocket.js\");\r\n// Type of WebSocket being handled\r\nvar WebSocketType;\r\n(function (WebSocketType) {\r\n    WebSocketType[WebSocketType[\"TCP\"] = 0] = \"TCP\";\r\n    WebSocketType[WebSocketType[\"UDP\"] = 1] = \"UDP\"; // UDPWebSocket\r\n})(WebSocketType = exports.WebSocketType || (exports.WebSocketType = {}));\r\n// Handles WebSocket or UDPWebSocket with JSON packets\r\nclass WebSocketHandler {\r\n    constructor(_url, _type = WebSocketType.TCP) {\r\n        this._url = _url;\r\n        this._type = _type;\r\n        this._callbacks = new Map();\r\n        this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);\r\n    }\r\n    connect() {\r\n        return new Promise((resolve, reject) => {\r\n            this._ws.onmessage = ev => {\r\n                const packet = JSON.parse(ev.data);\r\n                this.dispatch(packet);\r\n            };\r\n            this._ws.onclose = ev => {\r\n            };\r\n            this._ws.onopen = ev => {\r\n                resolve();\r\n            };\r\n            this._ws.onerror = ev => {\r\n                reject(ev);\r\n            };\r\n            if (this._ws.readyState === WebSocket.OPEN) {\r\n                resolve();\r\n            }\r\n        });\r\n    }\r\n    bind(event, callback) {\r\n        this._callbacks.set(event, callback);\r\n    }\r\n    send(packet) {\r\n        this._ws.send(JSON.stringify(packet));\r\n    }\r\n    dispatch(packet) {\r\n        const callback = this._callbacks.get(packet.event);\r\n        if (callback !== undefined) {\r\n            callback(packet.data);\r\n        }\r\n    }\r\n}\r\nexports.WebSocketHandler = WebSocketHandler;\r\n// Handles WebSocket or UDPWebSocket with ArrayBuffer packets\r\nclass BinaryWebSocketHandler {\r\n    constructor(_url, _type = WebSocketType.TCP) {\r\n        this._url = _url;\r\n        this._type = _type;\r\n        this._callbacks = new Array();\r\n        this._ws = this._type === WebSocketType.TCP ? new WebSocket(this._url) : new UDPWebSocket_1.UDPWebSocket(this._url);\r\n        // this._ws.binaryType = 'arraybuffer';\r\n    }\r\n    connect() {\r\n        return new Promise((resolve, reject) => {\r\n            this._ws.onmessage = ev => {\r\n                this.dispatch(ev.data);\r\n            };\r\n            this._ws.onclose = ev => {\r\n            };\r\n            this._ws.onopen = ev => {\r\n                this._ws.binaryType = 'arraybuffer';\r\n                resolve();\r\n            };\r\n            this._ws.onerror = ev => {\r\n                reject(ev);\r\n            };\r\n            if (this._type === WebSocketType.TCP && this._ws.readyState === WebSocket.OPEN) {\r\n                resolve();\r\n            }\r\n            if (this._type === WebSocketType.UDP && this._ws.readyState === 'open') {\r\n                resolve();\r\n            }\r\n        });\r\n    }\r\n    bind(event, callback) {\r\n        this._callbacks[event] = callback;\r\n    }\r\n    send(buffer) {\r\n        this._ws.send(buffer);\r\n    }\r\n    dispatch(buffer) {\r\n        const view = new DataView(buffer);\r\n        this._callbacks[view.getUint8(0)](buffer);\r\n    }\r\n}\r\nexports.BinaryWebSocketHandler = BinaryWebSocketHandler;\r\n\n\n//# sourceURL=webpack:///./js/src/client/ts/WebSocketHandler.js?");

/***/ })

/******/ });