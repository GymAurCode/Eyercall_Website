const LOGO_SRC = "/logo.png";

/** Official Eyercall mark. Intrinsic size is 480x520 and is preserved everywhere. */
export function LogoMark({ className = "", alt = "" }: { className?: string; alt?: string }) {
  return (
    <img
      src={LOGO_SRC}
      alt={alt}
      width={480}
      height={520}
      className={className}
      decoding="async"
      draggable={false}
    />
  );
}
