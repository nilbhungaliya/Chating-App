import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { Copy, Check } from "lucide-react";
import { ThemeProvider} from "../context/ThemeContext";
import { ThemeToggle } from "./ThemeToggle";

// Types
type WebSocketMessage = {
  type: "join" | "chat";
  payload: Record<string, string>;
};

// Custom Hook for WebSocket
const useWebSocket = (url: string, onMessage: (data: string) => void) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(url);
    setSocket(ws);

    ws.onmessage = (event) => {
      onMessage(event.data);
    };

    ws.onclose = () => console.warn("WebSocket closed");
    ws.onerror = (error) => console.error("WebSocket error:", error);

    return () => ws.close();
  }, [url, onMessage]);

  const sendMessage = useCallback(
    (message: WebSocketMessage) => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(message));
      } else {
        console.error("WebSocket is not open");
      }
    },
    [socket]
  );

  return sendMessage;
};

// Components
const ChatHeader = React.memo(({ roomId, copyToClipboard, copied }: any) => (
  <div className="flex items-center justify-between px-4 py-3 bg-neutral-100 dark:bg-neutral-800/50 rounded-lg mb-4">
    <div className="flex items-center gap-2">
      <span className="text-neutral-600 dark:text-neutral-400">Room Code:</span>
      <span>{roomId}</span>
      <button
        onClick={copyToClipboard}
        className="p-1.5 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-md transition-colors"
        aria-label="Copy room code"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />}
      </button>
    </div>
  </div>
));

const MessageList = React.memo(({ messages }: { messages: string[] }) => (
  <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 h-[29vw] mb-4 overflow-y-auto">
    {messages.map((msg, index) => (
      <p key={index} className="mb-2 text-neutral-700 dark:text-neutral-300">
        {msg}
      </p>
    ))}
  </div>
));

const MessageInput = React.memo(({ message, setMessage, sendMessage }: any) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-600 focus:outline-none focus:border-neutral-400 dark:focus:border-neutral-700 transition-colors"
      />
      <button
        onClick={sendMessage}
        className="px-6 py-3 bg-neutral-800 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:bg-neutral-700 dark:hover:bg-neutral-200 transition-colors"
      >
        Send
      </button>
    </div>
  );
});

// Main Chat Component
export default function Chat() {
  const [searchParams] = useSearchParams();
  const name = searchParams.get("name") || "Anonymous";
  const roomId = searchParams.get("roomId") || "Unknown";

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  }, [roomId]);

  const onMessage = useCallback((data: string) => {
    setMessages((prev) => [...prev, data]);
  }, []);

  const sendMessage = useWebSocket("ws://localhost:8080", onMessage);

  const handleSendMessage = useCallback(() => {
    if (message) {
      sendMessage({ type: "chat", payload: { name, message } });
      setMessage("");
    }
  }, [message, name, sendMessage]);

  useEffect(() => {
    sendMessage({ type: "join", payload: { name, roomId } });
  }, [name, roomId, sendMessage]);

  return (
    <ThemeProvider>
      <div className="flex items-center justify-center min-h-screen bg-white dark:bg-black text-neutral-800 dark:text-white font-mono transition-colors duration-300">
        <ThemeToggle />
        <div className="w-full max-w-3xl p-6">
          <ChatHeader roomId={roomId} copyToClipboard={copyToClipboard} copied={copied} />
          <MessageList messages={messages} />
          <MessageInput message={message} setMessage={setMessage} sendMessage={handleSendMessage} />
        </div>
      </div>
    </ThemeProvider>
  );
}
