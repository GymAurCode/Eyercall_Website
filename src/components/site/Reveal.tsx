import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";

export function Reveal({
  children,
  className = "",
  delay = 0,
  as: tag = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const Tag = tag as React.ElementType;
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const style: CSSProperties = { transitionDelay: `${delay}ms` };
  return (
    <Tag ref={ref} data-shown={shown} className={`reveal ${className}`} style={style}>
      {children}
    </Tag>
  );
}
