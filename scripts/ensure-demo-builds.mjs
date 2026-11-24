import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
const products=['eyerrems','eyerstock','eyerflow'];
if(products.every(product=>fs.existsSync(`public/software-demo-assets/${product}/index.html`)))process.exit(0);
if(!fs.existsSync('demo-apps/node_modules/vite/bin/vite.js'))throw new Error('Install demo dependencies with npm ci --prefix demo-apps before starting the website.');
const npm=process.env.npm_execpath;
if(!npm)throw new Error('Run this script through npm run dev.');
const result=spawnSync(process.execPath,[npm,'--prefix','demo-apps','run','build'],{stdio:'inherit'});
process.exit(result.status??1);
