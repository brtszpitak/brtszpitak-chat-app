const fs = require('fs');
const { spawnSync } = require('child_process');
const path = require('path');

function logLine(entry) {
  const now = new Date();
  const stamp = now.toISOString().slice(0, 10).replace(/-/g, '');
  const logDir = path.join(process.cwd(), 'logs');
  const logPath = path.join(logDir, `autonomy-${stamp}.ndjson`);
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  entry.ts = new Date().toISOString();
  fs.appendFileSync(logPath, JSON.stringify(entry) + '\n');
}

function readPlan() {
  const p = path.join(process.cwd(), 'plan.json');
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function writePlan(plan) {
  const p = path.join(process.cwd(), 'plan.json');
  fs.writeFileSync(p, JSON.stringify(plan, null, 2));
}

async function run() {
  const plan = readPlan();
  if (!plan || !Array.isArray(plan.tasks)) {
    logLine({ level: 'debug', event: 'idle', note: 'no-plan-or-no-tasks' });
    return;
  }

  for (const t of plan.tasks) {
    if (t.status === 'done') continue;

    logLine({ level: 'info', event: 'task-start', id: t.id, kind: t.kind });

    try {
      if (t.kind === 'shell') {
        const cwd = t.cwd || process.cwd();
        const result = spawnSync(t.cmd, { shell: true, cwd, encoding: 'utf8' });
        const ok = result.status === 0;
        logLine({
          level: ok ? 'info' : 'error',
          event: 'task-result',
          id: t.id,
          kind: t.kind,
          status: result.status,
          stdout: (result.stdout || '').slice(0, 4000),
          stderr: (result.stderr || '').slice(0, 4000),
        });
        t.status = ok ? 'done' : 'error';
      } else if (t.kind === 'http') {
        const url = t.url;
        const expect = t.expect ?? '';
        const res = await fetch(url);
        const text = await res.text();
        const ok = res.ok && text.includes(expect);
        logLine({
          level: ok ? 'info' : 'error',
          event: 'task-result',
          id: t.id,
          kind: t.kind,
          httpStatus: res.status,
          bodySnippet: text.slice(0, 1000),
          expect,
        });
        t.status = ok ? 'done' : 'error';
      } else {
        logLine({
          level: 'warn',
          event: 'task-unknown-kind',
          id: t.id,
          kind: t.kind,
        });
        t.status = 'error';
      }
    } catch (e) {
      logLine({
        level: 'error',
        event: 'task-exception',
        id: t.id,
        kind: t.kind,
        message: String(e?.message || e),
      });
      t.status = 'error';
    }

    writePlan(plan);
  }

  logLine({ level: 'debug', event: 'idle' });
}

run();
