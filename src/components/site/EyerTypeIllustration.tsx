/** Typing workspace with a keyboard, game targets and IELTS practice sheet. */
export function EyerTypeIllustration() {
 return <svg viewBox="0 0 480 320" fill="none" aria-hidden="true" focusable="false" className="mx-auto block h-auto w-full max-w-[440px] text-foreground/65" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
  <rect x="38" y="52" width="292" height="150" rx="12" className="fill-background"/>
  <path d="M38 82H330" strokeOpacity=".2"/>
  <g fill="currentColor" stroke="none" fontFamily="system-ui, sans-serif">
   <text x="54" y="71" fontSize="11" fontWeight="600">TYPING PRACTICE</text>
   <text x="58" y="115" fontSize="15" letterSpacing="1">Build your typing skills.</text>
   <text x="58" y="144" fontSize="15" letterSpacing="1" fillOpacity=".35">One keystroke at a time.</text>
  </g>
  <path d="M58 122H149M155 99V119" stroke="#008181" strokeWidth="2"/>
  <path d="M58 173H307" strokeOpacity=".12" strokeWidth="5"/>
  <path d="M58 173H205" stroke="#008181" strokeWidth="5"/>
  <rect x="48" y="222" width="286" height="72" rx="12" className="fill-background"/>
  {[0,1,2].map(row=><g key={row}>{Array.from({length:row===2?8:10},(_,col)=><rect key={col} x={62+col*25+(row===2?25:row*4)} y={233+row*17} width="18" height="11" rx="2" fill={row===1&&col===3?'#008181':'currentColor'} fillOpacity={row===1&&col===3?.6:.08} strokeOpacity=".25"/>)}</g>)}
  <rect x="351" y="33" width="96" height="90" rx="12" className="fill-background"/>
  <circle cx="399" cy="65" r="17" stroke="#008181"/><path d="m399 65 8-10M388 65H391M407 65H410" stroke="#008181"/>
  <g fill="currentColor" stroke="none" textAnchor="middle" fontFamily="system-ui, sans-serif"><text x="399" y="98" fontSize="12" fontWeight="600">SPEED TEST</text></g>
  <rect x="351" y="145" width="96" height="66" rx="12" className="fill-background"/>
  <path d="m369 163 8 8-8 8m61-16-8 8 8 8" stroke="#008181"/><rect x="389" y="159" width="20" height="24" rx="4" fill="#008181" fillOpacity=".12" stroke="#008181"/>
  <text x="399" y="199" fill="currentColor" stroke="none" textAnchor="middle" fontSize="11" fontFamily="system-ui, sans-serif" fontWeight="600">TYPING GAMES</text>
  <rect x="359" y="231" width="80" height="65" rx="7" className="fill-background"/>
  <text x="370" y="250" fill="currentColor" stroke="none" fontSize="12" fontFamily="system-ui, sans-serif" fontWeight="600">IELTS</text>
  <path d="m370 264 3 3 5-6m-8 17 3 3 5-6" stroke="#008181"/><path d="M386 264H426M386 278H416" strokeOpacity=".35"/>
 </svg>;
}
