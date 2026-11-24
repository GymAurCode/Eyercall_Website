import fs from 'node:fs';
for(const product of ['eyerrems','eyerstock','eyerflow']){
 const file=`demo-apps/${product}/`+(product==='eyerrems'?'tailwind.config.cjs':'tailwind.config.ts');
 let source=fs.readFileSync(file,'utf8');
 if(product==='eyerrems')source=source.replace(/content:\s*\[[^\]]*\]/,`content: [require('node:path').join(__dirname,'src/**/*.{js,ts,jsx,tsx}')]`);
 else {source=`import path from 'node:path';\n`+source;source=source.replace(/content:\s*\[[^\]]*\]/,`content: [path.join(__dirname,'src/**/*.{ts,tsx}')]`);}
 fs.writeFileSync(file,source);
}
const file='scripts/generate-demo-fixtures.mjs';let source=fs.readFileSync(file,'utf8').replace('/(?:date|At|On|Iso)$/i','/(?:date|_at|At|On|Iso)$/');fs.writeFileSync(file,source);
