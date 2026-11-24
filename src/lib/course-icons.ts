import {
  Briefcase,
  Clapperboard,
  Code2,
  Monitor,
  Palette,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { CourseIcon } from "./courses";

export const courseIcons: Record<CourseIcon, LucideIcon> = {
  security: ShieldCheck,
  code: Code2,
  services: Briefcase,
  design: Palette,
  video: Clapperboard,
  computer: Monitor,
};
