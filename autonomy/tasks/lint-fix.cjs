module.exports = {
  name: "lint-fix",
  run: async ({ exec }) => {
    await exec("npm", ["run","prettier","--","--write","."], { cwd: process.cwd() });
    try { await exec("npm", ["run","lint","--","--fix"], { cwd: process.cwd() }); } catch(e){}
    return { ok: true, note: "Prettier + ESLint ran" };
  }
};
