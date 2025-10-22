import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function App() {
  const [log, setLog] = useState(["Hello from React UI"]);
  const socketRef = useRef(null);

  useEffect(() => {
    const s = io("http://localhost:3001", { transports: ["websocket", "polling"] });
    socketRef.current = s;

    s.on("connect", () => setLog(l => [...l, `connected: ${s.id}`]));
    s.on("pong", (msg) => setLog(l => [...l, `pong: ${msg}`]));
    s.on("disconnect", () => setLog(l => [...l, "disconnected"]));

    return () => { s.disconnect(); };
  }, []);

  const doPing = () => socketRef.current?.emit("ping", "hi-from-ui");

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: 16 }}>
      <h1>Alice Desktop</h1>
      <p>Chat panel + stubs (drag/drop, voice I/O, settings, avatar)</p>

      <textarea rows="10" readOnly value={log.join("\n")} style={{ width: "100%" }} />

      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button onClick={doPing}>Ping server</button>
        <button onClick={() => setLog([])}>Clear log</button>
      </div>
    </div>
  );
}
