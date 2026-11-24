import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import {
  ArrowRight,
  Boxes,
  ChevronDown,
  Code2,
  GraduationCap,
  MonitorSmartphone,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHead, Process } from "@/components/site/Section";
import { Reveal } from "@/components/site/Reveal";
import { HeroModel } from "@/components/site/HeroModel";
import { SocialLinks } from "@/components/site/SocialLinks";
import { CTASection } from "@/components/site/CTASection";
import { contactChannels, hasSocialLinks, telHref } from "@/lib/site";
import { serviceList, type ServiceIcon } from "@/lib/services";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Eyercall — Software Solutions & IT Training" },
      {
        name: "description",
        content:
          "Eyercall builds business software and delivers practical IT training — from management systems and web applications to cybersecurity, web development and design courses.",
      },
      { property: "og:title", content: "Eyercall — Software Solutions & IT Training" },
      {
        property: "og:description",
        content:
          "Software development, digital solutions and practical IT training for businesses and aspiring professionals.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  custom: Code2,
  web: MonitorSmartphone,
  mobile: Smartphone,
  business: Boxes,
  training: GraduationCap,
};

type OrbitSlot = "software" | "services" | "courses" | "innovation";

/**
 * Left / right / left / right down the stage. Software starts inboard of the
 * top-left corner, Services steps out towards the right rail, Courses hugs the
 * left rail below the model's widest point, Innovation closes the run low-right.
 */
const orbitLabels: { label: string; slot: OrbitSlot }[] = [
  { label: "Software", slot: "software" },
  { label: "Services", slot: "services" },
  { label: "Courses", slot: "courses" },
  { label: "Innovation", slot: "innovation" },
];

/** Left pills slide in from their rail, right pills from theirs, with a small lift. */
const badgeEnter: Record<OrbitSlot, { x: number; y: number }> = {
  software: { x: -18, y: -6 },
  services: { x: 18, y: 4 },
  courses: { x: -18, y: 6 },
  innovation: { x: 18, y: 4 },
};

/** Drift per badge — different amplitudes and periods so they never bob in lockstep. */
const badgeDrift: Record<OrbitSlot, { y: number; duration: number }> = {
  software: { y: -5.5, duration: 3.4 },
  services: { y: 5, duration: 2.8 },
  courses: { y: 6, duration: 3.7 },
  innovation: { y: -4.5, duration: 3.1 },
};

/** The hero copy lands around 1.4s, so the badges arrive just after it. */
const ENTER_DELAY = 1.25;
const ENTER_DURATION = 0.7;
const ENTER_STAGGER = 0.15;

function HeroVisual() {
  const rootRef = useRef<HTMLDivElement>(null);
  const floatRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let context: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      // The slot owns the centring translate and the badge owns the CSS hover
      // transform, so GSAP only ever writes transforms on this middle layer.
      context = gsap.context(() => {
        orbitLabels.forEach(({ slot }, i) => {
          const el = floatRefs.current[i];
          if (!el) return;
          const from = badgeEnter[slot];
          const drift = badgeDrift[slot];
          const delay = ENTER_DELAY + i * ENTER_STAGGER;

          gsap.fromTo(
            el,
            { autoAlpha: 0, x: from.x, y: from.y },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: ENTER_DURATION,
              ease: "power3.out",
              delay,
            },
          );

          gsap.to(el, {
            y: drift.y,
            duration: drift.duration,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: delay + ENTER_DURATION,
          });
        });
      }, root);
    })();

    return () => {
      cancelled = true;
      context?.revert();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="hero-orbit relative mx-auto aspect-square w-full max-w-[520px]"
      aria-hidden
    >
      <HeroModel className="absolute inset-0" />
      {orbitLabels.map(({ label, slot }, i) => (
        <span key={label} data-slot={slot} className="hero-orbit-slot">
          <span
            ref={(el) => {
              floatRefs.current[i] = el;
            }}
            className="hero-orbit-float"
          >
            <span className="hero-orbit-badge">{label}</span>
          </span>
        </span>
      ))}
    </div>
  );
}

