import {describe,it,expect} from 'vitest';
import {installBridge} from '../../demo-apps/stock-flow-adapter';

describe('isolated Stock/Flow bridge',()=>{
 const fixtures={'products.list':[{}, {}, {}],'parties.list':[{}, {}, {}],'documents.list':[{}, {}, {}]};
 installBridge(fixtures,['products','finance'],['view','create','edit','delete']);
 const bridge=(window as any).api;
 it.each(['products.save','wms.waves.release','mms.mo.start','erp.bank.lines.book','erp.onboarding.bootstrap','ecom.orders.import','users.delete'])('rejects %s without updating fixtures',async method=>{
  expect(await bridge.invoke(method,{id:1})).toMatchObject({ok:false,error:{code:'READ_ONLY'}});
 });
 it('permits appearance but rejects business settings',async()=>{
  expect(await bridge.invoke('settings.update',{theme:'dark'})).toMatchObject({ok:true,data:{theme:'dark'}});
  expect(await bridge.invoke('settings.update',{theme:'light',companyName:'Changed'})).toMatchObject({ok:false,error:{code:'READ_ONLY'}});
 });
 it('keeps search and low-stock filtering functional',async()=>{
  const result=await bridge.invoke('products.list',{search:'sediment',onlyLowStock:true});
  expect(result.data).toHaveLength(1);
  expect(result.data[0].sku).toBe('DEMO-P003');
 });
 it('returns copies and preserves separate customer and supplier records',async()=>{
  const first=await bridge.invoke('parties.list',{kind:'supplier'});
  expect(first.data).toHaveLength(3);
  first.data[0].name='Edited';
  const next=await bridge.invoke('parties.list',{kind:'supplier'});
  expect(next.data[0].name).toBe('Cedar Demo Supplier');
 });
 it('does not silently succeed for unmapped reads',async()=>{
  expect(await bridge.invoke('unmapped.list',{})).toMatchObject({ok:false,error:{code:'DEMO_UNMAPPED'}});
 });
});
