import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

export function CTASection({
  eyebrow = "Next step",
  title,
  text,
  actions,
  className = "",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`page-shell py-16 ${className}`}>
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] glass-strong edge-light px-6 py-16 text-center sm:px-16">
          <div
            aria-hidden
            className="absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
          />
          <p className="eyebrow relative">{eyebrow}</p>
          <h2 className="relative mt-3 text-4xl font-semibold sm:text-5xl">{title}</h2>
          {text && <p className="relative mx-auto mt-4 max-w-xl text-muted-foreground">{text}</p>}
          {actions && (
            <div className="relative mt-8 flex flex-wrap justify-center gap-3">{actions}</div>
          )}
        </div>
      </Reveal>
    </section>
  );
}
