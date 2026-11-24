import { Button } from "@/components/ui/button";
import { usePointerGlow } from "@/hooks/use-pointer-glow";
import { products, type Product, type ProductSlug } from "@/lib/content";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

export function ProductShowcase() {
  const [containerRef, glow] = usePointerGlow<HTMLDivElement>();
  const [hoveredSlug, setHoveredSlug] = useState<ProductSlug | null>(null);

  const productEntries = Object.entries(products) as [ProductSlug, Product][];

  return (
    <section className="relative overflow-hidden" ref={containerRef}>
      {/* Pointer glow */}
      <div
        className="pointer-events-none absolute z-10 rounded-full bg-local/20 blur-3xl transition-transform duration-150 ease-out"
        style={{
          width: 320,
          height: 320,
          left: glow.x - 160,
          top: glow.y - 160,
          opacity: glow.visible ? 0.6 : 0,
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-12">
        <div className="mb-16 max-w-2xl">
          <h2 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Products
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four structured systems for property, inventory, and learning operations.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {productEntries.map((entry, i: number) => {
            const [slug, product]: [ProductSlug, Product] = entry;
            const isActive = hoveredSlug === slug;
            return (
              <article
                key={slug}
                className={`group relative rounded-3xl glass-strong edge-light p-6 transition-all duration-300 ${
                  isActive ? "scale-[1.02] shadow-xl" : ""
                }`}
                onMouseEnter={() => setHoveredSlug(slug)}
                onMouseLeave={() => setHoveredSlug(null)}
                aria-label={product.name}
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="rounded-full bg-foreground/10 px-2.5 py-0.5 text-xs font-medium text-foreground">
                    {product.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mb-2 text-xl font-semibold text-foreground">{product.name}</h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {product.tagline}
                </p>

                <ul className="mb-6 space-y-2">
                  {product.highlights.map((highlight: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-local shrink-0" />
                      {highlight}
                    </li>
                  ))}
                </ul>

                <Button
                  variant={isActive ? "glow" : "glass"}
                  size="sm"
                  className="w-full gap-2"
                  asChild
                >
                  <a href={`/products/${slug}`}>
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </article>
            );
          })}
        </div>
      </div>

      {/* Second map block with explicit type for h */}
      <div className="mx-auto max-w-7xl px-6 pb-24 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
          {[75, 60, 85, 55].map((h: number, i: number) => (
            <div key={i} className="rounded-2xl glass-subtle p-5 text-center">
              <div className="text-3xl font-bold text-foreground">{h}%</div>
              <div className="mt-1 text-xs text-muted-foreground">Benchmark</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
