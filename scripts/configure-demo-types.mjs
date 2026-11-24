import fs from 'node:fs';
for(const app of ['eyerrems','eyerstock','eyerflow']){
 const original=app==='eyerrems'?'../Eyerrems-desktop/frontend/tsconfig.json':`../${app==='eyerstock'?'Eyerstock':'Eyerflow-1'}/tsconfig.web.json`;
 const config=JSON.parse(fs.readFileSync(original));config.include=app==='eyerrems'?['src/**/*.ts','src/**/*.tsx']:['src/renderer/**/*.ts','src/renderer/**/*.tsx','src/shared/**/*.ts'];
 config.compilerOptions.target='ES2022';config.compilerOptions.lib=['ES2022','DOM','DOM.Iterable'];
 fs.writeFileSync(`demo-apps/${app}/tsconfig.json`,JSON.stringify(config,null,2));
}
