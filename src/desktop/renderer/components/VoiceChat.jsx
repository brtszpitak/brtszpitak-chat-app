import React, { useEffect, useRef, useState } from "react";

export default function VoiceChat({ onFinal }) {
  const [supported, setSupported] = useState(false);
  const recRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [partial, setPartial] = useState("");

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    setSupported(true);
    const rec = new SR();
    rec.continuous = false;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let txt = "";
      for (const r of e.results) txt += r[0].transcript + " ";
      setPartial(txt.trim());
      if (e.results[e.results.length - 1].isFinal) {
        onFinal?.(txt.trim());
        setListening(false);
        setPartial("");
      }
    };
    rec.onend = () => setListening(false);
    recRef.current = rec;
  }, [onFinal]);

  const toggle = () => {
    if (!supported) return;
    const rec = recRef.current;
    if (!rec) return;
    if (!listening) {
      setListening(true);
      rec.start();
    } else {
      rec.stop();
    }
  };

  return (
    <div style={{display:"flex", gap:8, alignItems:"center"}}>
      <button onClick={toggle} disabled={!supported}>{listening ? "Stop" : "Voice"}</button>
      <span style={{opacity:0.7, fontSize:12}}>{partial}</span>
      {!supported && <small>Voice not supported in this environment</small>}
    </div>
  );
}
