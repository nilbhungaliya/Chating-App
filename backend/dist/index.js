"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    console.log(`User connected`);
    socket.on("message", (message) => {
        var _a;
        const parsedMessage = JSON.parse(message);
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            const currentRoom = (_a = allSockets.find(s => s.socket == socket)) === null || _a === void 0 ? void 0 : _a.room;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room === currentRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message);
                }
            }
        }
    });
    socket.on("close", () => {
        console.log("User disconnected");
        allSockets = allSockets.filter(s => s.socket !== socket);
    });
});
