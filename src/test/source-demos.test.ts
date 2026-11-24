import {describe,it,expect} from 'vitest';
import {filterRows,isReadOperation} from '../../demo-apps/read-only';
import {api} from '../../demo-apps/eyerrems/src/lib/api';

describe('source demo transport isolation',()=>{
 it.each(['products.save','documents.issue','wms.waves.release','mms.mo.start','erp.journal.post','erp.onboarding.bootstrap','erp.bank.lines.book','ecom.channels.sync','auth.login','settings.update','users.delete','future.unknown'])('denies %s',method=>{
  expect(isReadOperation(method)).toBe(false);
 });
 it.each(['dashboard.summary','products.list','products.get','wms.waves.get','finance.generalLedger','ecom.orders.list','erp.crm.opportunities.pipeline'])('permits local read %s',method=>{
  expect(isReadOperation(method)).toBe(true);
 });
 it('filters local rows without modifying the fixture',()=>{
  const rows=[{name:'Cedar Filter',kind:'customer'},{name:'Harbor Membrane',kind:'supplier'}];
  expect(filterRows(rows,{search:'CEDAR',kind:'customer'})).toEqual([rows[0]]);
  expect(rows).toHaveLength(2);
 });
 it.each(['post','put','patch','delete'] as const)('REMS rejects %s at the service boundary',async method=>{
  await expect(api[method]()).rejects.toThrow('Unavailable in Read-Only Demo');
 });
 it('returns independent deterministic local records',async()=>{
  const first=await api.get('/properties/');
  first.data[0].name='Attempted mutation';
  const second=await api.get('/properties/');
  expect(second.data[0].name).toBe('Cedar Demo');
 });
});
