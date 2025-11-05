module.exports = {
  name: 'smoke-endpoints',
  run: async ({ exec }) => {
    async function ping(url) {
      const cmd = `curl --silent --show-error --fail --no-keepalive "${url}"`;
      try {
        await exec(cmd);
      } catch (e) {
        // retry once for transient network hiccups
        await new Promise((r) => setTimeout(r, 200));
        await exec(cmd);
      }
    }

    await ping('http://127.0.0.1:3001/health');
    await ping('http://127.0.0.1:3001/download/ping');

    return { ok: true, note: 'Health + download ping ok' };
  },
};
