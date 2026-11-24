import { Component, Suspense, useCallback, useEffect, useState, type ReactNode } from "react";
import { LogoMark } from "./Logo";

import HeroCanvas from "./HeroCanvas";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      (window.WebGL2RenderingContext && canvas.getContext("webgl2")) ||
      (window.WebGLRenderingContext && canvas.getContext("webgl")),
    );
  } catch {
    return false;
  }
}

class ModelBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { failed: boolean }
> {
  override state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  override render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

/**
 * Interactive 3D Eyercall mark. Falls back to the flat logo only when WebGL is
 * unavailable, the visitor asks for reduced motion, or the scene fails to
 * load - never while the model is on its way in.
 */
export function HeroModel({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<"pending" | "webgl" | "static">("pending");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMode(reduced || !hasWebGL() ? "static" : "webgl");
  }, []);

  const handleReady = useCallback(() => setReady(true), []);

  if (mode === "static") {
    return (
      <div className={className}>
        <LogoMark className="h-full w-full p-[8%] object-contain" alt="" />
      </div>
    );
  }

  return (
    <div className={className}>
      <ModelBoundary fallback={<LogoMark className="h-full w-full p-[8%] object-contain" alt="" />}>
        {/* Nothing is drawn until the model is on screen, so the mark never
            flickers between the flat logo and the canvas. */}
        <div
          className="h-full w-full transition-opacity duration-200 ease-out"
          style={{ opacity: ready ? 1 : 0 }}
        >
          {mode === "webgl" ? (
            <Suspense fallback={null}>
              <HeroCanvas onReady={handleReady} />
            </Suspense>
          ) : null}
        </div>
      </ModelBoundary>
    </div>
  );
}
