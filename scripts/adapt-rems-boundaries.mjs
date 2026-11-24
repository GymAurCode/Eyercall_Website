import fs from 'node:fs';
const base='demo-apps/eyerrems/';
// Only copied browser adapters are replaced. Original components remain intact.
fs.writeFileSync(base+'src/hooks/useWebSocket.ts',`export function addRbacEventListener(_fn:unknown){return ()=>{};}\nexport function useRealtimeSocket(_token:string|null){}\n`);
fs.writeFileSync(base+'src/hooks/useReminderWebSocket.ts',`import {useState} from 'react';\nexport function useReminderWebSocket(){const [missedCount,setMissedCount]=useState(0);return {notifications:[],missedCount,setMissedCount,dismiss:()=>{},dismissAll:()=>{},connected:false};}\nexport function playTaskSound(){}\n`);
let css=fs.readFileSync(base+'src/index.css','utf8').replace(/^@import url\([^\n]+\);\r?\n/gm,'');
css=`@import '@fontsource/inter/400.css';\n@import '@fontsource/inter/500.css';\n@import '@fontsource/inter/600.css';\n@import '@fontsource/inter/700.css';\n@import '@tabler/icons-webfont/dist/tabler-icons.min.css';\n`+css;fs.writeFileSync(base+'src/index.css',css);
