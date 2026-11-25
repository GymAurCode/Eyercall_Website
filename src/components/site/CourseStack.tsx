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
    let masterTrigger: { kill: () => void } | null = null;
    let timeline: any = null;

    (async () => {
      const [{ gsap }, { ScrollTrigger }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
      ]);
      if (cancelled) return;
      gsap.registerPlugin(ScrollTrigger);

      context = gsap.context(() => {
        const cards = gsap.utils.toArray<HTMLElement>("[data-course-card]", root);
        if (cards.length < 2) return;

        // Calculate the total scroll distance for the stack:
        // From when the first card's sticky top hits the stack top
        // to when the last card's sticky top hits the stack top.
        // The CSS defines: --stack-top + (n-1) * --stack-step for the last card.
        const stackTop = parseFloat(getComputedStyle(root).getPropertyValue("--stack-top")) || 88;
        const stackStep = parseFloat(getComputedStyle(root).getPropertyValue("--stack-step")) || 22;
        const lastCardIndex = cards.length - 1;
        const lastCardStickyTop = stackTop + lastCardIndex * stackStep;

        // The stack container height gives us the total scroll range.
        // We use the stage element's scrollHeight minus viewport height.
        const stage = root.querySelector(".course-stack-stage") as HTMLElement;
        if (!stage) return;

        // Create a single timeline for all card scale animations
        timeline = gsap.timeline({
          paused: true,
          // Use ease: "none" for direct scroll-to-animation mapping
        });

        // Add each card's scale animation to the timeline in sequence
        // Each card scales from 1 to MIN_SCALE as the next card lands on it
        cards.slice(0, -1).forEach((card, i) => {
          timeline!.to(card, {
            scale: MIN_SCALE,
            ease: "none",
            transformOrigin: "top center",
            // Each card's animation takes equal portion of timeline
            duration: 1,
          }, i);
        });

        // Create a single master ScrollTrigger that drives the timeline
        masterTrigger = ScrollTrigger.create({
          trigger: stage,
          start: "top top",
          end: `bottom top+=${lastCardStickyTop}`,
          animation: timeline,
          scrub: 0.3,
          invalidateOnRefresh: true,
        });

        // Force initial refresh to calculate correct positions
        ScrollTrigger.refresh();
      }, root);
    })();

    return () => {
      cancelled = true;
      masterTrigger?.kill();
      timeline?.kill();
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