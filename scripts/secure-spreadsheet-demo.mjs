import fs from 'node:fs';
const base='demo-apps/eyerrems/src/spreadsheet/';
let commands=fs.readFileSync(base+'core/Commands.js','utf8');
commands=commands.replace('    command.execute();',`    if (!['ResizeColCommand','ResizeRowCommand','StyleCellsCommand'].includes(command.constructor.name)) { window.dispatchEvent(new Event('eyercall-demo-blocked')); return; }\n    command.execute();`);
fs.writeFileSync(base+'core/Commands.js',commands);
let source=fs.readFileSync(base+'Spreadsheet.jsx','utf8');
for(const method of ['addSheet','renameSheet','deleteSheet','handleImport','handleLoadTemplate','handleReset','handleRestore'])source=source.replace(new RegExp(`(const ${method} = \\([^)]*\\) => \\{)`),`$1\n    window.dispatchEvent(new Event('eyercall-demo-blocked')); return;`);
fs.writeFileSync(base+'Spreadsheet.jsx',source);
