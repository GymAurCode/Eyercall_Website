import type { ReactNode } from "react";

const DARK_GRADIENT =
  "linear-gradient(160deg, #020d0d 0%, #041515 40%, #020d0d 100%)";
const LIGHT_GRADIENT =
  "linear-gradient(160deg, #f8fafb 0%, #eef2f7 40%, #f8fafb 100%)";

export default function ScreenBackground({
  children,
  theme,
  className = "",
  style,
}: {
  children: ReactNode;
  theme?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const gradient = theme === "light" ? LIGHT_GRADIENT : DARK_GRADIENT;

  return (
    <div
      className={`relative w-full min-h-full ${className}`}
      style={{
        background: gradient,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
