/** Shared transport policy only. Each application retains its own frontend. */
export const READ_OPERATIONS = new Set([
 'get','list','summary','overview','movements','ledger','balances','balance',
 'profitAndLoss','partnerSplit','stockValuation','documentRegister','trialBalance',
 'balanceSheet','cashFlow','incomeStatement','aging','receivables','payables',
 'dashboard','stats','options','lookup','lookups','search','detail','details',
 'status','currentUser','setupStatus','check','loadDevSession','pipeline',
 'availability','valuation','history','tree','preview','report','reports',
 'costRollup','capacity','suggestions','coverage','snapshot','timeline',
 'purchaseOrders','salesOrders','sources','grants','access','previewAvailability',
 'numberPreview','transactions','chart','generalLedger','partyStatement','partyBalances',
 'cashBook','periodComparison','openingBalances','migrationAudit','reference','batches',
 'serials','reservations','variants','state','consumptionList','moSummary','health',
 'unmapped','revisions','rules','conflicts','exceptions','fees','matches','discrepancies',
 'jobs','integrityCheck','arAging','apAging','subledgerReconciliation',
 'closingChecklist','statement','schedule','compare','leaveBalance','pending',
 'worksheet','costReport',
]);
export function isReadOperation(method: string): boolean {
 return READ_OPERATIONS.has(method.split('.').at(-1) ?? '');
}
export const READ_ONLY_MESSAGE='Unavailable in Read-Only Demo';
export function rejectMutation(): never { throw new Error(READ_ONLY_MESSAGE); }
export function filterRows<T extends Record<string, unknown>>(rows:T[], request:Record<string,unknown>={}) {
 let result=rows.filter(row=> !request['search'] || Object.values(row).some(v=>String(v).toLowerCase().includes(String(request['search']).toLowerCase())));
 for(const key of ['kind','category','status','partyId','companyId','branchId'])if(request[key]!=null)result=result.filter(row=>row[key]===undefined||row[key]===request[key]);
 if(request['onlyActive'])result=result.filter(row=>row['isActive']!==false);
 if(request['onlyLowStock'])result=result.filter(row=>row['isLowStock']===true);
 if(request['fromDate'])result=result.filter(row=>!row['issueDate']||String(row['issueDate'])>=String(request['fromDate']));
 if(request['toDate'])result=result.filter(row=>!row['issueDate']||String(row['issueDate'])<=String(request['toDate']));
 return result.slice(0,Number(request['limit']??1000));
}
