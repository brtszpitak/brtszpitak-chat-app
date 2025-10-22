// routes/exec.js
import express from "express";
import { spawn } from "child_process";

const router = express.Router();

/**
 * POST /exec
 * Body: { command: string, args?: string[], cwd?: string }
 * NOTE: Safety is enforced by routes/exec-guard.js before this handler runs.
 */
router.post("/", (req, res) => {
  const { command, args = [], cwd } = req.body || {};

  if (!command || typeof command !== "string") {
    return res.status(400).json({ error: "MISSING_COMMAND" });
  }
  if (!Array.isArray(args) || args.some(a => typeof a !== "string")) {
    return res.status(400).json({ error: "ARGS_MUST_BE_STRING_ARRAY" });
  }

  // Hard caps to avoid huge responses / long runs
  const OUTPUT_LIMIT = 64 * 1024; // 64 KB per stream
  const TIMEOUT_MS = 10_000;      // 10 seconds

  try {
    const child = spawn(command, args, {
      shell: false,         // do NOT go through a shell
      windowsHide: true,
      cwd: (cwd && typeof cwd === "string") ? cwd : process.cwd(),
      env: process.env
    });

    let stdout = Buffer.alloc(0);
    let stderr = Buffer.alloc(0);

    const timer = setTimeout(() => {
      try { child.kill("SIGKILL"); } catch {}
    }, TIMEOUT_MS);

    child.stdout.on("data", (d) => {
      stdout = Buffer.concat([stdout, d]).subarray(0, OUTPUT_LIMIT);
    });
    child.stderr.on("data", (d) => {
      stderr = Buffer.concat([stderr, d]).subarray(0, OUTPUT_LIMIT);
    });

    child.on("error", (err) => {
      clearTimeout(timer);
      return res.status(500).json({ error: "SPAWN_ERROR", message: String(err?.message || err) });
    });

    child.on("close", (code) => {
      clearTimeout(timer);
      return res.json({
        pid: child.pid,
        exitCode: code,
        stdout: stdout.toString("utf8"),
        stderr: stderr.toString("utf8")
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "EXEC_HANDLER_ERROR", message: String(err?.message || err) });
  }
});

export default router;
/** debug ping */
router.get("/ping", (req, res) => {
  res.json({ ok: true, route: "/exec/ping" });
});
