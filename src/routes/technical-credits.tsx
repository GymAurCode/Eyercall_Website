import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Code2, GraduationCap, Linkedin, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";
import { LogoMark } from "@/components/site/Logo";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/Section";
import { SocialLinks } from "@/components/site/SocialLinks";
import {
  contactChannels,
  hasContactChannels,
  hasSocialLinks,
  telHref,
  whatsappHref,
} from "@/lib/site";

export const Route = createFileRoute("/technical-credits")({
  head: () => ({
    meta: [
      { title: "Technical Credits — Eyercall" },
      {
        name: "description",
        content:
          "Technical credits for Eyercall software products. Acknowledging the developers and engineers behind our digital solutions.",
      },
      { property: "og:title", content: "Technical Credits — Eyercall" },
      {
        property: "og:description",
        content:
          "Acknowledging the technical team behind Eyercall's software products and digital solutions.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://www.eyercall.com/technical-credits" },
    ],
    script: [
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
          "@type": "Person",
          name: "Muhammad Umer Farooq",
          url: "https://www.eyercall.com/technical-credits",
          jobTitle: "Senior Developer",
          worksFor: {
            "@type": "Organization",
            name: "Eyercall",
            url: "https://www.eyercall.com"
          },
          description: "Muhammad Umer Farooq is a Senior Developer at Eyercall, contributing to the development and technical advancement of its software products.",
          sameAs: []
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
              name: "Technical Credits",
              item: "https://www.eyercall.com/technical-credits"
            }
          ]
        }),
      },
    ],
  }),
  component: TechnicalCredits,
});

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function TechnicalCredits() {
  return (
    <>
      <PageHero
        eyebrow="Technical Credits"
        title="The People Behind Our Software"
        text="Eyercall's software products are built by a dedicated team of engineers and developers. This page acknowledges their technical contributions."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/about">
                About Eyercall <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/software">Explore Our Software</Link>
            </Button>
          </>
        }
      />

      <section className="page-shell py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <p className="eyebrow">Technical leadership</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Senior Development</h2>
            <p className="mt-6 text-lg">
              Eyercall's software products — including EyerREMS, EyerFlow, and EyerStock — are developed
              under the technical guidance of our senior engineering team.
            </p>
            <p className="mt-4 text-muted-foreground">
              Our development approach emphasises practical architecture, maintainable codebases, and
              solutions that fit real operational workflows rather than abstract patterns.
            </p>
            <p className="mt-4 text-muted-foreground">
              The same engineering discipline that shapes our commercial products informs the training
              programmes we deliver, ensuring students learn practices that hold up in production.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-4xl glass edge-light p-8 sm:p-10">
              <div aria-hidden className="absolute inset-x-0 -top-20 h-40 bg-primary/10 blur-3xl" />
              <div className="relative">
                <LogoMark className="h-16 w-auto" alt="" />
                <p className="mt-6 font-display text-2xl font-semibold leading-snug">
                  Software built to last. Skills taught to apply.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  One engineering standard across products and education.
                </p>
                <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-2xl glass-subtle px-4 py-3">
                    <Code2 size={16} className="shrink-0 text-primary-text" aria-hidden />
                    Business Applications
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl glass-subtle px-4 py-3">
                    <GraduationCap size={16} className="shrink-0 text-primary-text" aria-hidden />
                    Technical Training
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHead
          eyebrow="Technical credits"
          title="Senior Developer"
          text="The following individual has made significant technical contributions to Eyercall's software products."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 justify-items-center">
          <Reveal>
            <article className="h-full max-w-xs rounded-3xl glass edge-light card-hover p-7 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary-text">
                {initials("Muhammad Umer Farooq")}
              </div>
              <h3 className="mt-5 text-lg font-semibold">Muhammad Umer Farooq</h3>
              <p className="text-sm text-primary-text">Senior Developer</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Senior Developer at Eyercall, contributing to the development and technical advancement
                of its software products including EyerREMS, EyerFlow, and EyerStock.
              </p>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHead
          eyebrow="Our products"
          title="Software Shaped by Engineering Discipline"
          text="Each Eyercall product reflects the same technical standards: clear architecture, practical workflows, and maintainable code."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <Reveal>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">EyerREMS</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Real estate management system for property listings, clients, transactions and
                commissions — built for agencies that need clarity over complexity.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/software/eyerrems/demo">View EyerREMS <ArrowRight /></Link>
              </Button>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">EyerFlow</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Warehouse and operations management — inventory, orders, purchasing, sales, finance
                and reporting in one integrated platform.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/software/eyerflow/demo">View EyerFlow <ArrowRight /></Link>
              </Button>
            </article>
          </Reveal>
          <Reveal delay={200}>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">EyerStock</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Inventory and stock control for trading businesses — purchases, sales, parties,
                products, finance and reporting.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/software/eyerstock/demo">View EyerStock <ArrowRight /></Link>
              </Button>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHead
          eyebrow="Company context"
          title="Engineering Within Eyercall"
          text="Technical credits exist within the broader company structure. For the full organisational picture, visit our About page."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl glass edge-light card-hover p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Founder & CEO</h2>
              <p className="mt-3 text-muted-foreground">
                Muhammad Asad is the Founder, Owner and CEO of Eyercall, setting the company's
                strategic direction and overseeing both software and education divisions.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/about">Read About Eyercall <ArrowRight /></Link>
              </Button>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl glass-strong edge-light card-hover p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <GraduationCap size={22} aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Technical & Educational Standards</h2>
              <p className="mt-3 text-muted-foreground">
                Our software engineering practices and training curricula are aligned — what we
                build professionally, we teach practically. Both sides uphold the same standard.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/courses">Explore Courses <ArrowRight /></Link>
              </Button>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[2.5rem] glass edge-light p-8 sm:p-12 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="eyebrow">Connect with us</p>
              <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Connect With Eyercall</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                {hasSocialLinks
                  ? "Follow our work, ask a question about a product, or talk to us about training for yourself or your team."
                  : "Ask a question about a product, or talk to us about training for yourself or your team."}
              </p>
              <SocialLinks className="mt-6" />
              {hasContactChannels && (
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
                  {contactChannels.email && (
                    <li>
                      <a
                        href={`mailto:${contactChannels.email}`}
                        className="flex items-center gap-2 transition-colors hover:text-foreground"
                      >
                        <Mail size={16} className="text-primary-text" aria-hidden />
                        {contactChannels.email}
                      </a>
                    </li>
                  )}
                  {contactChannels.phone && (
                    <li>
                      <a
                        href={telHref(contactChannels.phone)}
                        className="flex items-center gap-2 transition-colors hover:text-foreground"
                      >
                        <Phone size={16} className="text-primary-text" aria-hidden />
                        {contactChannels.phone}
                      </a>
                    </li>
                  )}
                  {contactChannels.whatsapp && (
                    <li>
                      <a
                        href={whatsappHref(contactChannels.whatsapp)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 transition-colors hover:text-foreground"
                      >
                        <MessageCircle size={16} className="text-primary-text" aria-hidden />
                        WhatsApp
                      </a>
                    </li>
                  )}
                  {contactChannels.address && (
                    <li className="flex items-center gap-2">
                      <MapPin size={16} className="text-primary-text" aria-hidden />
                      {contactChannels.address}
                    </li>
                  )}
                </ul>
              )}
            </div>
            <div className="flex lg:justify-end">
              <Button asChild variant="glow" size="lg">
                <Link to="/contact">
                  Contact Eyercall <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <CTASection
        eyebrow="Work with Eyercall"
        title="Build With Us or Learn With Us."
        text="Explore our software and services, browse the course catalogue, or tell us what you need."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/services">
                Explore Services <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/courses">Browse Courses</Link>
            </Button>
          </>
        }
      />
    </>
  );
}