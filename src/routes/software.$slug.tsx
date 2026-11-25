import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, Check, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { products, productList, type ProductSlug } from "@/lib/content";
import { CTASection } from "@/components/site/CTASection";
import { ProductVisual } from "@/components/site/ProductVisual";
import { Reveal } from "@/components/site/Reveal";
import { SoftwareDemoButton } from "@/components/site/SoftwareDemoButton";
import { hasDemo } from "@/lib/demos";

export const Route = createFileRoute("/software/$slug")({
  loader: ({ params }) => {
    const product = products[params.slug as ProductSlug];
    if (!product) throw notFound();
    return { slug: product.slug };
  },
  head: ({ loaderData }) => {
    const product = loaderData && products[loaderData.slug];
    if (!product)
      return {
        meta: [{ title: "Product not found | Eyercall" }, { name: "robots", content: "noindex" }],
      };
    const title = `${product.name} — ${product.category} | Eyercall`;
    const canonicalUrl = `https://www.eyercall.com/software/${product.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: product.description },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
      ],
      script: [
        {
          type: "application/ld+json",
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: product.name,
            applicationCategory: product.category === "Desktop" ? "BusinessApplication" : "BusinessApplication",
            operatingSystem: product.category === "Desktop" ? "Windows" : "Web",
            description: product.description,
            url: canonicalUrl,
            publisher: {
              "@type": "Organization",
              name: "Eyercall",
              url: "https://www.eyercall.com"
            },
            offers: {
              "@type": "Offer",
              price: "0",
              priceCurrency: "USD",
              availability: "https://schema.org/InStock"
            }
          }),
        },
        {
          type: "application/ld+json",
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Eyercall",
            url: "https://www.eyercall.com",
            logo: "https://www.eyercall.com/logo.png",
            sameAs: [
              "https://www.linkedin.com/company/eyercall",
              "https://twitter.com/eyercall",
              "https://www.facebook.com/eyercall",
              "https://www.instagram.com/eyercall"
            ],
            description: "Eyercall builds business software and delivers practical IT training for individuals and organizations.",
            contactPoint: {
              "@type": "ContactPoint",
              email: "contact@eyercall.com",
              telephone: "+1-800-EYERCALL",
              website: "https://www.eyercall.com",
              availableLanguage: ["English"]
            }
          }),
        },
        {
          type: "application/ld+json",
          content: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://www.eyercall.com/"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Software",
                item: "https://www.eyercall.com/software/"
              },
              {
                "@type": "ListItem",
                position: 3,
                name: product.name,
                item: canonicalUrl
              }
            ]
          }),
        },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useLoaderData();
  const product = products[slug];
  const others = productList.filter((item) => item.slug !== product.slug);

  return (
    <div className={product.theme}>
      <section className="page-shell pb-16 pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <p className="eyebrow line-rise text-local">{product.category}</p>
            <h1
              className="line-rise mt-4 text-6xl font-semibold sm:text-7xl"
              style={{ animationDelay: "120ms" }}
            >
              {product.name}
            </h1>
            <p
              className="line-rise mt-4 text-2xl text-muted-foreground"
              style={{ animationDelay: "240ms" }}
            >
              {product.tagline}
            </p>
            <p
              className="line-rise mt-6 max-w-lg text-muted-foreground"
              style={{ animationDelay: "360ms" }}
            >
              {product.description}
            </p>
            <div
              className="line-rise mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "480ms" }}
            >
              <SoftwareDemoButton slug={product.slug} variant="local" />
              <Button asChild variant="glass" size="lg">
                <a href="#features">See features</a>
              </Button>
            </div>
          </div>
          <div className="line-rise" style={{ animationDelay: "300ms" }}>
            <ProductVisual slug={product.slug} />
          </div>
        </div>
      </section>

      <section className="page-shell grid gap-6 py-16 md:grid-cols-2">
        <Reveal>
          <div className="h-full rounded-3xl glass edge-light card-hover p-8">
            <p className="eyebrow">The problem</p>
            <p className="mt-4 text-lg">{product.problem}</p>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <div className="h-full rounded-3xl glass-strong edge-light card-hover p-8">
            <p className="eyebrow text-local">The approach</p>
            <p className="mt-4 text-lg">{product.overview}</p>
          </div>
        </Reveal>
      </section>

      <section
        id="features"
        aria-labelledby="features-heading"
        className="page-shell scroll-mt-24 py-16"
      >
        <Reveal>
          <h2 id="features-heading" className="mb-10 text-4xl font-semibold sm:text-5xl">
            What {product.name} covers
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {product.modules.map((module, index) => (
            <Reveal key={module.title} delay={(index % 4) * 80}>
              <div className="h-full rounded-3xl glass card-hover p-6 hover:-translate-y-1">
                <div className="mb-4 h-1 w-8 rounded-full bg-local" />
                <h3 className="font-semibold">{module.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{module.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="page-shell py-16">
        <Reveal>
          <h2 className="mb-10 text-4xl font-semibold sm:text-5xl">How it fits your day</h2>
        </Reveal>
        <ol className="grid gap-4 md:grid-cols-4">
          {product.workflow.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 100}
              className="rounded-3xl glass-subtle card-hover p-6"
            >
              <span className="font-display text-local">0{index + 1}</span>
              <h3 className="mt-3 font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.body}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="page-shell grid gap-10 py-16 lg:grid-cols-2">
        <Reveal>
          <h2 className="text-4xl font-semibold">Why teams choose it</h2>
          <ul className="mt-8 space-y-4">
            {product.benefits.map((benefit) => (
              <li key={benefit} className="flex gap-3">
                <Check className="mt-0.5 h-5 w-5 shrink-0 text-local" aria-hidden />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-3xl glass-subtle p-6">
            <p className="flex items-center gap-2 text-sm font-medium">
              <Users size={16} className="text-local" aria-hidden />
              Intended for
            </p>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {product.intendedFor.map((item) => (
                <li key={item} className="flex gap-2">
                  <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-local" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <h2 className="text-4xl font-semibold">Questions</h2>
          <Accordion type="single" collapsible className="mt-6 rounded-3xl glass px-6">
            {product.faq.map((item, index) => (
              <AccordionItem
                key={item.q}
                value={`q${index}`}
                className="border-glass-border last:border-0"
              >
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </section>

      <section className="page-shell py-16" aria-labelledby="other-products">
        <Reveal>
          <h2 id="other-products" className="mb-8 text-3xl font-semibold">
            Other Eyercall software
          </h2>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {others.map((other, index) => (
            <Reveal key={other.slug} delay={index * 80}>
              <Link
                to="/software/$slug"
                params={{ slug: other.slug }}
                className={`${other.theme} group flex h-full flex-col justify-between rounded-3xl glass card-hover p-7 hover:-translate-y-1`}
              >
                <div>
                  <p className="eyebrow text-local">{other.category}</p>
                  <h3 className="mt-3 text-xl font-semibold">{other.name}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{other.summary}</p>
                </div>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text">
                  View details
                  <ArrowRight
                    size={14}
                    aria-hidden
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <CTASection
        eyebrow={`${product.name} enquiry`}
        title={
          hasDemo(product.slug) ? `Explore ${product.name} now.` : `See ${product.name} in action.`
        }
        text={
          hasDemo(product.slug)
            ? "Open the interactive read-only demo to explore the interface with fictional sample data — no form, no sign-up and no production data."
            : "The interactive demo for this product is still being prepared. Contact our team to discuss your workflow and arrange a walkthrough."
        }
        actions={
          <>
            <SoftwareDemoButton slug={product.slug} variant="local" />
            <Button asChild variant="glass" size="lg">
              <Link to="/software">All Software</Link>
            </Button>
          </>
        }
      />
    </div>
  );
}
