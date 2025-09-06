"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const http_1 = __importDefault(require("http"));
const PORT = 8080;
// create an HTTP server (Render requires an HTTP service to bind)
const server = http_1.default.createServer((req, res) => {
    res.writeHead(200);
    res.end("WebSocket server is running");
});
// attach WebSocket server to the HTTP server
const wss = new ws_1.WebSocketServer({ server });
let allSockets = [];
wss.on("connection", (socket) => {
    console.log("User connected");
    socket.on("message", (message) => {
        var _a;
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId,
            });
        }
        if (parsedMessage.type === "chat") {
            const currentRoom = (_a = allSockets.find((s) => s.socket === socket)) === null || _a === void 0 ? void 0 : _a.room;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentRoom) {
                    allSockets[i].socket.send(`${parsedMessage.payload.name}: ${parsedMessage.payload.message}`);
                }
            }
        }
    });
    socket.on("close", () => {
        console.log("User disconnected");
        allSockets = allSockets.filter((s) => s.socket !== socket);
    });
});
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
