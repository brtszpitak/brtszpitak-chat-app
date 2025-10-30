/**
 * Minimal Alice autonomy tick (safe bootstrap):
 * - writes/rotates logs/server/autonomy-YYYY-MM-DD.ndjson
 * - updates client/dist/autonomy_heartbeat.txt with ISO timestamp
 * - marks any "pending" tasks to "done" (in-memory) to prove flow
 */
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const logsDir = path.join(root, "server", "logs");
const clientDist = path.join(root, "client", "dist");
const planPath = path.join(root, "server", "autonomy", "plan.json");
const guardPath = path.join(root, "server", "autonomy", "guard.json");

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}
ensureDir(logsDir);
ensureDir(clientDist);

const now = new Date();
const y = now.toISOString().slice(0, 10);
const logPath = path.join(logsDir, `autonomy-${y}.ndjson`);

function readJson(p, fallback) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return fallback;
  }
}

const plan = readJson(planPath, { version: 1, tasks: [] });
const guard = readJson(guardPath, { allowPaths: [], denyGlobs: [], maxWriteKB: 512 });

let changed = false;
for (const t of plan.tasks) {
  if (t.status === "pending") {
    t.status = "done";
    changed = true;
  }
}

const event = {
  ts: now.toISOString(),
  kind: "tick",
  summary: "Minimal autonomy heartbeat",
  tasksTotal: plan.tasks.length,
  tasksDone: plan.tasks.filter((t) => t.status === "done").length,
  guard,
};

fs.appendFileSync(logPath, JSON.stringify(event) + "\n", "utf8");
fs.writeFileSync(path.join(clientDist, "autonomy_heartbeat.txt"), event.ts, "utf8");

// we don't write plan.json back to disk to keep bootstrap side-effects minimal.
// Uncomment next line if you want it to persist task status changes:
// fs.writeFileSync(planPath, JSON.stringify(plan, null, 2), "utf8");

console.log("[tick] ok:", event);
