import { Link } from "@tanstack/react-router";
import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Course } from "@/lib/courses";
import { CourseVisual } from "./CourseVisual";

export function CourseStackCard({
  course,
  index,
  total,
}: {
  course: Course;
  index: number;
  total: number;
}) {
  return (
    <article className="course-card glass edge-light h-full overflow-hidden rounded-[1.5rem] border-teal-border p-6 sm:p-8 lg:p-9">
      <div className="course-card-grid grid h-full gap-6 md:grid-cols-[1.12fr_0.88fr] md:items-stretch md:gap-7 lg:gap-9">
        <div className="course-card-copy order-2 flex min-w-0 flex-col md:order-1">
          <div className="flex items-center gap-3">
            <span className="font-display text-sm font-medium text-primary-text">
              {String(index + 1).padStart(2, "0")}
              <span className="text-muted-foreground"> / {String(total).padStart(2, "0")}</span>
            </span>
            <span aria-hidden className="h-px w-7 bg-teal-border-strong" />
            <p className="eyebrow">{course.category}</p>
          </div>

          <h3 className="course-card-title mt-3 font-display text-2xl font-semibold leading-tight sm:text-3xl lg:text-[2.35rem]">
            {course.name}
          </h3>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
            {course.description}
          </p>

          <ul className="course-card-objectives mt-4 space-y-1.5" aria-label="What you will learn">
            {course.objectives.slice(0, 3).map((objective) => (
              <li key={objective} className="flex gap-2 text-[13px] leading-snug">
                <Check size={14} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                <span>{objective}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-5 flex flex-wrap gap-3">
            <Button asChild variant="glow" size="lg">
              <Link to="/courses/$slug" params={{ slug: course.slug }}>
                Explore Course <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-primary hover:bg-primary-hover text-white">
              <Link to="/courses/enroll" search={{ course: course.name }}>
                Enroll Now
              </Link>
            </Button>
          </div>
        </div>

        <div className="course-card-visual order-1 h-36 sm:h-52 md:order-2 md:h-auto lg:min-h-0">
          <CourseVisual course={course} />
        </div>
      </div>
    </article>
  );
}
