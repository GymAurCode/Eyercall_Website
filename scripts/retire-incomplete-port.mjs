import fs from 'node:fs';import path from 'node:path';
const old='src/features/software-demos/eyerrems';
if(fs.existsSync(old)){fs.mkdirSync('docs/eyerrems/retired-incomplete-port',{recursive:true});for(const part of fs.readdirSync(old)){fs.renameSync(path.join(old,part),path.join('docs/eyerrems/retired-incomplete-port',part));}fs.rmdirSync(old);}
const stat='src/components/eyerstock/demo/StatCard.tsx';fs.writeFileSync(stat,fs.readFileSync(stat,'utf8').replace('@/components/ui/Card','@/components/ui/card'));
