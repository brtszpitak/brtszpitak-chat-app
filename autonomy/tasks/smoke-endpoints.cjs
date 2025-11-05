module.exports = {
  name: "smoke-endpoints",
  run: async ({ exec }) => {
    // Curl helper: disable keep-alive to avoid stale sockets; retry once on transient failures.
    async function ping(url) {
      try {
        await exec("curl", ["--silent","--show-error","--fail","--no-keepalive", url]);
      } catch (e) {
        await new Promise(r => setTimeout(r, 200));
        await exec("curl", ["--silent","--show-error","--fail","--no-keepalive", url]);
      }
    }

    await ping("http://127.0.0.1:3001/health");
    await ping("http://127.0.0.1:3001/download/ping");

    return { ok: true, note: "Health + download ping ok" };
  },
};
