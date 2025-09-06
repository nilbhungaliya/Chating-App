import { WebSocketServer } from "ws";
import http from "http";

const PORT = 8080;

// create an HTTP server (Render requires an HTTP service to bind)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("WebSocket server is running");
});

// attach WebSocket server to the HTTP server
const wss = new WebSocketServer({ server });

interface User {
  socket: any;
  room: string;
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
  console.log("User connected");

  socket.on("message", (message: any) => {
    const parsedMessage = JSON.parse(message.toString());

    if (parsedMessage.type === "join") {
      allSockets.push({
        socket,
        room: parsedMessage.payload.roomId,
      });
    }

    if (parsedMessage.type === "chat") {
      const currentRoom = allSockets.find((s) => s.socket === socket)?.room;

      for (let i = 0; i < allSockets.length; i++) {
        if (allSockets[i].room === currentRoom) {
          allSockets[i].socket.send(
            `${parsedMessage.payload.name}: ${parsedMessage.payload.message}`
          );
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
