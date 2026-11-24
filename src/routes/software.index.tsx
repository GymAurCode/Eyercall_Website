import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { ProductVisual } from "@/components/site/ProductVisual";
import { Reveal } from "@/components/site/Reveal";
import { SoftwareDemoButton } from "@/components/site/SoftwareDemoButton";
import { productList } from "@/lib/content";

export const Route = createFileRoute("/software/")({
  head: () => ({
    meta: [
      { title: "Eyercall Software Solutions" },
      {
        name: "description",
        content:
          "Explore Eyercall's software: EyerREMS for real estate, EyerFlow for inventory, EyerStock for desktop stock operations and EyerType for typing practice.",
      },
      { property: "og:title", content: "Eyercall Software Solutions" },
      {
        property: "og:description",
        content:
          "Management systems and business software built by Eyercall — real estate, inventory, stock operations and typing practice.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SoftwarePage,
});

function SoftwarePage() {
  return (
    <>
      <PageHero
        eyebrow="Software"
        title="Software Built Around Real Operations."
        text="EyerREMS, EyerFlow, EyerStock and EyerType — management systems developed by Eyercall for businesses and learners. Each one is described in full on its own page."
        actions={
          <>
            <SoftwareDemoButton slug="eyerrems" variant="glow" />
            <Button asChild variant="glass" size="lg">
              <Link to="/services">Explore Our Services</Link>
            </Button>
          </>
        }
      />

      <section aria-label="Eyercall software products" className="page-shell py-16">
        <div className="space-y-8">
          {productList.map((product, index) => (
            <Reveal key={product.slug}>
              <article
                className={`${product.theme} group grid items-center gap-8 overflow-hidden rounded-4xl glass edge-light p-5 card-hover hover:-translate-y-1 sm:p-8 lg:grid-cols-2`}
              >
                <div className={index % 2 ? "lg:order-2" : ""}>
                  <p className="eyebrow text-local">{product.category}</p>
                  <h2 className="mt-2.5 text-3xl font-semibold sm:text-[2.625rem]">{product.name}</h2>
                  <p className="mt-3 text-base leading-relaxed">{product.summary}</p>
                  <ul className="mt-5 space-y-2">
                    {product.highlights.slice(0, 4).map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3 text-sm">
                        <Check className="h-4 w-4 shrink-0 text-local" aria-hidden /> {highlight}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 rounded-2xl glass-subtle p-3.5">
                    <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      <Users size={14} className="text-local" aria-hidden />
                      Who it's for
                    </p>
                    <ul className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                      {product.intendedFor.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="relative z-10 mt-6 flex flex-wrap gap-3">
                    <Button asChild variant="local" size="default">
                      <Link to="/software/$slug" params={{ slug: product.slug }}>
                        View Details <ArrowRight />
                      </Link>
                    </Button>
                    <SoftwareDemoButton slug={product.slug} variant="glass" size="default" compact />
                  </div>
                </div>
                <div className={index % 2 ? "lg:order-1" : ""}>
                  <ProductVisual slug={product.slug} />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[2.5rem] glass-strong edge-light p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="eyebrow">Beyond our products</p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Need something built for your workflow?
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Not every operation fits an off-the-shelf system. Eyercall also builds custom
                software, web applications and mobile apps around specific business requirements.
              </p>
            </div>
            <div className="flex lg:justify-end">
              <Button asChild variant="glass" size="lg">
                <Link to="/services" hash="custom-software">
                  Custom Development <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <CTASection
        eyebrow="See it for yourself"
        title="Explore a Live Demo."
        text="EyerREMS is available as an interactive read-only demo. Open it to explore the interface with fictional sample data, or contact us to talk about the other products."
        actions={
          <>
            <SoftwareDemoButton slug="eyerrems" variant="glow" />
            <Button asChild variant="glass" size="lg">
              <Link to="/contact" search={{ inquiry: "software" }}>
                Contact Sales
              </Link>
            </Button>
          </>
        }
      />
    </>
  );
}
