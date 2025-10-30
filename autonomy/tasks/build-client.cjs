const fs = require("fs");
const path = require("path");
module.exports = {
  name: "build-client",
  run: async ({ exec }) => {
    const client = path.resolve(process.cwd(), "client");
    await exec("npm", ["run","build"], { cwd: client });
    const dist = path.join(client, "dist");
    const ok = fs.existsSync(dist);
    if (!ok) throw new Error("Client dist missing after build");
    return { ok: true, note: "Client build ok" };
  }
};
