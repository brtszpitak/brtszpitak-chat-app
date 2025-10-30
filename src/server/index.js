const downloadRouter = require('../../server/routes/download');
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { SERVER_PORT } = require('../shared/constants.js');

const app = express();
app.use(cors());
app.use(express.json());

// health
app.get('/health', (req, res) => res.json({ ok: true }));

// lightweight /chat to stop 400/404s and log commands
app.post('/chat', (req, res) => {
  const body = req.body || {};
  let text = body.message || '';
  if (!text && Array.isArray(body.messages)) {
    const last = body.messages[body.messages.length - 1];
    text = (last && (last.content || last.text)) || '';
  }
  const role =
    body.role ||
    (Array.isArray(body.messages)
      ? body.messages.at(-1)?.role || 'user'
      : 'user');

  const logDir = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
  const logPath = path.join(
    logDir,
    `autonomy-${stamp.slice(0, 10).replace(/-/g, '')}.log`,
  );
  const summary = text
    ? text.replace(/\s+/g, ' ').slice(0, 300)
    : '(no message)';
  fs.appendFile(logPath, `${stamp} | /chat | ${role} | ${summary}\n`, () => {});

  // minimal NDJSON-ish response many clients tolerate
  res.setHeader('Content-Type', 'application/x-ndjson; charset=utf-8');
  res.write(JSON.stringify({ type: 'delta', content: 'OK' }) + '\n');
  res.end(JSON.stringify({ type: 'done' }) + '\n');
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });
io.on('connection', (socket) => {
  socket.on('ping', (msg) => socket.emit('pong', msg ?? 'pong'));
});
const PORT = process.env.PORT || SERVER_PORT || 3001;
server.listen(PORT, () => console.log('[server] listening on', PORT));

app.use('/download', downloadRouter);
