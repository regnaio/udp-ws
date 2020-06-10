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
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/example/client/ts/app.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/example/client/ts/app.js":
/*!*************************************!*\
  !*** ./js/example/client/ts/app.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst UDPWebSocket_1 = __webpack_require__(/*! ./../../../src/client/ts/UDPWebSocket */ \"./js/src/client/ts/UDPWebSocket.js\");\r\nnew UDPWebSocket_1.UDPWebSocket('ws://localhost:3000');\r\n\n\n//# sourceURL=webpack:///./js/example/client/ts/app.js?");

/***/ }),

/***/ "./js/src/client/ts/JSONWebSocketHandler.js":
/*!**************************************************!*\
  !*** ./js/src/client/ts/JSONWebSocketHandler.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nvar __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nclass JSONWebSocketHandler {\r\n    constructor(_url, _firstPacket) {\r\n        this._url = _url;\r\n        this._firstPacket = _firstPacket;\r\n        this._callbacks = new Map();\r\n        this.use();\r\n    }\r\n    connect() {\r\n        return new Promise((resolve, reject) => {\r\n            this._ws = new WebSocket(this._url);\r\n            this._ws.onopen = () => {\r\n                resolve();\r\n            };\r\n            this._ws.onerror = err => {\r\n                reject(err);\r\n            };\r\n        });\r\n    }\r\n    use() {\r\n        return __awaiter(this, void 0, void 0, function* () {\r\n            try {\r\n                yield this.connect();\r\n                if (!this._ws)\r\n                    throw 'WebSocket is undefined!';\r\n                this._ws.onmessage = evt => {\r\n                    const packet = JSON.parse(evt.data);\r\n                    this.dispatch(packet);\r\n                };\r\n                this.send(this._firstPacket);\r\n            }\r\n            catch (err) {\r\n                throw err;\r\n            }\r\n        });\r\n    }\r\n    bind(eventName, callback) {\r\n        this._callbacks.set(eventName, callback);\r\n    }\r\n    send(packet) {\r\n        const payload = JSON.stringify(packet);\r\n        if (!this._ws)\r\n            throw 'WebSocket is undefined!';\r\n        this._ws.send(payload);\r\n    }\r\n    dispatch(packet) {\r\n        const callback = this._callbacks.get(packet.eventName);\r\n        if (callback !== undefined) {\r\n            callback(packet.data);\r\n        }\r\n    }\r\n}\r\nexports.JSONWebSocketHandler = JSONWebSocketHandler;\r\n\n\n//# sourceURL=webpack:///./js/src/client/ts/JSONWebSocketHandler.js?");

/***/ }),

/***/ "./js/src/client/ts/UDPWebSocket.js":
/*!******************************************!*\
  !*** ./js/src/client/ts/UDPWebSocket.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nconst JSONWebSocketHandler_1 = __webpack_require__(/*! ./JSONWebSocketHandler */ \"./js/src/client/ts/JSONWebSocketHandler.js\");\r\nconst iceServers_1 = __webpack_require__(/*! ./iceServers */ \"./js/src/client/ts/iceServers.js\");\r\nclass UDPWebSocket {\r\n    constructor(url, configuration = undefined) {\r\n        this._JSONWebSocketHandler = new JSONWebSocketHandler_1.JSONWebSocketHandler(url, {\r\n            eventName: 'signal',\r\n            data: {}\r\n        });\r\n        this.bindCallbacks();\r\n        if (configuration === undefined) {\r\n            configuration = { iceServers: iceServers_1.defaultIceServers };\r\n        }\r\n        this._localPeerConnection = new RTCPeerConnection(configuration);\r\n        this._localPeerConnection.addEventListener('icecandidate', this.onIceCandidate);\r\n        this._localPeerConnection.addEventListener('iceconnectionstatechange', this.onIceConnectionChange);\r\n    }\r\n    bindCallbacks() {\r\n        this._JSONWebSocketHandler.bind('signal', (data) => {\r\n        });\r\n    }\r\n    onIceCandidate() {\r\n    }\r\n    onIceConnectionChange() {\r\n    }\r\n}\r\nexports.UDPWebSocket = UDPWebSocket;\r\n\n\n//# sourceURL=webpack:///./js/src/client/ts/UDPWebSocket.js?");

/***/ }),

/***/ "./js/src/client/ts/iceServers.js":
/*!****************************************!*\
  !*** ./js/src/client/ts/iceServers.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\r\nObject.defineProperty(exports, \"__esModule\", { value: true });\r\nexports.defaultIceServers = [\r\n    { urls: 'stun:stun1.l.google.com:19302' },\r\n    { urls: 'stun:stun2.l.google.com:19302' },\r\n    { urls: 'stun:stun3.l.google.com:19302' },\r\n    { urls: 'stun:stun4.l.google.com:19302' }\r\n];\r\n\n\n//# sourceURL=webpack:///./js/src/client/ts/iceServers.js?");

/***/ })

/******/ });