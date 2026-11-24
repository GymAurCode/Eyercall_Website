import fs from 'node:fs';
function errors(file){return fs.readFileSync(file,'utf8').split(/\r?\n/).filter(l=>/error TS/.test(l)).map(l=>l.replace(/^.*?[\\/]src[\\/]/,'src/').replaceAll('\\','/').replace(/C:\/coding\/EyercallALlin one\/(?:Eyercallwebsite\/demo-apps\/eyerrems|Eyerrems-desktop\/frontend)/g,'SOURCE'));}
const original=errors('docs/eyerrems/original-typecheck.log'),ported=errors('docs/eyerrems/typecheck.log');
const origMessages=new Set(original.map(x=>x.replace(/\(\d+,\d+\)/,'(line)')));
const introduced=ported.filter(x=>!origMessages.has(x.replace(/\(\d+,\d+\)/,'(line)')));
fs.writeFileSync('docs/eyerrems/typecheck-difference.log',introduced.join('\n'));
console.log({originalErrors:original.length,portedErrors:ported.length,differentDiagnostics:introduced.length});console.log(introduced.slice(0,12).join('\n'));
