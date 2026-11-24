/** Decorative vector compositions; no IDs, external assets or theme-specific paint. */
export function SoftwareIllustration({slug}:{slug:'eyerrems'|'eyerstock'|'eyerflow'}) {
 const accent='#008181';
 return <svg viewBox="0 0 480 320" fill="none" aria-hidden="true" focusable="false" className="mx-auto block h-auto w-full max-w-[440px] text-foreground/65" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round">
 {slug==='eyerrems' ? <>
  <path d="M32 276H448" className="stroke-foreground/15"/>
  <path d="M56 276V132L133 96V276M133 276V58L230 88V276" className="fill-background/70"/>
  <path d="M148 70L216 92M68 147L118 124" stroke={accent}/>
  {[0,1,2,3].map(r=><g key={r}>{[0,1,2].map(c=><rect key={c} x={150+c*23} y={108+r*35} width="12" height="18" rx="2" fill={r===1?accent:'currentColor'} fillOpacity={r===1?.65:.1} strokeOpacity=".3"/>)}</g>)}
  {[0,1,2].map(r=><g key={r}><path d={`M72 ${164+r*32}h14m14-7v14`} strokeOpacity=".5"/></g>)}
  <rect x="200" y="148" width="240" height="120" rx="12" className="fill-background"/>
  <path d="M216 170H310M216 182H270" strokeOpacity=".4"/>
  {[0,1,2,3,4,5].map(i=><rect key={i} x={216+i*35} y="201" width="25" height="38" rx="4" fill={accent} fillOpacity={i===4?.08:.2} stroke={accent} strokeDasharray={i===4?'3 3':undefined}/>)}
  <rect x="274" y="46" width="152" height="78" rx="10" className="fill-background"/>
  <path d="M290 105H410M291 99l23-15 24 5 25-23 22 9 21-18" stroke={accent} strokeWidth="2"/>
  <path d="M290 60H327" strokeOpacity=".35"/>
  <circle cx="252" cy="122" r="15" fill={accent} fillOpacity=".12" stroke={accent}/><path d="m246 122 4 4 8-9" stroke={accent}/>
 </> : slug==='eyerstock' ? <>
  <path d="M34 278H446" className="stroke-foreground/15"/>
  <path d="M65 66V278M298 66V278M55 142H308M55 238H308M55 74H308" strokeWidth="3"/>
  {([[80,89,64,53],[162,102,47,40],[225,87,57,55],[80,174,76,64],[177,180,45,58],[237,163,45,75]] as const).map(([x,y,w,h],i)=><g key={i}><rect x={x} y={y} width={w} height={h} rx="4" fill={accent} fillOpacity={i%2?.08:.18}/><path d={`M${x+w/2-6} ${y}v16h12V${y}`} stroke={accent}/><path d={`M${x+10} ${y+h-12}h15`} strokeOpacity=".5"/></g>)}
  <rect x="328" y="61" width="100" height="149" rx="12" className="fill-background"/>
  <path d="M345 82H391M345 95H374" strokeOpacity=".4"/>
  {[0,1,2].map(i=><g key={i}><rect x="345" y={112+i*23} width="65" height="7" rx="3" stroke="none" fill="currentColor" fillOpacity=".12"/><rect x="345" y={112+i*23} width={[51,35,58][i]} height="7" rx="3" stroke="none" fill={accent}/></g>)}
  <path d="M346 187H408" strokeOpacity=".3"/>
  <rect x="277" y="226" width="145" height="56" rx="8" className="fill-background"/>
  {[0,5,13,19,24,34,40,49,58,63,74,82,89,96].map((x,i)=><path key={x} d={`M${295+x} 239v24`} strokeWidth={i%3===0?3:1.5}/>)}
 </> : <>
  <path d="M125 94H225V151M355 94H255V151M125 238H225V183M355 238H255V183" stroke={accent} strokeWidth="2"/>
  <path d="M125 125V207M355 125V207" strokeDasharray="4 6" strokeOpacity=".25"/>
  {([[49,48],[303,48],[49,207],[303,207]] as const).map(([x,y],i)=><g key={i}><rect x={x} y={y} width="128" height="65" rx="12" className="fill-background"/><path d={`M${x+48} ${y+23}h61m-61 12h43m-43 12h53`} strokeOpacity=".25"/></g>)}
  <path d="M66 90V73l12-8 12 8v17H66Zm7 0V79h10v11M320 91V67h7l5 12 6-8v20h-18ZM66 225h25v29H66zM72 233h13m-13 7h13m-13 7h7M320 250v-18l13-7 13 7v18m-26-18 13 7 13-7m-13 7v18" stroke={accent}/>
  <rect x="199" y="126" width="82" height="82" rx="20" fill={accent} fillOpacity=".12" stroke={accent} strokeWidth="2"/>
  <path d="m221 157 19-11 19 11v22l-19 11-19-11v-22Zm0 0 19 11 19-11m-19 11v22" stroke={accent} strokeWidth="2"/>
  <circle cx="225" cy="94" r="4" fill={accent} stroke="none"/><circle cx="255" cy="238" r="4" fill={accent} stroke="none"/>
 </>}
 </svg>;
}
