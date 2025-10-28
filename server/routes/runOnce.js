import { Router } from "express";
import fsp from "node:fs/promises";
import path from "node:path";

const router = Router();
const PLAN_PATH = path.resolve(process.cwd(), "..", "plan.json"); // repo root plan.json

async function readPlan() {
  try {
    const raw = await fsp.readFile(PLAN_PATH, "utf8");
    return JSON.parse(raw);
  } catch {
    return { version: 1, tasks: [] };
  }
}

async function writePlan(plan) {
  const pretty = JSON.stringify(plan, null, 2);
  await fsp.writeFile(PLAN_PATH, pretty, "utf8");
}

function getNextTodo(plan) {
  return plan.tasks.find((t) => (t.status ?? "todo") === "todo");
}

router.post("/runOnce", async (_req, res) => {
  const plan = await readPlan();
  const next = getNextTodo(plan) || null;
  res.json({ status: "ok", message: next ? "Task available" : "Idle: no tasks", nextTask: next });
});

router.post("/plan/report", async (req, res) => {
  const { id, newStatus = "done", note } = req.body || {};
  const plan = await readPlan();
  const t = plan.tasks.find((x) => x.id === id);
  if (!t) return res.status(404).json({ ok: false, error: "Task not found" });
  t.status = newStatus;
  t.history = t.history || [];
  t.history.push({ ts: new Date().toISOString(), note: note || "" });
  await writePlan(plan);
  res.json({ ok: true });
});

export default router;
