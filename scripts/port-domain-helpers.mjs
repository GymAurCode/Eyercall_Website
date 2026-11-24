import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
for(const [name,repo]of [['eyerstock','Eyerstock'],['eyerflow','Eyerflow-1']]){
 const inventory=JSON.parse(fs.readFileSync(`demo-apps/${name}/source-origins.json`));const seen=new Set();
 function copy(file){const relative=path.relative(path.resolve('..',repo),file);if(seen.has(relative))return;seen.add(relative);const text=fs.readFileSync(file,'utf8');if(/from ['"](?:node:|better-sqlite|electron)/.test(text))throw Error('Native dependency '+file);const target=path.resolve('demo-apps',name,relative);fs.mkdirSync(path.dirname(target),{recursive:true});fs.copyFileSync(file,target);inventory.push({source:path.relative(path.resolve('..'),file),ported:path.relative(process.cwd(),target),sha256:crypto.createHash('sha256').update(text).digest('hex')});for(const m of text.matchAll(/from\s+['"]([^'"]+)['"]/g)){if(!m[1].startsWith('.'))continue;const p=path.resolve(path.dirname(file),m[1]);if(fs.existsSync(p+'.ts')&&p.includes(path.sep+'domain'+path.sep))copy(p+'.ts');}}
 for(const file of ['money','costing','document'])copy(path.resolve('..',repo,'src/domain',file+'.ts'));
 fs.writeFileSync(`demo-apps/${name}/source-origins.json`,JSON.stringify(inventory,null,2));
}
