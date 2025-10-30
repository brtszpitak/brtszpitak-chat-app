import React, { useState } from 'react';
import VoiceChat from './components/VoiceChat.jsx';
import FileShare from './components/FileShare.jsx';
import AvatarFace from './components/AvatarFace.jsx';
import { API_BASE } from '../../shared/config.js';

export default function App() {
  const [log, setLog] = useState(['Hello from Alice Desktop (remote mode)']);
  const [text, setText] = useState('');

  const sendChat = async (incoming) => {
    const msg = (incoming ?? text).trim();
    if (!msg) return;
    setLog((l) => [...l, `you: ${msg}`]);
    setText('');
    try {
      const r = await fetch(`${API_BASE}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, role: 'user' }),
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      // If remote streams NDJSON, we could parse; for now just mark OK.
      setLog((l) => [...l, 'alice: OK']);
    } catch (e) {
      setLog((l) => [...l, 'alice: (error talking to remote)']);
    }
  };

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        padding: 16,
        display: 'grid',
        gap: 12,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <AvatarFace />
        <h1 style={{ margin: 0 }}>Alice Desktop</h1>
      </div>

      <div style={{ display: 'grid', gap: 8 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendChat()}
            placeholder="Type a message…"
            style={{ flex: 1, padding: 8 }}
          />
          <button onClick={() => sendChat()}>Send</button>
        </div>
        <VoiceChat onFinal={sendChat} />
        <FileShare />
      </div>

      <textarea
        rows="12"
        readOnly
        value={log.join('\n')}
        style={{ width: '100%' }}
      />
      <small style={{ opacity: 0.6 }}>Remote: {API_BASE}</small>
    </div>
  );
}
