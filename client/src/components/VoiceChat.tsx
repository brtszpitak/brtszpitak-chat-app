import { useRef, useState } from "react";
import { streamChat } from "../lib/streamChat";
import AvatarFace from "./AvatarFace";
type Msg = { role: "user" | "assistant"; content: string };
export default function VoiceChat() {
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [speaking, setSpeaking] = useState(false);
  const ctrl = useRef<AbortController | null>(null);
  function speak(text: string) {
    try {
      const u = new SpeechSynthesisUtterance(text);
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
    } catch {}
  }
  async function send() {
    const content = input.trim();
    if (!content) return;
    const body = { messages: [...msgs, { role: "user", content }] };
    setMsgs((m) => [...m, { role: "user", content }]);
    setInput("");
    ctrl.current?.abort();
    ctrl.current = new AbortController();
    let reply = "";
    for await (const evt of streamChat(body, ctrl.current.signal)) {
      if (evt.delta) {
        reply += evt.delta;
        setMsgs((m) => {
          const last = m[m.length - 1];
          if (last?.role === "assistant") { const mm = [...m]; mm[mm.length - 1] = { role: "assistant", content: reply }; return mm; }
          return [...m, { role: "assistant", content: reply }];
        });
      }
      if (evt.done) { if (autoSpeak) speak(reply); }
    }
  }
  const recRef = useRef<any>(null);
  function startSTT() {
    const SR = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SR) { alert("Speech Recognition not supported in this browser."); return; }
    const r = new SR(); r.continuous = false; r.interimResults = true; r.lang = "en-US";
    r.onresult = (e: any) => { let t = ""; for (const res of e.results) t += res[0].transcript; setInput(t); };
    recRef.current = r; r.start();
  }
  return (
    <div className="p-4 max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Alice Chat</h1>
      <div className="flex gap-6 items-center">
        <AvatarFace speaking={speaking} />
        <div className="text-sm opacity-70"><p>Streaming chat with voice. Toggle auto-speak below.</p></div>
      </div>
      <div className="space-y-2 h-[45vh] overflow-auto border rounded p-3 bg-white/60">
        {msgs.map((m, i) => (<div key={i} className={m.role === "user" ? "text-right" : ""}><span className="rounded px-3 py-2 inline-block border bg-white">{m.content}</span></div>))}
      </div>
      <div className="flex gap-2">
        <input className="flex-1 border rounded px-3 py-2" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type or use mic…" />
        <button className="border rounded px-3 py-2" onClick={startSTT}>🎤</button>
        <button className="border rounded px-3 py-2" onClick={send}>Send</button>
      </div>
      <label className="flex items-center gap-2">
        <input type="checkbox" checked={autoSpeak} onChange={(e) => setAutoSpeak(e.target.checked)} />
        Auto-read replies
      </label>
    </div>
  );
}

