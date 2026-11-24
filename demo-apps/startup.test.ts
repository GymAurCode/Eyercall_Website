import {it,expect} from 'vitest';
it('loads the original Stock renderer and all its module imports',async()=>{
 const module=await import('./eyerstock/src/renderer/App');
 expect(typeof module.App).toBe('function');
});
it('loads the original Flow renderer, WMS schemas and suite modules',async()=>{
 const module=await import('./eyerflow/src/renderer/App');
 expect(typeof module.App).toBe('function');
});
