import type { ProductSlug } from "@/lib/content";

/**
 * Software demo routes that are actually implemented and render a full,
 * read-only interface. A product only gets an active "Show Demo" button when
 * it appears here; everything else shows an explicit "Demo Coming Soon" state.
 *
 * Keep the literal route strings so TanStack Router can type-check the links.
 */
export const softwareDemoRoutes = {
  eyerrems: "/software/eyerrems/demo",
  eyerflow: "/software/eyerflow/demo",
  eyerstock: "/software/eyerstock/demo",
} as const satisfies Partial<Record<ProductSlug, string>>;

export type DemoProductSlug = keyof typeof softwareDemoRoutes;

export type SoftwareDemoRoute = (typeof softwareDemoRoutes)[DemoProductSlug];

export function demoRouteFor(slug: ProductSlug): SoftwareDemoRoute | null {
  return softwareDemoRoutes[slug as DemoProductSlug] ?? null;
}

export function hasDemo(slug: ProductSlug): slug is DemoProductSlug {
  return slug in softwareDemoRoutes;
}