function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const on = () => {
      if (heroRef.current)
        heroRef.current.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    };
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  const lines = ["Building Digital Solutions.", "Empowering Future Innovators."];

  return (
    <>
      <section className="relative flex min-h-[100svh] items-center pt-28">
        <div
          ref={heroRef}
          className="page-shell grid items-center gap-12 lg:grid-cols-[11fr_9fr] lg:gap-10 xl:gap-14"
        >
          <div>
            <p className="eyebrow line-rise" style={{ animationDelay: "200ms" }}>
              Software development · IT training
            </p>
            <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.02] sm:text-6xl">
              {lines.map((l, i) => (
                <span
                  key={l}
                  className="line-rise"
                  style={{ animationDelay: `${350 + i * 150}ms` }}
                >
                  {i === 1 ? <span className="text-muted-foreground">{l}</span> : l}
                </span>
              ))}
            </h1>
            <p
              className="line-rise mt-6 max-w-lg text-lg text-muted-foreground"
              style={{ animationDelay: "700ms" }}
            >
              Eyercall brings together software development, digital innovation, and practical IT
              education to help businesses and aspiring professionals grow.
            </p>
            <div
              className="line-rise mt-9 flex flex-wrap gap-3"
              style={{ animationDelay: "850ms" }}
            >
              <Button asChild variant="glow" size="lg">
                <Link to="/about">
                  Explore Eyercall <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <Link to="/courses">Discover Our Courses</Link>
              </Button>
            </div>
            <p
              className="line-rise mt-8 flex items-center gap-2 text-xs text-muted-foreground"
              style={{ animationDelay: "1000ms" }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Serving businesses and
              learners.
            </p>
          </div>
          <div className="line-rise mb-16 lg:mb-0" style={{ animationDelay: "500ms" }}>
            <HeroVisual />
          </div>
        </div>
        <a
          href="#who-we-are"
          aria-label="Scroll to who we are"
          className="absolute bottom-8 left-1/2 hidden h-10 w-10 -translate-x-1/2 place-items-center rounded-full glass text-muted-foreground animate-float lg:grid"
        >
          <ChevronDown size={18} />
        </a>
      </section>

      <section id="who-we-are" className="page-shell scroll-mt-24 py-24">
        <Reveal className="mx-auto flex max-w-[840px] flex-col items-center text-center">
          <p className="eyebrow">About Eyercall</p>
          <h2 className="mt-4 text-4xl font-semibold leading-[1.05] sm:text-5xl">Who We Are</h2>
          <div className="mx-auto mt-8 max-w-[800px] space-y-5 text-pretty">
            <p className="text-lg leading-relaxed sm:text-xl">
              Eyercall is a technology company working across two connected areas: software
              development and IT education.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              We build business systems, web and mobile applications, and the digital tools
              organizations use every day. Alongside our software work, we deliver practical
              training in cybersecurity, web development, design, video and essential IT skills.
            </p>
            <p className="leading-relaxed text-muted-foreground">
              Both sides of our work follow the same approach: understand the problem, build
              something practical, and keep improving it.
            </p>
          </div>
          <Button asChild variant="glass" size="lg" className="mt-10">
            <Link to="/about">
              Learn More About Us <ArrowRight />
            </Link>
          </Button>
        </Reveal>
      </section>

      <section className="page-shell py-24">
        <SectionHead
          eyebrow="What we do"
          title="Software and Training, Connected"
          text="Two divisions, one standard: practical work that holds up in real use."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">Software & Digital Solutions</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Business software, custom systems, and web and mobile applications built around how
                your organization actually works — from records and workflows to reporting.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/software">
                  Explore Our Solutions <ArrowRight />
                </Link>
              </Button>
            </article>
          </Reveal>
          <Reveal delay={100}>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <GraduationCap size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">IT Training & Education</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Practical IT courses for individuals and teams — cybersecurity, web development,
                ITES, design, video editing and essential computer skills, taught through hands-on
                work.
              </p>
              <Button asChild variant="glass" size="lg" className="mt-8 self-start">
                <Link to="/courses">
                  Explore Our Courses <ArrowRight />
                </Link>
              </Button>
            </article>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-24">
        <SectionHead
          eyebrow="Services"
          title="Where We Can Help"
          text="From a single application to an ongoing training programme, our services are built around the outcome you need."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {serviceList.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            return (
              <Reveal
                key={service.slug}
                delay={(index % 2) * 80}
                className={index === serviceList.length - 1 ? "md:col-span-2" : ""}
              >
                <article className="flex h-full flex-col rounded-3xl glass edge-light card-hover p-7">
                  <div className="flex items-start gap-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                      <Icon size={20} aria-hidden />
                    </span>
                    <div>
                      <h3 className="text-lg font-semibold">{service.title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{service.summary}</p>
                    </div>
                  </div>
                  <Link
                    to="/services"
                    hash={service.slug}
                    className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text transition-colors hover:text-primary-hover"
                  >
                    Learn more
                    <ArrowRight size={14} aria-hidden />
                  </Link>
                </article>
              </Reveal>
            );
          })}
        </div>
        <div className="mt-10 text-center">
          <Button asChild variant="glass" size="lg">
            <Link to="/services">
              View All Services <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>

      <section className="page-shell py-14">
        <SectionHead eyebrow="Our approach" title="How We Work" />
        <Process />
      </section>

      {(hasSocialLinks ||
        contactChannels.email ||
        contactChannels.phone ||
        contactChannels.whatsapp) && (
        <section className="page-shell py-14">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2.5rem] glass edge-light px-6 py-10 sm:px-14">
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-semibold sm:text-5xl">Stay Connected With Eyercall</h2>
                <p className="mt-4 text-muted-foreground">
                  {hasSocialLinks
                    ? "Follow Eyercall for software updates, company news, technology articles and course announcements."
                    : "Reach the Eyercall team directly for software and training enquiries."}
                </p>
                <SocialLinks className="mt-7 justify-center" />
                {!hasSocialLinks &&
                  (contactChannels.email || contactChannels.phone || contactChannels.whatsapp) && (
                    <p className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      {contactChannels.email && (
                        <a
                          href={`mailto:${contactChannels.email}`}
                          className="transition-colors hover:text-primary-text"
                        >
                          {contactChannels.email}
                        </a>
                      )}
                      {contactChannels.phone && (
                        <a
                          href={telHref(contactChannels.phone)}
                          className="transition-colors hover:text-primary-text"
                        >
                          {contactChannels.phone}
                        </a>
                      )}
                    </p>
                  )}
              </div>
            </div>
          </Reveal>
        </section>
      )}

      <CTASection
        eyebrow="Start a conversation"
        title="Let's Build Something Meaningful Together."
        text="Whether you need a software system for your business or practical training for you and your team, tell us what you're working towards."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact">
                Contact Eyercall <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/courses">Explore Courses</Link>
            </Button>
          </>
        }
      />
    </>
  );
}
