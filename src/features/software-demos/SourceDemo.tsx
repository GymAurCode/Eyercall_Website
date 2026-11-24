import {useEffect,useRef} from 'react';
import {useLocation,useNavigate,Link} from '@tanstack/react-router';

/** Each original frontend runs in its own document: original CSS and portals stay isolated. */
export default function SourceDemo({product}:{product:'eyerrems'|'eyerstock'|'eyerflow'}) {
 const frame=useRef<HTMLIFrameElement>(null);
 const {pathname,searchStr}=useLocation();
 const navigate=useNavigate();
 const base=`/software/${product}/demo`;
 const route=(pathname.slice(base.length)||'/')+searchStr;
 const initial=useRef(`/software-demo-assets/${product}/index.html#${route}`);
 useEffect(()=>{
  const onMessage=(event:MessageEvent)=>{
   if(event.origin!==location.origin||event.source!==frame.current?.contentWindow||event.data?.type!=='eyercall-demo-route')return;
   const path=event.data.path;
   if(typeof path!=='string'||!path.startsWith('/')||path.startsWith('//')||/#/.test(path))return;
   const next=base+(path==='/'?'':path);
   if(next!==window.location.pathname+window.location.search)void navigate({to:next});
  };
  window.addEventListener('message',onMessage);
  return ()=>window.removeEventListener('message',onMessage);
 },[base,navigate]);
 useEffect(()=>{frame.current?.contentWindow?.postMessage({type:'eyercall-demo-navigate',path:route},location.origin);},[route]);
 return <div style={{position:'fixed',inset:0,zIndex:10000,display:'flex',flexDirection:'column',background:'#fff'}}>
  <div style={{height:30,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 12px',background:'#132c34',color:'#fff',font:'12px system-ui'}}>
   <span>Interactive Demo — Read Only</span><Link to="/software" style={{color:'#fff'}}>Back to Eyercall</Link>
  </div>
  <iframe ref={frame} title={`${product} original frontend read-only demo`} src={initial.current} style={{width:'100%',flex:1,border:0,minHeight:0}} sandbox="allow-scripts allow-same-origin" />
 </div>;
}
