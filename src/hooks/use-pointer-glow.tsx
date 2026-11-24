import { useEffect, useRef, useState, useCallback, type RefObject } from "react";

interface PointerGlowState {
  x: number;
  y: number;
  visible: boolean;
}

export function usePointerGlow<T extends HTMLElement>(): [RefObject<T | null>, PointerGlowState] {
  const ref = useRef<T>(null);
  const [state, setState] = useState<PointerGlowState>({ x: 0, y: 0, visible: false });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setState({ x, y, visible: true });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setState((prev) => ({ ...prev, visible: false }));
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return [ref, state];
}
