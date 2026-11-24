import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { demoRouteFor, hasDemo } from "@/lib/demos";
import type { ProductSlug } from "@/lib/content";
import { cn } from "@/lib/utils";

type DemoButtonVariant = "local" | "glow" | "glass";

interface SoftwareDemoButtonProps {
  slug: ProductSlug;
  variant?: DemoButtonVariant;
  size?: "default" | "sm" | "lg";
  className?: string;
  /** Use the compact "Show Demo" label without the play icon. */
  compact?: boolean;
}

/**
 * The single source of truth for software demo actions.
 *
 * - When the read-only demo exists, this renders a working "Show Demo" link.
 * - When it does not, it renders a clearly labelled, disabled state. It never
 *   links to a route that would 404 or to a contact form.
 */
export function SoftwareDemoButton({
  slug,
  variant = "local",
  size = "lg",
  className,
  compact = false,
}: SoftwareDemoButtonProps) {
  const route = demoRouteFor(slug);

  if (route && hasDemo(slug)) {
    return (
      <Button asChild variant={variant} size={size} className={className}>
        <Link to={route} aria-label={`Show the ${slug} interactive read-only demo`}>
          {compact ? null : <Play aria-hidden />}
          Show Demo
          {compact ? <ArrowRight aria-hidden /> : null}
        </Link>
      </Button>
    );
  }

  return (
    <span className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      <Button
        variant="glass"
        size={size}
        disabled
        aria-disabled="true"
        title="The interactive demo for this product is not available yet."
      >
        {compact ? null : <Play aria-hidden />}
        Show Demo
      </Button>
      <span className="text-xs font-medium text-muted-foreground">Demo Coming Soon</span>
    </span>
  );
}
