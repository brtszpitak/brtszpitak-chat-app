import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

// keep ports centralized
const SERVER_PORT = Number(process.env.PORT || 3001);

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.json({ ok: true }));

const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  socket.on("ping", (msg) => socket.emit("pong", msg ?? "pong"));
});

server.listen(SERVER_PORT, () => {
  console.log("[server] listening on", SERVER_PORT);
});
