"use strict";
exports.__esModule = true;
exports.port = void 0;
var path_1 = require("path");
var http_1 = require("http");
var express_1 = require("express");
var cors_1 = require("cors");
var colyseus_1 = require("colyseus");
var GameRoom_1 = require("./rooms/GameRoom");
exports.port = process.env.PORT || 2657;
var app = express_1["default"]();
app.use(cors_1["default"]());
app.use(express_1["default"].json());
app.use(express_1["default"].static(path_1["default"].join(__dirname, "..", "..", "client", "dist")));
// Create HTTP & WebSocket servers
var server = http_1["default"].createServer(app);
var gameServer = new colyseus_1.Server({
    server: server,
    express: app
});
gameServer.define("game", GameRoom_1.GameRoom);
server.listen(exports.port);
console.log("Listening on " + exports.port);
