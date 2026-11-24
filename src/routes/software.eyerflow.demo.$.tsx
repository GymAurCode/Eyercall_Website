import {createFileRoute} from '@tanstack/react-router';
import SourceDemo from '@/features/software-demos/SourceDemo';
export const Route=createFileRoute('/software/eyerflow/demo/$')({component:()=> <SourceDemo product="eyerflow" />});
