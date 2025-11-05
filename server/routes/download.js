const express = require("express");
const path = require("path");
const { downloadToFile } = require("../utils/downloader");

const router = express.Router();



// --- health pings (added by script) ---
router.get("/ping", (req, res) => {
  return res.json({ ok: true, pong: true, t: Date.now() });
});

router.get("/", (req, res, next) => {
  if ("ping" in req.query) return res.json({ ok: true, pong: true, t: Date.now() });
  return next();
});
// --- end health pings ---
router.post("/", async (req, res) => {
  try {
    const { url, filename, expectedSha256 } = req.body || {};
    if (!url) return res.status(400).json({ ok: false, error: "Missing 'url'." });

    const destDir = path.join(process.cwd(), "downloads");
    const result = await downloadToFile({ url, filename, expectedSha256, destDir });

    res.json({ ok: true, ...result, relPath: path.relative(process.cwd(), result.path) });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
});

module.exports = router;

router.get("/_ping", (req, res) => res.json({ ok: true, router: "download" }));

