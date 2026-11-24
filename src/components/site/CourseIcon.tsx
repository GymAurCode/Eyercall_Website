import { courseIcons } from "@/lib/course-icons";
import type { CourseIcon } from "@/lib/courses";

export function CourseIconBadge({ icon }: { icon: CourseIcon }) {
  const Icon = courseIcons[icon];
  return (
    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
      <Icon size={22} aria-hidden />
    </span>
  );
}
