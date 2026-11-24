import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const slash=s=>s.replaceAll('\\','/');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const unique=items=>[...new Set(items)];
const smoke={
 eyerrems:{'pages/Dashboard.tsx':'Dashboard rendered; screenshot inspected','pages/CRM.tsx':'Nine original tabs visible; navigation checked','pages/crm/CRMDashboard.tsx':'Original multi-panel dashboard rendered'},
 eyerstock:{'pages/Dashboard.tsx':'Dashboard, tables and charts rendered','pages/inventory/ProductsPage.tsx':'Direct nested route, search and numeric sorting passed'},
 eyerflow:{'pages/HomeDashboard.tsx':'Suite dashboard rendered','pages/wms/WmsPage.tsx':'WMS dashboard, nested URL, refresh and back/forward passed','pages/wms/WavesPage.tsx':'Original table and history dialog rendered; create action blocked'},
};
for(const product of ['eyerrems','eyerstock','eyerflow']){
 const root=`demo-apps/${product}`;
 const origins=JSON.parse(fs.readFileSync(`${root}/source-origins.json`));
 const screens=[];
 for(const entry of origins){
  const file=slash(entry.ported);
  if(!/\.[jt]sx$/.test(file))continue;
  const source=fs.readFileSync(file,'utf8');
  if(!/<[A-Za-z]/.test(source))continue;
  const original=fs.readFileSync(path.resolve('..',entry.source));
  const originalHash=crypto.createHash('sha256').update(original).digest('hex');
  if(originalHash!==entry.sha256)throw Error(`Original source changed: ${entry.source}`);
  const imported=unique([...source.matchAll(/(?:from\s*|import\s*)['"]([^'"]+)['"]/g)].map(m=>m[1]));
  const names=pattern=>unique([...source.matchAll(pattern)].map(m=>m[1]));
  const tabs=names(/(?:label|title|name):\s*["']([^"'\n]+)["']/g);
  const columns=names(/(?:header|headerName):\s*["']([^"'\n]+)["']/g);
  const dialogs=names(/<([A-Z][\w]*(?:Dialog|Modal|Drawer|Sheet|Form))\b/g);
  const charts=names(/<([A-Z][\w]*(?:Chart|Graph))\b/g);
  const navigationKeys=names(/(?:path|to|key|value)=?[:]?\s*["']([^"'\n]+)["']/g);
  const assets=imported.filter(i=>/\.(svg|png|jpg|webp|css|woff2?)$/.test(i));
  screens.push({originalRepository:slash(entry.source).split('/')[0],originalComponent:slash(entry.source),mainModule:file.split('/pages/')[1]?.split('/')[0]??file.split('/modules/')[1]?.split('/')[0]??'shared',submodule:path.basename(file),navigationKeys,tabAndNestedLabelLiterals:tabs,tableColumns:columns,dialogs,charts,assets,imports:imported,demoComponent:file,implementationStatus:crypto.createHash('sha256').update(source).digest('hex')===entry.sha256?'Original component copied unchanged':'Adapted; inspect diff',functionalVerification:'Pending browser screen coverage',visualVerification:'Pending matched-viewport original comparison',sourceHash:entry.sha256,originalUnchanged:true});
  const verification=Object.entries(smoke[product]).find(([suffix])=>file.endsWith('/'+suffix))?.[1];
  if(verification)screens.at(-1).functionalVerification='Limited browser smoke passed: '+verification+'; remaining interactions pending';
 }
 const dir=`docs/${product}`;fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(`${dir}/SOURCE_PARITY.json`,JSON.stringify(screens,null,2));
 let text=`# ${product} source parity\n\nStatus: original frontend port in progress. **No screen is certified visually identical.**\n\nOriginal sources remain unchanged, verified against the import-time SHA-256 inventory. Sources and assets are vendored inside the website; deployment does not import sibling repositories.\n\nThe exhaustive per-component audit is in [SOURCE_PARITY.json](SOURCE_PARITY.json), including original paths, ported paths, module, navigation literals, tab/label literals, column headers, dialogs, charts, asset imports and verification status. Literal extraction is a discovery aid: dynamically composed tabs and imported child tables must still be checked at their referenced source paths. Empty extracted lists do not certify absence.\n\nEach original app keeps its own routed shell, JSX, CSS and Tailwind 3 configuration in an isolated document. The surrounding website uses TanStack Router. A 30px read-only strip is the only added framing. Native/API services are replaced locally.\n\n## Verification limits\n\n- Original desktop apps have not been launched against a safe sample database; original-to-demo screenshot comparison is pending for every screen.\n- Typed Stock/Flow fixtures preserve response shapes but still need semantic and cross-record validation for every nested view.\n- REMS endpoint fixtures are incomplete; complex detail and reporting response shapes require further verification.\n- Original create/edit controls remain in source, but actions and data mutations are blocked. Local UI state in complex editors needs a complete interaction audit.\n- Source presence does not mean runtime or visual parity has passed.\n\n## Component inventory\n\n| Original component | Website component | Implementation | Functional | Visual |\n|---|---|---|---|---|\n`;
 for(const screen of screens)text+=`| \`${screen.originalComponent}\` | \`${screen.demoComponent}\` | ${screen.implementationStatus} | ${screen.functionalVerification.startsWith('Limited')?'Limited browser smoke passed; see JSON':'Pending'} | Pending |\n`;
 fs.writeFileSync(`${dir}/SOURCE_PARITY.md`,text);
 console.log(product,screens.length,'audited components');
}
