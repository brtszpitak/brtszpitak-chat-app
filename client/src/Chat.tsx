import { useRef, useState } from 'react';

type Ndjson = {
  type: 'delta' | 'done' | 'error';
  content?: string;
  message?: string;
};

export default function Chat() {
  const [input, setInput] = useState('');
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  async function send() {
    if (!input.trim() || streaming) return;
    setError(null);
    setReply('');
    setStreaming(true);

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input }),
        signal: ac.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });

        // Process any full lines
        let idx;
        while ((idx = buf.indexOf('\n')) >= 0) {
          const line = buf.slice(0, idx).trim();
          buf = buf.slice(idx + 1);
          if (!line) continue;

          try {
            const msg = JSON.parse(line) as Ndjson;
            if (msg.type === 'delta' && typeof msg.content === 'string') {
              setReply((prev) => prev + msg.content);
            } else if (msg.type === 'error') {
              setError(msg.message || 'Unknown error');
            } else if (msg.type === 'done') {
              // stream complete
            }
          } catch {
            // ignore non-JSON lines
          }
        }
      }
    } catch (e: any) {
      if (e?.name !== 'AbortError') {
        setError(String(e));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
    }
  }

  function stop() {
    abortRef.current?.abort();
  }

  return (
    <div
      style={{
        maxWidth: 720,
        margin: '2rem auto',
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ marginBottom: 12 }}>Alice — Streaming Chat</h1>

      <div style={{ display: 'grid', gap: 8 }}>
        <textarea
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={3}
          style={{ padding: 10, fontSize: 16, resize: 'vertical' }}
          disabled={streaming}
        />

        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={send}
            disabled={streaming || !input.trim()}
            style={{ padding: '8px 12px' }}
          >
            {streaming ? 'Sending...' : 'Send'}
          </button>
          <button
            onClick={stop}
            disabled={!streaming}
            style={{ padding: '8px 12px' }}
          >
            Stop
          </button>
        </div>

        {error && (
          <div
            style={{
              color: '#a00',
              whiteSpace: 'pre-wrap',
              border: '1px solid #f3c',
              padding: 8,
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            border: '1px solid #ddd',
            padding: 12,
            minHeight: 120,
            whiteSpace: 'pre-wrap',
          }}
        >
          {reply || (
            <span style={{ color: '#888' }}>AI reply will appear here…</span>
          )}
        </div>
      </div>
    </div>
  );
}
