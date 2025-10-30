const { spawn } = require("child_process");
function run(cmd, args, opts={}) {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { shell: true, ...opts });
    let out = "", err = "";
    p.stdout.on("data", d => out += d);
    p.stderr.on("data", d => err += d);
    p.on("close", c => c===0 ? resolve({out,err}) : reject(new Error(err || `exit ${c}`)));
  });
}
module.exports = {
  assertClean: async () => {
    const { out } = await run("git", ["status","--porcelain"]);
    if (out.trim()) throw new Error("Working tree not clean");
  },
  checkoutNew: async (name) => { await run("git", ["checkout","-b", name]); },
  addAll: async () => { await run("git", ["add","."]); },
  commit: async (msg) => { await run("git", ["commit","-m", msg]); },
};
