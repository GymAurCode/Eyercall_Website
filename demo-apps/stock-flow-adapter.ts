import {isReadOperation,filterRows,READ_ONLY_MESSAGE} from './read-only';
type Row=any;
export function installBridge(fixtures:Record<string,any>, modules:readonly string[], actions:readonly string[]) {
 const user={...fixtures['auth.currentUser'],id:1,username:'demo.visitor',displayName:'Demo Visitor',roleName:'Administrator',mustChangePassword:false,avatarDataUrl:null,licensedSuites:['ims','mms','wms','oms','ecom','erp'],permissions:modules.flatMap(module=>actions.map(action=>({module,action})))};
 fixtures['auth.currentUser']=user;
 fixtures['auth.setupStatus']={isComplete:true};
 fixtures['auth.loadDevSession']=null;
 const scope={companyId:'1',allBranches:true,branches:['1','2','3'],allOwners:true,suites:['ims','mms','wms','oms','ecom','erp']};
 if('core.access' in fixtures)fixtures['core.access']=scope;
 if(fixtures['wms.snapshot'])fixtures['wms.snapshot'].scope=scope;
 if(fixtures['wms.snapshot']?.waves)fixtures['wms.snapshot'].waves=fixtures['wms.snapshot'].waves.map((wave:Row,i:number)=>({...wave,status:['draft','released','completed'][i],method:'wave',task_count:3,completed_tasks:i===2?3:0,picked_milli:i===2?6000:0}));
 if(fixtures['wms.waves.list'])fixtures['wms.waves.list']=fixtures['wms.waves.list'].map((wave:Row,i:number)=>({...wave,status:['draft','released','completed'][i],method:'wave',task_count:3,completed_tasks:i===2?3:0,picked_milli:i===2?6000:0}));
 if(fixtures['wms.waves.get']){
  fixtures['wms.waves.get'].wave=structuredClone(fixtures['wms.waves.list']?.[0]??fixtures['wms.waves.get'].wave);
  fixtures['wms.waves.get'].events=(fixtures['wms.waves.get'].events??[]).map((event:Row)=>({...event,action:'created',actor_name:'Demo Visitor',payload:'{}',reason:'Fictional picking wave history'}));
 }
 fixtures['license.check']={ok:true,clientName:'Cedar Demo Company',expiresAt:null,daysUntilExpiry:null,isExpiringSoon:false,machineId:'FICTIONAL-DEMO'};
 fixtures['settings.get']={...fixtures['settings.get'],theme:'light',themePalette:'ocean-teal',themeOnboardingComplete:true,companyName:'Cedar Demo Company',companyLogoDataUrl:null,companyLogoPath:'',currency:'PKR',allowNegativeStock:false,dailyBackupEnabled:false,invoiceFooter:'Fictional demonstration — no transaction permitted.'};
 const products:Row[]=(fixtures['products.list']??[]).map((p:Row,i:number)=>({...p,id:i+1,name:['Carbon Filter Cartridge','RO Membrane 75 GPD','Sediment Filter 10 inch'][i],sku:`DEMO-P00${i+1}`,category:['Filtration','Membranes','Filtration'][i],unit:'pcs',isActive:true,isLowStock:i===2,quantityMilli:[120000,45000,3000][i],reorderLevelMilli:10000,averageCostFils:[85000,235000,42000][i],salePriceFils:[125000,325000,75000][i]}));
 fixtures['products.list']=products;
 for(const product of products){product.lastSalePriceFils=product.salePriceFils;product.lastCostFils=product.averageCostFils;product.stockValueFils=product.quantityMilli*product.averageCostFils/1000;}
 fixtures['products.get']=products[0];
 const baseParties=fixtures['parties.list']??[];
 fixtures['parties.list']=['customer','supplier'].flatMap((kind,index)=>baseParties.map((p:Row,i:number)=>({...p,id:index*3+i+1,code:`DEMO-${kind[0]}${i+1}`,name:['Cedar','Orchard','Harbor'][i]+(kind==='customer'?' Demo Customer':' Demo Supplier'),kind,isActive:true,openingBalanceFils:0})));
 const baseDocuments=fixtures['documents.list']??[];
 fixtures['documents.list']=['invoice','purchaseInvoice'].flatMap((kind,index)=>baseDocuments.map((d:Row,i:number)=>{
  const party=fixtures['parties.list'][index*3+i];const product=products[i];const price=kind==='invoice'?product.salePriceFils:product.averageCostFils;const gross=price*2;
  return {...d,id:index*3+i+1,kind,number:`DEMO-${index?'PUR':'INV'}-${i+1}`,partyId:party.id,partyName:party.name,issueDate:'2026-11-20',dueDate:'2026-12-20',status:i===2?'partPaid':'paid',netFils:gross,vatFils:0,grossFils:gross,discountFils:0,paidFils:i===2?price:gross,outstandingFils:i===2?price:0,lines:[{id:1,lineNo:1,productId:product.id,description:product.name,quantityMilli:2000,unitPriceFils:price,netFils:gross,vatFils:0,vatTreatment:'zero',unitCostFils:product.averageCostFils,costFils:product.averageCostFils*2}]};
 }));
 if(fixtures['dashboard.summary']){
  const d=fixtures['dashboard.summary'];
  d.inventory={...d.inventory,productCount:products.length,totalQuantityMilli:168000,stockedCount:3,units:['pcs'],recentProducts:products,lowStockProducts:products.filter(p=>p.isLowStock),categories:[{name:'Filtration',count:2,valueFils:10326000},{name:'Membranes',count:1,valueFils:10575000}],totalStockValueFils:20901000};
  d.lowStockCount=1;d.generatedAtIso='2026-11-20T09:00:00.000Z';
 }
 const ok=(data:unknown)=>({ok:true,data});
 const blocked=()=>({ok:false,error:{code:'READ_ONLY',message:READ_ONLY_MESSAGE}});
 const api={
  async invoke(method:string,request:Row={}){
   if(method==='settings.update'&&Object.keys(request).every(key=>['theme','themePalette'].includes(key))){Object.assign(fixtures['settings.get'],request);return ok(structuredClone(fixtures['settings.get']));}
   if(!isReadOperation(method))return blocked();
   if(!(method in fixtures))return {ok:false,error:{code:'DEMO_UNMAPPED',message:`Demo read adapter missing: ${method}`}};
   let value=structuredClone(fixtures[method]);
   if(method==='wms.waves.get'&&request.id!=null){value.wave=structuredClone(fixtures['wms.waves.list'].find((wave:Row)=>wave.id===request.id)??value.wave);}
   if(Array.isArray(value))value=filterRows(value,request);
   if(method.endsWith('.get')&&request.id!=null&&value&&typeof value==='object'&&'id' in value){const rows=fixtures[method.slice(0,-3)+'list'];value=rows?.find((r:Row)=>r.id===request.id)??value;}
   return ok(value);
  },
  async getAppInfo(){return ok({name:'Read-only Demo',version:'1.0.0',platform:'browser',isPackaged:false,locale:'en-PK'});},
  onUpdateStatus(){return ()=>{};},
  async currentUpdate(){return ok({supported:false,state:'idle',currentVersion:'1.0.0',latestVersion:null,progressPercent:null,message:null,releaseUrl:null,checkedAtIso:null});},
  async chooseBackupFolder(){return blocked();},async restoreBackup(){return blocked();},async runBackupNow(){return blocked();},async exportDiagnostics(){return blocked();},async pickFile(){return blocked();},async pickImage(){return blocked();},async printHtml(){return blocked();},async saveHtmlAsPdf(){return blocked();},async openExternal(){return blocked();},async checkForUpdate(){return blocked();},async downloadUpdate(){return blocked();},async installUpdate(){return blocked();}
 };
 Object.defineProperty(window,'api',{value:Object.freeze(api),writable:false});
}
