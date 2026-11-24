import {READ_ONLY_MESSAGE} from './read-only';
// This bootstrap runs before any original application module. There is no network transport.
const deny=()=>{throw new Error(READ_ONLY_MESSAGE);};
window.fetch=async()=>deny();
XMLHttpRequest.prototype.open=deny;
window.WebSocket=class { static OPEN=1; static CLOSED=3; readyState=3; close(){} send(){deny();} addEventListener(){} removeEventListener(){} } as unknown as typeof WebSocket;
window.EventSource=class { close(){} } as unknown as typeof EventSource;
navigator.sendBeacon=()=>false;
window.open=()=>null;
// Keep display preferences separate from the website and never read persisted business records.
const storagePrefix='eyercall-source-demo:'+location.pathname.split('/')[2]+':';
const storageGet=Storage.prototype.getItem;
const storageSet=Storage.prototype.setItem;
const storageRemove=Storage.prototype.removeItem;
const displayKey=(key:string)=>/theme|palette|rems-ui|currency_code|sidebar|table|column|density|display|sound/i.test(key);
Storage.prototype.getItem=function(key){return displayKey(key)?storageGet.call(this,storagePrefix+key):null;};
Storage.prototype.setItem=function(key,value){if(displayKey(key))storageSet.call(this,storagePrefix+key,value);};
Storage.prototype.removeItem=function(key){storageRemove.call(this,storagePrefix+key);};
Storage.prototype.clear=function(){};
function reportRoute(){parent.postMessage({type:'eyercall-demo-route',path:location.hash.slice(1)||'/'},location.origin);}
// One parent history entry per navigation; the child document uses replacement history.
const replaceHistory=history.replaceState.bind(history);
history.pushState=(data,unused,url)=>{replaceHistory(data,unused,url);queueMicrotask(reportRoute);};
history.replaceState=(data,unused,url)=>{replaceHistory(data,unused,url);queueMicrotask(reportRoute);};
addEventListener('hashchange',reportRoute);
addEventListener('message',event=>{
 if(event.source!==parent||event.origin!==location.origin||event.data?.type!=='eyercall-demo-navigate')return;
 const route=event.data.path;
 if(typeof route==='string'&&route.startsWith('/')&&!route.startsWith('//')&&location.hash.slice(1)!==route)location.replace('#'+route);
});
addEventListener('DOMContentLoaded',()=>{
 reportRoute();
 const note=document.createElement('div'); note.role='status';
 Object.assign(note.style,{position:'fixed',bottom:'16px',right:'16px',zIndex:'2147483647',background:'#172b34',color:'white',padding:'9px 14px',borderRadius:'6px',font:'13px sans-serif',display:'none'});
 document.body.append(note);
 let timer:ReturnType<typeof setTimeout>;
 function indicate(){note.textContent=READ_ONLY_MESSAGE;note.style.display='block';clearTimeout(timer);timer=setTimeout(()=>note.style.display='none',2400);}
 addEventListener('eyercall-demo-blocked',indicate);
 // Supplement the transport block for local-only mutations and native actions.
 const changing=/^(?:save|create|add|delete|remove|submit|confirm|approve|reject|post|issue|cancel order|record payment|pay now|transfer|adjust stock|start production|complete production|import|upload|connect|sync now|send|invite|activate|deactivate|logout|sign out|sign in|change password|reset password|restore|backup|install|download update)\b/i;
 document.addEventListener('click',event=>{
  const target=(event.target as Element)?.closest('button,[role="button"],a');
  if(!target)return;
  const label=(target.getAttribute('aria-label')||target.textContent||'').trim().replace(/^[^A-Za-z]+/,'');
  if(changing.test(label)){event.preventDefault();event.stopImmediatePropagation();indicate();}
 },true);
 document.addEventListener('submit',event=>{event.preventDefault();event.stopImmediatePropagation();indicate();},true);
 document.addEventListener('change',event=>{if((event.target as HTMLInputElement)?.type==='file'){(event.target as HTMLInputElement).value='';event.stopImmediatePropagation();indicate();}},true);
});
