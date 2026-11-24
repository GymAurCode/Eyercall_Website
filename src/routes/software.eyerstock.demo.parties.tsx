import {createFileRoute} from '@tanstack/react-router';
import SourceDemo from '@/features/software-demos/SourceDemo';
export const Route=createFileRoute('/software/eyerstock/demo/parties')({component:()=> <SourceDemo product="eyerstock" />,head:()=>({meta:[{title:'eyerstock Read-only Demo | Eyercall'},{name:'robots',content:'noindex'}]})});
