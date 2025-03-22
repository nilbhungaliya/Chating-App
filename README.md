# Chatting Web App

A real-time chatting web application built using WebSockets (`ws`) for the backend and React with Vite for the frontend.

## Features

- Real-time messaging using WebSockets
- Modern UI built with React and Tailwind CSS
- Client-side routing with React Router

## Tech Stack

### Backend
- Node.js
- TypeScript
- WebSocket (`ws`)

### Frontend
- React
- React Router
- Tailwind CSS
- Vite

## Installation

### Backend Setup

1. Navigate to the backend folder:
   ```sh
   cd backend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the server:
   ```sh
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend folder:
   ```sh
   cd frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Start the frontend server:
   ```sh
   npm run dev
   ```

4. Open in the browser:
   Navigate to `http://localhost:5173/` (default Vite port).

## Folder Structure

```
chatting-web-app/
├── backend/           # Backend server
│   ├── src/           # TypeScript source files
│   ├── dist/          # Compiled JavaScript files
│   ├── package.json   # Backend dependencies
│   ├── tsconfig.json  # TypeScript configuration
├── frontend/          # Frontend client
│   ├── src/           # React components and pages
│   ├── public/        # Static assets
│   ├── package.json   # Frontend dependencies
│   ├── vite.config.js # Vite configuration
└── README.md          # Project documentation
```

## WebSocket Usage

The backend uses WebSocket (`ws`) to handle real-time communication. Example WebSocket server setup:

```ts
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
    console.log("New client connected");

    ws.on("message", (message) => {
        console.log(`Received: ${message}`);
        wss.clients.forEach(client => client.send(message));
    });
});
```
