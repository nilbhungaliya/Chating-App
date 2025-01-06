import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Copy, Check } from "lucide-react";
import { ThemeProvider } from "../context/ThemeContext"; // Import ThemeProvider and hook
import { ThemeToggle } from "./ThemeToggle";

const Room: React.FC = () => {
    const [name, setName] = useState("");
    const [roomId, setRoomId] = useState("");
    const [copied, setCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const generateRoomId = () => {
        setIsLoading(true);
        const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        setTimeout(() => {
            const randomId = Array.from({ length: 6 }, () =>
                characters.charAt(Math.floor(Math.random() * characters.length))
            ).join("");
            setRoomId(randomId);
            setIsLoading(false);
        }, 1000);
    };

    const handleJoinRoom = () => {
        if (name && roomId) {
            navigate(`/chat?name=${name}&roomId=${roomId}`);
        } else {
            alert("Please enter both name and room ID!");
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(roomId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
        }
    };

    return (
        <ThemeProvider>
            <div
                className="flex items-center justify-center min-h-screen bg-white dark:bg-black 
        transition-colors duration-300"
            >
                <ThemeToggle />

                <div className="w-full max-w-md p-8 mx-4">
                    <div className="text-center mb-12">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <MessageSquare className="w-6 h-6 text-neutral-800 dark:text-white" />
                            <h1 className="text-2xl font-mono text-neutral-800 dark:text-white">
                                Real Time Chat
                            </h1>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <button
                            onClick={generateRoomId}
                            disabled={isLoading}
                            className="w-full py-4 px-4 rounded-lg font-mono text-neutral-800 
                bg-white border-2 border-neutral-200 hover:bg-neutral-100
                dark:bg-white/10 dark:text-white dark:border-white/20 
                dark:hover:bg-white/20 transition-all duration-200
                disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center">
                                    <svg
                                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-neutral-800 dark:text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    Creating Room...
                                </span>
                            ) : (
                                "Create New Room"
                            )}
                        </button>

                        <input
                            type="text"
                            placeholder="Enter your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-4 rounded-lg font-mono text-neutral-800 
                bg-white border-2 border-neutral-200 
                dark:bg-black dark:text-white dark:border-white/20
                placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
                focus:outline-none focus:border-neutral-400 dark:focus:border-white/40
                transition-all duration-200"
                        />
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Enter Room Code"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                                maxLength={6}
                                className="flex-1 px-4 py-4 rounded-lg font-mono text-neutral-800 
                  bg-white border-2 border-neutral-200 
                  dark:bg-black dark:text-white dark:border-white/20
                  placeholder:text-neutral-400 dark:placeholder:text-neutral-600 
                  focus:outline-none focus:border-neutral-400 dark:focus:border-white/40
                  tracking-wider uppercase transition-all duration-200"
                            />

                            <button
                                onClick={handleJoinRoom}
                                disabled={!name || !roomId}
                                className="px-8 py-4 rounded-lg font-mono text-white
                  bg-neutral-800 hover:bg-neutral-700
                  dark:bg-white dark:text-black dark:hover:bg-neutral-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-all duration-200"
                            >
                                Join
                            </button>
                        </div>
                        {(roomId || isLoading) && (
                            <div
                                className={`p-4 rounded-lg bg-neutral-100 dark:bg-neutral-800/50 
                border-2 border-neutral-200 dark:border-white/10
                transition-all duration-300 ${isLoading ? "opacity-80" : "opacity-100"}`}
                            >
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 font-mono mb-2">
                                    {isLoading
                                        ? "Generating room code..."
                                        : "Share this code with your friend"}
                                </p>
                                <div
                                    className="flex items-center justify-between bg-white dark:bg-black 
                  rounded-lg p-3 border-2 border-neutral-200 dark:border-white/20"
                                >
                                    {isLoading ? (
                                        <div className="animate-pulse flex space-x-4 w-full">
                                            <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-3/4"></div>
                                            <div className="h-6 bg-neutral-300 dark:bg-neutral-700 rounded w-1/4"></div>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="font-mono text-lg tracking-wider dark:text-white">
                                                {roomId}
                                            </span>
                                            <button
                                                onClick={copyToClipboard}
                                                className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 
                          rounded-lg transition-colors"
                                                aria-label="Copy room code"
                                            >
                                                {copied ? (
                                                    <Check className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Copy className="w-5 h-5 text-neutral-800 dark:text-white" />
                                                )}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default Room;
