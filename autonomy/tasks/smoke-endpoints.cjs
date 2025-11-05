const http = require("http");
function requestOnce(url) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = { hostname: u.hostname, port: u.port || 80, path: u.pathname + (u.search||""), method: "GET", agent: new http.Agent({ keepAlive: false }) };
    const req = http.request(opts, (res) => {
      if (res.statusCode && res.statusCode >= 200 && res.statusCode < 400) resolve();
      else reject(new Error("HTTP " + res.statusCode));
    });
    req.on("error", reject);
    req.end();
  });
}
async function ping(url) {
  try { await requestOnce(url); }
  catch { await new Promise(r=>setTimeout(r,200)); await requestOnce(url); }
}
module.exports = {
  name: "smoke-endpoints",
  run: async () => {
    await ping("http://127.0.0.1:3001/health");
    await ping("http://127.0.0.1:3001/download/ping");
    return { ok: true, note: "Health + download ping ok" };
  },
};
