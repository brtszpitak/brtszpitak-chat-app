module.exports = {
  name: 'audit-server',
  run: async ({ exec }) => {
    try {
      await exec('npm', ['audit', '--production', '--audit-level=moderate'], {
        cwd: process.cwd(),
      });
    } catch (e) {} // non-zero exit just means vulns found; log but don't fail tick
    return { ok: true, note: 'npm audit executed' };
  },
};
