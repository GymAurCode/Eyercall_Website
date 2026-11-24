import { useEffect, useRef, useState } from "react";
import { LogoMark } from "./Logo";
import { useGLTF } from "@react-three/drei";

type Phase = "show" | "leaving" | "done";

/** How long the brand mark holds before the layer slides away. */
const HOLD_MS = 1000;
/** Length of the slide-up; mirrors the transition classes on the layer. */
const EXIT_MS = 1000;
/**
 * Last-resort removal deadline, counted from the moment the transition starts.
 * The layer is normally removed by the transition's own `transitionend`, but a
 * busy main thread can delay the transition by a second or more, so the
 * fallback has to be generous enough for the slide to finish rather than
 * cutting it short.
 */
const EXIT_FALLBACK_MS = EXIT_MS + 2000;
const STORAGE_KEY = "eyercall-splash";

const MODEL_URL = "/3dlogo.glb";
if (typeof window !== "undefined") {
  try {
    useGLTF.preload(MODEL_URL);
  } catch {
    // Preload may fail; the component-level loader will retry.
  }
}

export function Splash() {
  const [phase, setPhase] = useState<Phase>("show");
  /** The decision is taken once per page load, not once per effect run. */
  const decidedRef = useRef(false);
  const skipRef = useRef(false);
  const startedAtRef = useRef<number | null>(null);
  const holdRef = useRef<number | null>(null);
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!decidedRef.current) {
      decidedRef.current = true;

      let alreadyShown = false;
      try {
        alreadyShown = Boolean(sessionStorage.getItem(STORAGE_KEY));
      } catch {
        // Storage can be unavailable in private browsing; show the splash once anyway.
      }

      skipRef.current =
        alreadyShown || window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (skipRef.current) {
        setPhase("done");
      } else {
        try {
          sessionStorage.setItem(STORAGE_KEY, "1");
        } catch {
          // Ignore storage failures.
        }
        startedAtRef.current = performance.now();
      }
    }

    if (skipRef.current) return;

    document.body.style.overflow = "hidden";

    // StrictMode replays this effect and tears the timer down with it; re-arm
    // it for the time that is left so the hold keeps its original length.
    const elapsed = startedAtRef.current === null ? 0 : performance.now() - startedAtRef.current;
    holdRef.current = window.setTimeout(() => setPhase("leaving"), Math.max(0, HOLD_MS - elapsed));

    return () => {
      if (holdRef.current !== null) {
        window.clearTimeout(holdRef.current);
        holdRef.current = null;
      }
      document.body.style.overflow = "";
    };
  }, []);

  // The layer is removed by the transition's own `transitionend`, so the
  // overlay always lives exactly as long as the slide. The fallback timer is
  // re-armed whenever the transition actually starts, because a busy main
  // thread can postpone the animation by more than the transition's length.
  useEffect(() => {
    const layer = layerRef.current;
    if (phase !== "leaving" || !layer) return;

    let fallback: number | null = null;
    const armFallback = () => {
      if (fallback !== null) window.clearTimeout(fallback);
      fallback = window.setTimeout(() => setPhase("done"), EXIT_FALLBACK_MS);
    };
    const onRun = (event: TransitionEvent) => {
      if (event.target === layer) armFallback();
    };
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== layer || event.propertyName !== "transform") return;
      setPhase("done");
    };
    const onCancel = (event: TransitionEvent) => {
      if (event.target === layer) armFallback();
    };

    layer.addEventListener("transitionrun", onRun);
    layer.addEventListener("transitionend", onEnd);
    layer.addEventListener("transitioncancel", onCancel);
    armFallback();

    return () => {
      layer.removeEventListener("transitionrun", onRun);
      layer.removeEventListener("transitionend", onEnd);
      layer.removeEventListener("transitioncancel", onCancel);
      if (fallback !== null) window.clearTimeout(fallback);
    };
  }, [phase]);

  useEffect(() => {
    if (phase === "done") document.body.style.overflow = "";
  }, [phase]);

  if (phase === "done") return null;

  const leaving = phase === "leaving";

  return (
    <div
      ref={layerRef}
      aria-hidden="true"
      onClick={() => setPhase("leaving")}
      className="splash fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background transition-transform duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]"
      style={{
        transform: leaving ? "translateY(-100%)" : "none",
        willChange: leaving ? "transform" : undefined,
      }}
    >
      <div className="orb left-[10%] top-[15%] h-80 w-80 bg-primary/15" />
      <div
        className="orb right-[8%] top-[30%] h-96 w-96 bg-primary/20"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="orb bottom-[5%] left-[40%] h-72 w-72 bg-primary/10"
        style={{ animationDelay: "-12s" }}
      />
      <div
        className="relative text-center transition-transform duration-1000"
        style={{ transform: leaving ? "translateY(40%)" : "none" }}
      >
        <div className="absolute inset-0 -z-10 scale-150 rounded-full bg-primary/10 blur-3xl" />
        <div style={{ animation: "splash-in 1400ms var(--ease-out) both" }}>
          <LogoMark className="mx-auto mb-7 h-16 w-auto sm:h-20" alt="" />
        </div>
        <div
          className="font-display text-6xl font-semibold sm:text-8xl"
          style={{ animation: "splash-in 1400ms var(--ease-out) both" }}
        >
          Eyercall
        </div>
        <p
          className="mt-5 text-sm text-muted-foreground sm:text-base"
          style={{ animation: "fade-up 900ms var(--ease-out) 900ms both" }}
        >
          Join. Connect. Deliver.
        </p>
        <div
          className="mx-auto mt-8 h-px w-40 origin-left bg-gradient-to-r from-transparent via-foreground/50 to-transparent"
          style={{ animation: "draw 1200ms var(--ease-out) 600ms both" }}
        />
      </div>
    </div>
  );
}
