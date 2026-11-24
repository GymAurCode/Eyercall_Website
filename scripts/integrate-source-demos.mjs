import fs from 'node:fs';
for(const product of ['eyerrems','eyerstock','eyerflow']){
 for(const file of fs.readdirSync('src/routes').filter(f=>f.startsWith(`software.${product}.demo`)&&f.endsWith('.tsx'))){
  const suffix=file.slice(`software.${product}.demo`.length,-4);
  const route=`/software/${product}/demo`+suffix.replaceAll('.','/');
  fs.writeFileSync(`src/routes/${file}`,`import {createFileRoute} from '@tanstack/react-router';\nimport SourceDemo from '@/features/software-demos/SourceDemo';\nexport const Route=createFileRoute('${route}')({component:()=> <SourceDemo product="${product}" />,head:()=>({meta:[{title:'${product} Read-only Demo | Eyercall'},{name:'robots',content:'noindex'}]})});\n`);
 }
 const file=`src/routes/software.${product}.demo.$.tsx`;
 fs.writeFileSync(file,`import {createFileRoute} from '@tanstack/react-router';\nimport SourceDemo from '@/features/software-demos/SourceDemo';\nexport const Route=createFileRoute('/software/${product}/demo/$')({component:()=> <SourceDemo product="${product}" />});\n`);
}
// Separate documents require original Tailwind 3 rules generated from their own sources.
for(const product of ['eyerrems','eyerstock','eyerflow']){
 const filename=`demo-apps/${product}/`+(product==='eyerrems'?'tailwind.config.cjs':'tailwind.config.ts');
 let source=fs.readFileSync(filename,'utf8');
 source=source.replace(/content:\s*\[[^\]]*\]/,`content: [${JSON.stringify(process.cwd().replaceAll('\\','/')+`/demo-apps/${product}/src/**/*.{js,ts,jsx,tsx}`)}]`);
 fs.writeFileSync(filename,source);
}
