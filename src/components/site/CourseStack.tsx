import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import type { Course } from "@/lib/courses";
import { CourseStackCard } from "./CourseStackCard";

/** A covered card settles at this fraction of its size, as the reference deck does. */
const MIN_SCALE = 0.94;

/** Sizes where a stuck card cannot fit the viewport; see the stack rules in styles.css. */
const STACK_DISABLED = "(prefers-reduced-motion: reduce), (max-height: 480px)";

export function CourseStack({ courses }: { courses: Course[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia(STACK_DISABLED).matches) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-course-card]", root);

        // Sticky offsets do the stacking on their own. The scripted part is only
        // the depth cue: a card eases down to MIN_SCALE while the next one slides
        // up over it, and back to 1 when the scroll is reversed.
        cards.slice(0, -1).forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.to(card, {
            scale: MIN_SCALE,
            ease: "none",
            transformOrigin: "top center",
            scrollTrigger: {
              trigger: next,
              start: "top bottom",
              // The neighbour has landed once its top reaches this card's sticky line.
              end: () => `top ${parseFloat(getComputedStyle(card).top) || 0}px`,
              scrub: 0.3,
              invalidateOnRefresh: true,
            },
          });
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, [courses]);

  return (
    <div ref={rootRef} className="course-stack" data-course-stack>
      <ol className="course-stack-stage">
        {courses.map((course, index) => (
          <li
            key={course.slug}
            className="course-stack-card"
            data-course-card={index}
            style={{ "--i": index } as CSSProperties}
          >
            <CourseStackCard course={course} index={index} total={courses.length} />
          </li>
        ))}
      </ol>
    </div>
  );
}
