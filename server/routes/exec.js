import { Router } from "express";
import { spawn } from "node:child_process";
import path from "node:path";

const router = Router();
const BASE_DIR = process.env.ALICE_BASE_DIR || path.resolve(process.cwd(), "..");

function resolveSafe(relPath) {
  const full = path.resolve(BASE_DIR, relPath || ".");
  if (!full.startsWith(path.resolve(BASE_DIR))) throw new Error("Path escapes BASE_DIR.");
  return full;
}

router.post("/", (req, res) => {
  res.setHeader("Content-Type", "application/x-ndjson; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  try {
    const cmd  = req.body && req.body.cmd;
    const args = (req.body && Array.isArray(req.body.args)) ? req.body.args : [];
    const cwdRel = (req.body && req.body.cwd) || ".";
    if (!cmd) { res.write(JSON.stringify({ type: "error", message: "Missing 'cmd'." }) + "\n"); return res.end(); }
    const cwd = resolveSafe(cwdRel);

    const child = spawn(cmd, args, { cwd, env: process.env, shell: false });
    child.stdout.on("data", (chunk) => res.write(JSON.stringify({ type: "stdout", data: chunk.toString() }) + "\n"));
    child.stderr.on("data", (chunk) => res.write(JSON.stringify({ type: "stderr", data: chunk.toString() }) + "\n"));
    child.on("error", (err) => res.write(JSON.stringify({ type: "error", message: String(err) }) + "\n"));
    child.on("close", (code) => {
      res.write(JSON.stringify({ type: "exit", code }) + "\n");
      res.write(JSON.stringify({ type: "done" }) + "\n");
      res.end();
    });
  } catch (e) {
    res.write(JSON.stringify({ type: "error", message: String(e) }) + "\n");
    res.write(JSON.stringify({ type: "done" }) + "\n");
    res.end();
  }
});

export default router;
