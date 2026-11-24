import {createFileRoute} from '@tanstack/react-router';
import SourceDemo from '@/features/software-demos/SourceDemo';
export const Route=createFileRoute('/software/eyerrems/demo/$')({component:()=> <SourceDemo product="eyerrems" />});
