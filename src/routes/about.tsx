import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Code2,
  Compass,
  GraduationCap,
  HeartHandshake,
  Lightbulb,
  Linkedin,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
  ShieldCheck,
  Target,
  type LucideIcon,
} from "lucide-react";
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
  leadership,
  telHref,
  whatsappHref,
} from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Eyercall" },
      {
        name: "description",
        content:
          "Learn about Eyercall: a software development company and IT training institute building practical digital solutions and technical skills.",
      },
      { property: "og:title", content: "About Eyercall" },
      {
        property: "og:description",
        content:
          "Software development and IT education under one roof — our story, mission, vision and values.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: "Quality and Reliability",
    body: "We build to a standard we would accept in our own operations, and we test before we hand over.",
    icon: BadgeCheck,
  },
  {
    title: "Continuous Learning",
    body: "Technology changes constantly, so our team and our courses keep pace with it.",
    icon: BookOpen,
  },
  {
    title: "Practical Innovation",
    body: "We favour useful improvements over novelty — changes that make daily work clearer.",
    icon: Lightbulb,
  },
  {
    title: "Professional Integrity",
    body: "We are direct about what we can deliver, what it takes and where the limits are.",
    icon: ShieldCheck,
  },
  {
    title: "Client-Focused Development",
    body: "Requirements come from the people who will use the result, not from assumptions.",
    icon: HeartHandshake,
  },
  {
    title: "Clear Communication",
    body: "Projects and courses run better when expectations, progress and next steps are explicit.",
    icon: MessagesSquare,
  },
];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
}

function About() {
  return (
    <>
      <PageHero
        eyebrow="About Eyercall"
        title="Technology, Innovation & Education."
        text="Eyercall is a software development company and an IT training institute. We build practical systems for organizations and help people develop the technical skills to use them well."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact">
                Contact Eyercall <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/courses">Explore Our Courses</Link>
            </Button>
          </>
        }
      />

      <section className="page-shell py-20">
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]">
          <Reveal>
            <p className="eyebrow">Our story</p>
            <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Why Eyercall Exists</h2>
            <p className="mt-6 text-lg">
              Eyercall started from a simple observation: businesses and professionals both need
              technology that fits the way they actually work.
            </p>
            <p className="mt-4 text-muted-foreground">
              That idea shaped our software practice, where we build management systems and
              applications around real operational workflows, and our training practice, where
              courses are structured around the tasks learners will meet in the workplace.
            </p>
            <p className="mt-4 text-muted-foreground">
              Today the two areas sit side by side. The same standard of clarity and practicality
              that goes into a product goes into a classroom.
            </p>
          </Reveal>
          <Reveal delay={120}>
            <div className="relative overflow-hidden rounded-4xl glass edge-light p-8 sm:p-10">
              <div aria-hidden className="absolute inset-x-0 -top-20 h-40 bg-primary/10 blur-3xl" />
              <div className="relative">
                <LogoMark className="h-16 w-auto" alt="" />
                <p className="mt-6 font-display text-2xl font-semibold leading-snug">
                  Software that solves real problems. Training that builds real skills.
                </p>
                <p className="mt-4 text-sm text-muted-foreground">
                  One principle that guides both divisions of Eyercall.
                </p>
                <div className="mt-8 grid gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2.5 rounded-2xl glass-subtle px-4 py-3">
                    <Code2 size={16} className="shrink-0 text-primary-text" aria-hidden />
                    Software Development
                  </div>
                  <div className="flex items-center gap-2.5 rounded-2xl glass-subtle px-4 py-3">
                    <GraduationCap size={16} className="shrink-0 text-primary-text" aria-hidden />
                    Education & Training
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="h-full rounded-3xl glass edge-light card-hover p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Target size={22} aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Our Mission</h2>
              <p className="mt-3 text-muted-foreground">
                To build practical software that improves how organizations operate, and to make
                technical education directly useful to the people who take part in it.
              </p>
            </div>
          </Reveal>
          <Reveal delay={100}>
            <div className="h-full rounded-3xl glass-strong edge-light card-hover p-8 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Compass size={22} aria-hidden />
              </span>
              <h2 className="mt-6 text-2xl font-semibold">Our Vision</h2>
              <p className="mt-3 text-muted-foreground">
                A future where businesses and professionals adopt technology with confidence,
                supported by systems and skills that keep pace with change.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="page-shell py-20">
        <SectionHead
          eyebrow="What we do"
          title="Two Divisions, One Standard"
          text="Eyercall works across software development and technical education. Each division is described in more detail on its own page."
        />
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <article className="flex h-full flex-col rounded-4xl glass edge-light card-hover p-8 hover:-translate-y-1 sm:p-10">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <Code2 size={22} aria-hidden />
              </span>
              <h3 className="mt-6 text-2xl font-semibold">Software Development</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                Business applications, custom management systems and digital solutions — including
                our own products for real estate, inventory and typing practice, alongside
                client-specific development.
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
              <h3 className="mt-6 text-2xl font-semibold">Education & Training</h3>
              <p className="mt-3 flex-1 text-muted-foreground">
                IT courses, practical technical education and skills development for individuals and
                teams — from foundational computer skills to cybersecurity, development and design.
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

      {leadership.length > 0 && (
        <section className="page-shell py-20">
          <SectionHead eyebrow="Leadership" title="Our Team & Leadership" />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {leadership.map((member) => (
              <Reveal key={member.name}>
                <article className="h-full rounded-3xl glass edge-light card-hover p-7">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-primary-soft font-display text-lg font-semibold text-primary-text">
                    {initials(member.name)}
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{member.name}</h3>
                  <p className="text-sm text-primary-text">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${member.name} on LinkedIn`}
                      className="mt-4 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary-text"
                    >
                      <Linkedin size={16} aria-hidden />
                      LinkedIn
                    </a>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <section className="page-shell py-20">
        <SectionHead
          eyebrow="Our values"
          title="How We Work With You"
          text="The principles behind our software projects and our training programmes."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.title} delay={(index % 3) * 80}>
                <div className="h-full rounded-3xl glass edge-light card-hover p-7">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                    <Icon size={20} aria-hidden />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{value.body}</p>
                </div>
              </Reveal>
            );
          })}
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
