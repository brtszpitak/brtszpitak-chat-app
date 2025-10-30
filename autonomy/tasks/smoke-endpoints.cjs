module.exports = {
  name: 'smoke-endpoints',
  run: async ({ fetch }) => {
    const urls = [
      'http://127.0.0.1:3001/health',
      'http://127.0.0.1:3001/download/_ping',
    ];
    for (const u of urls) {
      const r = await fetch(u);
      if (!r.ok) throw new Error(`Smoke fail: ${u} -> ${r.status}`);
    }
    return { ok: true, note: 'Health + download ping ok' };
  },
};
