import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  text,
  actions,
  breadcrumbs,
  className = "",
}: {
  eyebrow: string;
  title: ReactNode;
  text?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}) {
  return (
    <section className={`page-shell pb-16 pt-40 text-center ${className}`}>
      {breadcrumbs && <div className="mb-4 text-left">{breadcrumbs}</div>}
      <p className="eyebrow line-rise">{eyebrow}</p>
      <h1
        className="line-rise mx-auto mt-4 max-w-4xl text-5xl font-semibold leading-[1.02] sm:text-6xl"
        style={{ animationDelay: "120ms" }}
      >
        {title}
      </h1>
      {text && (
        <p
          className="line-rise mx-auto mt-6 max-w-2xl text-lg text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          {text}
        </p>
      )}
      {actions && (
        <div
          className="line-rise mx-auto mt-9 flex max-w-2xl justify-center flex-wrap gap-3"
          style={{ animationDelay: "360ms" }}
        >
          {actions}
        </div>
      )}
    </section>
  );
}
