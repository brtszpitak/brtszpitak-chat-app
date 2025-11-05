"use strict";
const cp = require("child_process");
function sh(c){ cp.execSync(c,{stdio:"inherit"}); }
try{
  // ensure client build
  sh("node autonomy/tasks/build-client.cjs");
  // pack desktop (your existing script)
  sh("node server/scripts/pack-desktop.cjs");
  console.log(JSON.stringify({ok:true,note:"desktop packed"}));
  process.exit(0);
}catch(e){
  console.error(JSON.stringify({ok:false,err:String(e)}));
  process.exit(1);
}