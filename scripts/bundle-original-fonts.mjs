import fs from 'node:fs';
const file='demo-apps/eyerrems/src/index.css';let text=fs.readFileSync(file,'utf8');
const imports=[];
for(const [font,weights]of [['lora',[400,600,700]],['poppins',[300,400,500,600,700]],['ibm-plex-mono',[400,500,600]],['space-grotesk',[400,500,600,700]]])for(const w of weights)imports.push(`@import '@fontsource/${font}/${w}.css';`);
fs.writeFileSync(file,imports.join('\n')+'\n'+text);
