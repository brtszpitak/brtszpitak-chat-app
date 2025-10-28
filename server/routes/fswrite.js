const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const ROOT = path.resolve(path.join(__dirname, "..", "..")); // repo root
const MAX_BYTES = 512 * 1024; // 512 KB per write

router.post("/write", (req, res) => {
  try {
    const { path: relPath, content = "" } = req.body || {};
    if (!relPath || typeof relPath !== "string") {
      return res.status(400).json({ ok: false, error: "path required" });
    }
    const outAbs = path.resolve(ROOT, relPath.replace(/\\/g, "/"));
    if (!outAbs.startsWith(ROOT + path.sep) && outAbs !== ROOT) {
      return res.status(400).json({ ok: false, error: "path escapes root" });
    }
    const buf = Buffer.from(String(content), "utf8");
    if (buf.length > MAX_BYTES) {
      return res.status(413).json({ ok: false, error: "content too large" });
    }
    fs.mkdirSync(path.dirname(outAbs), { recursive: true });
    fs.writeFileSync(outAbs, buf);
    return res.json({ ok: true, path: path.relative(ROOT, outAbs), bytes: buf.length });
  } catch (e) {
    return res.status(500).json({ ok: false, error: String(e && e.message ? e.message : e) });
  }
});

module.exports = router;
