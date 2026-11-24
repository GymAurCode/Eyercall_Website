import fs from 'node:fs';
import path from 'node:path';
import ts from '../node_modules/typescript/lib/typescript.js';
const base=path.resolve('demo-apps');
const labels=['Cedar','Orchard','Harbor','Summit','Meadow','Willow'];
function text(key,i){
 if(/email/i.test(key))return `demo${i}@example.invalid`;
 if(/phone/i.test(key))return '+92 300 0000000';
 if(/(?:date|_at|At|On|Iso)$/.test(key))return '2026-11-20';
 if(/(?:url|path|image|avatar|logo)/i.test(key))return '';
 if(/color/i.test(key))return '#14b8a6';
 if(/currency/i.test(key))return 'PKR';
 if(/unit$/i.test(key))return 'pcs';
 if(/code|sku|number|ref/i.test(key))return `DEMO-${String(i).padStart(3,'0')}`;
 if(/name|title|label|subject|description/i.test(key))return `${labels[(i-1)%labels.length]} ${key.replace(/([A-Z])/g,' $1')}`;
 return 'Demo';
}
for(const name of ['eyerstock','eyerflow']){
 const file=path.join(base,name,'src/shared/ipc.ts');
 const program=ts.createProgram([file],{strict:true,skipLibCheck:true,moduleResolution:ts.ModuleResolutionKind.Bundler,module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022});
 const checker=program.getTypeChecker(),source=program.getSourceFile(file);let declaration;
 ts.forEachChild(source,n=>{if(n.name?.text==='RpcMethods')declaration=n;});
 const type=checker.getTypeAtLocation(declaration);
 function generate(t,key='',i=1,depth=0){
  if(depth>12)return null;
  if(t.isUnion()){const eligible=t.types.filter(x=>!(x.flags&(ts.TypeFlags.Null|ts.TypeFlags.Undefined|ts.TypeFlags.Never)));return generate(eligible[0]??t.types[0],key,i,depth+1);}
  if(t.isStringLiteral())return t.value;
  if(t.isNumberLiteral())return t.value;
  if(t.flags&ts.TypeFlags.String)return text(key,i);
  if(t.flags&ts.TypeFlags.Number)return /(?:id|Id|lineNo)$/.test(key)?i:/percent|rate/i.test(key)?10:/fils/i.test(key)?i*125000:/milli/i.test(key)?i*10000:i*12;
  if(t.flags&ts.TypeFlags.BooleanLiteral)return t.intrinsicName==='true';
  if(t.flags&ts.TypeFlags.Boolean)return !/lowStock|negative|password/i.test(key);
  if(t.flags&(ts.TypeFlags.Void|ts.TypeFlags.Null|ts.TypeFlags.Undefined|ts.TypeFlags.Never))return null;
  const element=checker.getIndexTypeOfType(t,ts.IndexKind.Number);
  if(element&&checker.getPropertyOfType(t,'length'))return [1,2,3].map(j=>generate(element,key,j,depth+1));
  const obj={};
  for(const p of checker.getPropertiesOfType(t)){
   if(p.flags&ts.SymbolFlags.Method||p.name.startsWith('__'))continue;
   const pt=checker.getTypeOfSymbolAtLocation(p,p.valueDeclaration??p.declarations?.[0]??source);
   obj[p.name]=generate(pt,p.name,i,depth+1);
  }
  return obj;
 }
 const fixtures={};
 for(const p of checker.getPropertiesOfType(type)){
  const t=checker.getTypeOfSymbolAtLocation(p,p.valueDeclaration??source),r=t.getProperty('response');
  if(r)fixtures[p.name]=generate(checker.getTypeOfSymbolAtLocation(r,r.valueDeclaration??source),p.name);
 }
 fs.writeFileSync(path.join(base,name,'fixtures.json'),JSON.stringify(fixtures,null,2));
 console.log(name,Object.keys(fixtures).length,'typed response fixtures');
}
