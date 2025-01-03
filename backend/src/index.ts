import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

interface User{
    socket: WebSocket,
    room: string
}

let allSockets: User[] = [];

wss.on("connection", (socket) => {
    console.log(`User connected`);

    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string); 
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        }   
        if (parsedMessage.type === "chat") {
            const currentRoom = allSockets.find(s=>s.socket==socket)?.room;

            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room===currentRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
                
            }
        }

    })

    socket.on("close", () => {
        console.log("User disconnected");
        allSockets = allSockets.filter(s => s.socket !== socket);
    })
});