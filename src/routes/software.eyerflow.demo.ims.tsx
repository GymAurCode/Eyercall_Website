import {createFileRoute} from '@tanstack/react-router';
import SourceDemo from '@/features/software-demos/SourceDemo';
export const Route=createFileRoute('/software/eyerflow/demo/ims')({component:()=> <SourceDemo product="eyerflow" />,head:()=>({meta:[{title:'eyerflow Read-only Demo | Eyercall'},{name:'robots',content:'noindex'}]})});
