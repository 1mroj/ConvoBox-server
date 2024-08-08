import { io } from "socket.io-client";

// Use the Render WebSocket server URL
const socket = io(process.env.WEBSOCKET_SERVER_URL);

export default function setupSocketIO(app) {
  socket.on("connect", () => {
    console.log("Connected to WebSocket server:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Disconnected from WebSocket server");
  });

  socket.on("error", (error) => {
    console.error("Socket.IO error:", error);
  });

  // Your custom event listeners
  socket.on("messageReceived", (data) => {
    console.log("Message received:", data);
  });

  socket.on("typing", (data) => {
    console.log("User is typing:", data);
  });

  return socket;
}
