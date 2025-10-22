import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
import POLICY from "../policy/policy.json" with { type: "json" };
import EXEC_ALLOW from "../policy/exec-allowed.json" with { type: "json" };

const ROOT = path.resolve(__dirname, '..');
const DL_ROOT = path.join(ROOT, "downloads");
const AUTONOMY_FLAG = path.join(ROOT, "AUTONOMY_OFF");

function isPaused() { return fs.existsSync(AUTONOMY_FLAG); }
function fromDownloads(targetPath) {
  const p = path.resolve(targetPath);
  return p.toLowerCase().startsWith(DL_ROOT.toLowerCase());
}
function execAllowed(cmd, args) {
  const entry = EXEC_ALLOW.binaries.find(b => b.cmd.toLowerCase() === String(cmd).toLowerCase());
  if (!entry) return false;
  const re = new RegExp(entry.args);
  return re.test(args.join(" "));
}

export default function execGuard(req, res, next) {
  if (req.path !== "/exec" || req.method !== "POST") return next();

  if (isPaused()) return res.status(423).json({ error: "AUTONOMY_PAUSED" });

  const body = req.body || {};
  const cmd = body.command;
  const args = Array.isArray(body.args) ? body.args : [];

  if (!execAllowed(cmd, args)) {
    return res.status(403).json({ error: "EXEC_NOT_ALLOWED", cmd, args });
  }

  const maybePathArg = args.find(a => typeof a === "string" && (a.endsWith(".exe") || a.endsWith(".msi") || a.endsWith(".ps1") || a.endsWith(".bat") || a.endsWith(".cmd")));
  if (maybePathArg) {
    if (POLICY.exec.allowOnlyFromDownloads && !fromDownloads(maybePathArg)) {
      return res.status(403).json({ error: "EXEC_OUTSIDE_DOWNLOADS" });
    }
    if (POLICY.exec.requireVerifiedSource) {
      try {
        const manifest = fs.readFileSync(path.join(DL_ROOT,"manifest.jsonl"), "utf8").trim().split(/\r?\n/).filter(Boolean).map(JSON.parse);
        const abs = path.resolve(maybePathArg);
        const entry = manifest.reverse().find(e => path.resolve(e.path) === abs && e.outcome === "OK" && e.sha256);
        if (!entry) return res.status(403).json({ error: "EXEC_NOT_VERIFIED_IN_MANIFEST" });
      } catch {
        return res.status(403).json({ error: "EXEC_MANIFEST_MISSING" });
      }
    }
  }

  next();
}

