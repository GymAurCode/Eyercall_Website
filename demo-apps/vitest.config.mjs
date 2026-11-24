import {defineConfig} from 'vitest/config';
import path from 'node:path';
export default defineConfig({
 plugins:[{name:'original-demo-aliases',resolveId(id,importer){
  if(id.startsWith('@assets/'))return path.resolve('demo-apps',importer?.includes('/eyerflow/')?'eyerflow':'eyerstock','assets',id.slice(8));
  if(id.startsWith('@shared/'))return path.resolve('demo-apps',importer?.includes('/eyerflow/')?'eyerflow':'eyerstock','src/shared',id.slice(8));
 }}],
 test:{environment:'jsdom',include:['demo-apps/startup.test.ts'],testTimeout:30000},
 resolve:{dedupe:['react','react-dom']}
});
