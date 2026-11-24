import React, { useEffect, useState, useRef } from "react";
import ReactDOM from "react-dom";

const LETTERS = "EYERCALL".split("");

export const ScrollIndicator = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    innerHeight: 0,
    indicatorHeight: 0,
  });

  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      setScrollProgress(progress);
    };

    const handleResize = () => {
      setDimensions({
        innerHeight: window.innerHeight,
        indicatorHeight: indicatorRef.current?.offsetHeight || 0,
      });
      handleScroll();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleResize(); // Initialize

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const topPadding = 24;
  const bottomPadding = 24;
  const availableTravel = Math.max(
    0,
    dimensions.innerHeight - dimensions.indicatorHeight - topPadding - bottomPadding,
  );
  const translateY = scrollProgress * availableTravel;

  if (!mounted) return null;

  const content = (
    <div
      ref={indicatorRef}
      className="site-scroll-indicator fixed right-0.5 top-0 z-[2147483000] hidden flex-col items-center gap-0 bg-[#008181] px-0.5 py-1 rounded-sm lg:flex"
      style={{
        transform: `translateY(${topPadding + translateY}px)`,
        pointerEvents: "none",
      }}
    >
      {LETTERS.map((letter, i) => (
        <span key={i} className="text-[10px] font-bold text-white leading-none">
          {letter}
        </span>
      ))}
    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
