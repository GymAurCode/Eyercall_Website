/** Adapted boundary for the original REMS frontend; all reads are local. */
import {stats,records,user,permissions,activity,crmDashboard} from '../../demo-data';
import {READ_ONLY_MESSAGE,filterRows} from '../../../read-only';
const token='demo.'+btoa(JSON.stringify({exp:4102444800}))+'.fictional';
export const getAuthToken=()=>token;
export const setAuthToken=(_token:string|null)=>{};
export const setAuthReady=(_ready:boolean)=>{};
export const registerLogoutCallback=(_callback:()=>void)=>{};
export const isTokenExpired=(_token:string)=>false;
function read(url:string,params:Record<string,any>={}) {
 const path=(url.split('?')[0]??url).replace(/\/$/,'');
 if(path==='/bootstrap')return {user,stats,activity,unread_count:0,permissions:{},from_cache:false,company_mode:'demo_readonly',company_type:'real_estate'};
 if(path==='/auth/me')return user;
 if(path==='/rbac/check-permissions')return {is_super_admin:true,user_id:1,permissions};
 if(path==='/company/currency')return {currency_code:'PKR'};
 if(path==='/dashboard/stats')return stats;
 if(path==='/crm/dashboard')return crmDashboard;
 if(path==='/activity/recent')return activity;
 if(path.includes('unread-count'))return {count:0};
 if(path.includes('recovery'))return {missed_count:0,reminders:[]};
 if(path.includes('/notifications'))return [];
 if(/\/lookups\//.test(path))return ['active','new','contacted','qualified','closed','pending','completed'].map((value,i)=>({id:i+1,value,label:value.charAt(0).toUpperCase()+value.slice(1),name:value,sort_order:i,is_active:true}));
 if(path.includes('dashboard')||path.endsWith('/stats'))return {...stats,total_leads:3,total_clients:3,total_dealers:3,total_deals:3,total_projects:3,active_projects:3,completed_projects:0,delayed_projects:0,total_budget:7500000,total_expenses:2625000,remaining_budget:4875000,workers_on_site:12,equipment_active:3,purchase_orders_pending:0,invoices_pending:0,quality_failures:0,safety_incidents:0,avg_progress_pct:35,budget_used_pct:35,budget_remaining_pct:65,material_consumption_pct:25,task_completion_pct:35,outstanding_vendor_payments:0,recent_leads:records,recent_deals:records,recent_activity:activity,leads_by_status:[],deals_by_stage:[],monthly_revenue:[],projects:records};
 if(path.endsWith('/hierarchy/tree'))return records;
 if(path.endsWith('/hierarchy'))return {dealer:records[0],children:[],ancestors:[],total_dealers:3};
 if(path.endsWith('/balance'))return {balance:250000,debit:1250000,credit:1000000};
 const selected=records.find(r=>r.id===Number(path.match(/\/(\d+)(?:\/detail)?$/)?.[1]));
 if(selected)return structuredClone({...selected,property:selected,client:selected,dealer:selected,lead:selected,deal:selected,summary:stats});
 const list=filterRows(records,params);
 if(path==='/mobile/my-clients')return list;
 if(/^\/crm\/(leads|clients|dealers|deals|followups|site-visits|payments)$/.test(path))return {items:list,total:list.length,page:params['page']??1,per_page:params['per_page']??20,pages:1};
 if(path.includes('audit-logs'))return {logs:[],total:0,page:1,per_page:20};
 if(path.endsWith('/settings')||path.includes('company-settings'))return {company_name:'Cedar Demo Company',currency_code:'PKR',theme:'dark'};
 if(/\/reports\//.test(path))return {rows:list,items:list,total:375000,income:1250000,expense:350000,net_profit:900000,assets:list,liabilities:[],equity:[],accounts:list,entries:list};
 return list;
}
async function blocked<T=any>(..._args:any[]):Promise<{data:T;status:number}>{throw Object.assign(new Error(READ_ONLY_MESSAGE),{response:{status:403,data:{detail:READ_ONLY_MESSAGE}}});}
export const api={
 defaults:{baseURL:''},
 async get<T=any>(url:string,config?:{params?:Record<string,any>;[key:string]:any}):Promise<{data:T;status:number;headers:Record<string,string>}>{
  const data=structuredClone(read(url,config?.params));
  const total=Array.isArray(data)?data.length:('total' in data?Number(data.total):0);
  return {data:data as T,status:200,headers:{'x-total-count':String(total),'X-Total-Count':String(total)}};
 },
 post:blocked,put:blocked,patch:blocked,delete:blocked,
 async request(config:any){if((config.method??'get').toLowerCase()!=='get')return blocked();return this.get(config.url,config);},
};
