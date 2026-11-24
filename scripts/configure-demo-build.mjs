import fs from 'node:fs';
const file='package.json',pkg=JSON.parse(fs.readFileSync(file));
pkg.scripts['build:demos']='npm --prefix demo-apps run build';
pkg.scripts.prebuild='npm run build:demos';
pkg.scripts.predev='node scripts/ensure-demo-builds.mjs';
pkg.scripts.postinstall='npm ci --prefix demo-apps --no-audit --no-fund';
fs.writeFileSync(file,JSON.stringify(pkg,null,2)+'\n');
