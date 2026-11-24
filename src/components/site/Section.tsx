import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function SectionHead({
  eyebrow,
  title,
  text,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
}) {
  return (
    <Reveal className="mx-auto mb-14 max-w-2xl text-center">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-muted-foreground">{text}</p>}
    </Reveal>
  );
}

const approachSteps = [
  {
    t: "Understand the need",
    b: "We start with how the business, team or learner actually works today.",
  },
  {
    t: "Design practical solutions",
    b: "We shape software and training around real tasks, not assumptions.",
  },
  {
    t: "Build and refine",
    b: "We develop, test and improve with the people who rely on the result.",
  },
  {
    t: "Support continuous learning",
    b: "We document, train and stay available as needs change.",
  },
];

export function Process({ steps = approachSteps }: { steps?: { t: string; b: string }[] }) {
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute left-[11px] top-0 h-full w-px bg-gradient-to-b from-primary/30 via-primary/10 to-transparent md:left-0 md:top-[11px] md:h-px md:w-full md:bg-gradient-to-r"
      />
      <ol className="relative grid gap-8 md:grid-cols-4 md:gap-6">
        {steps.map((s, i) => (
          <Reveal as="li" key={s.t} delay={i * 120} className="relative pl-10 md:pl-0 md:pt-10">
            <span className="absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full glass-strong">
              <span className="h-2 w-2 rounded-full bg-primary" />
            </span>
            <p className="font-display text-sm text-muted-foreground">0{i + 1}</p>
            <h3 className="mt-1 text-lg font-semibold">{s.t}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{s.b}</p>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
