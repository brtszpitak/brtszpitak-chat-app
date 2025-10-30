exports.default = async function (context) {
  const fs = require('fs');
  const path = require('path');
  const keep = new Set(['en-GB', 'en-US']);
  const localesDir = path.join(context.appOutDir, 'locales');
  if (fs.existsSync(localesDir)) {
    for (const f of fs.readdirSync(localesDir)) {
      if (f.endsWith('.pak') && !keep.has(f.replace('.pak', ''))) {
        try {
          fs.unlinkSync(path.join(localesDir, f));
        } catch {}
      }
    }
  }
};
