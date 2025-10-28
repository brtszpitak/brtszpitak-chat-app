const express = require("express");
const fs = require("fs");
const path = require("path");
const { runTick } = require("../autonomy");

const router = express.Router();

async function handleTick(_req, res) {
  try {
    res.json(await runTick());
  } catch (e) {
    res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
  }
}

router.get("/tick", handleTick);
router.post("/tick", handleTick);

router.get("/status", (_req, res) => {
  const f = path.join(__dirname, "..", "logs", "lastTick.json");
  if (!fs.existsSync(f)) return res.json({ ok: false, error: "no ticks yet" });
  try {
    const j = JSON.parse(fs.readFileSync(f, "utf8"));
    res.json(j);
  } catch (e) {
    res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
  }
});

module.exports = router;
