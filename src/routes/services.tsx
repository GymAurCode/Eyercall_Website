import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Boxes,
  Code2,
  GraduationCap,
  MonitorSmartphone,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { SectionHead } from "@/components/site/Section";
import { serviceList, type ServiceIcon } from "@/lib/services";

export const Route = createFileRoute("/services")({
  head: () => {
    const canonicalUrl = "https://www.eyercall.com/services";
    return {
      meta: [
        { title: "Eyercall Technology Services" },
        {
          name: "description",
          content:
            "Software development, web and mobile applications, business systems and technical training — the services Eyercall provides for organizations and learners.",
        },
        { property: "og:title", content: "Eyercall Technology Services" },
        {
          property: "og:description",
          content:
            "Custom software, web and mobile development, business solutions and IT training from Eyercall.",
        },
        { property: "og:type", content: "website" },
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
            "@type": "ItemList",
            name: "Eyercall Services",
            description: "Technology services offered by Eyercall",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                item: {
                  "@type": "Service",
                  name: "Custom Software Development",
                  description: "Bespoke business systems, web and mobile applications built around how your organization actually works.",
                  provider: {
                    "@type": "Organization",
                    name: "Eyercall",
                    url: "https://www.eyercall.com"
                  },
                  url: "https://www.eyercall.com/services#custom-software",
                  serviceType: "Software Development",
                  areaServed: "Worldwide"
                }
              },
              {
                "@type": "ListItem",
                position: 2,
                item: {
                  "@type": "Service",
                  name: "Web Application Development",
                  description: "Modern web applications from progressive web apps to complex SaaS platforms.",
                  provider: {
                    "@type": "Organization",
                    name: "Eyercall",
                    url: "https://www.eyercall.com"
                  },
                  url: "https://www.eyercall.com/services#web",
                  serviceType: "Web Development",
                  areaServed: "Worldwide"
                }
              },
              {
                "@type": "ListItem",
                position: 3,
                item: {
                  "@type": "Service",
                  name: "Mobile Application Development",
                  description: "Native and cross-platform mobile apps for iOS and Android.",
                  provider: {
                    "@type": "Organization",
                    name: "Eyercall",
                    url: "https://www.eyercall.com"
                  },
                  url: "https://www.eyercall.com/services#mobile",
                  serviceType: "Mobile Development",
                  areaServed: "Worldwide"
                }
              },
              {
                "@type": "ListItem",
                position: 4,
                item: {
                  "@type": "Service",
                  name: "Business Systems & Operations",
                  description: "ERP, CRM, inventory, finance and operations management systems.",
                  provider: {
                    "@type": "Organization",
                    name: "Eyercall",
                    url: "https://www.eyercall.com"
                  },
                  url: "https://www.eyercall.com/services#business",
                  serviceType: "Business Software",
                  areaServed: "Worldwide"
                }
              },
              {
                "@type": "ListItem",
                position: 5,
                item: {
                  "@type": "Service",
                  name: "IT Training & Education",
                  description: "Practical IT courses for individuals and teams — cybersecurity, web development, ITES, design, video editing and essential computer skills.",
                  provider: {
                    "@type": "Organization",
                    name: "Eyercall",
                    url: "https://www.eyercall.com"
                  },
                  url: "https://www.eyercall.com/services#training",
                  serviceType: "Education & Training",
                  areaServed: "Worldwide"
                }
              }
            ]
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
                name: "Services",
                item: "https://www.eyercall.com/services"
              }
            ]
          }),
        },
      ],
    };
  },
  component: ServicesPage,
});

const serviceIcons: Record<ServiceIcon, LucideIcon> = {
  custom: Code2,
  web: MonitorSmartphone,
  mobile: Smartphone,
  business: Boxes,
  training: GraduationCap,
};

function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Technology Services, Built Around Your Business."
        text="From a single application to an ongoing training programme, Eyercall works on the problems organizations actually face: scattered records, manual processes and skills that need to keep pace with technology."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact" search={{ inquiry: "software" }}>
                Discuss Your Project <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/software">Explore Our Software</Link>
            </Button>
          </>
        }
      />

      <nav aria-label="Services on this page" className="page-shell pb-8">
        <ul className="flex flex-wrap gap-2">
          {serviceList.map((service) => (
            <li key={service.slug}>
              <a
                href={`#${service.slug}`}
                className="inline-flex rounded-full border border-teal-border px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-teal-border-strong hover:bg-primary-soft hover:text-primary-text"
              >
                {service.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <section aria-label="Eyercall services" className="page-shell py-12">
        <div className="space-y-6">
          {serviceList.map((service, index) => {
            const Icon = serviceIcons[service.icon];
            const isTraining = service.icon === "training";
            return (
              <Reveal key={service.slug}>
                <article
                  id={service.slug}
                  className="scroll-mt-24 rounded-4xl glass edge-light card-hover p-7 sm:p-10"
                >
                  <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
                    <div>
                      <div className="flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                          <Icon size={22} aria-hidden />
                        </span>
                        <span className="font-display text-sm text-muted-foreground">
                          0{index + 1}
                        </span>
                      </div>
                      <h2 className="mt-5 text-2xl font-semibold sm:text-3xl">{service.title}</h2>
                      <p className="mt-3 text-primary-text">{service.summary}</p>
                    </div>
                    <div>
                      <p className="max-w-2xl text-muted-foreground">{service.description}</p>
                      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
                        {service.capabilities.map((capability) => (
                          <li
                            key={capability}
                            className="flex items-start gap-2.5 rounded-2xl glass-subtle px-4 py-3 text-sm"
                          >
                            <span
                              aria-hidden
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary"
                            />
                            {capability}
                          </li>
                        ))}
                      </ul>
                      <div className="mt-7">
                        <Button asChild variant="glass" size="lg">
                          <Link
                            to="/contact"
                            search={{ inquiry: isTraining ? "courses" : "software" }}
                          >
                            {isTraining ? "Enquire About Training" : "Discuss This Service"}
                            <ArrowRight />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="page-shell py-16">
        <SectionHead
          eyebrow="Where to start"
          title="Tell Us What You Need"
          text="If you're unsure which service fits, describe the problem in plain terms. We'll tell you what we would build, what it involves and whether it is the right approach."
        />
        <div className="grid gap-5 md:grid-cols-2">
          <Reveal>
            <Link
              to="/software"
              className="group flex h-full flex-col justify-between rounded-3xl glass edge-light card-hover p-8 hover:-translate-y-1"
            >
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                  <Boxes size={20} aria-hidden />
                </span>
                <h2 className="mt-5 text-xl font-semibold">Eyercall Software</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Explore the management systems we build and maintain — EyerREMS, EyerFlow,
                  EyerStock and EyerType.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text">
                View software
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
          <Reveal delay={100}>
            <Link
              to="/courses"
              className="group flex h-full flex-col justify-between rounded-3xl glass edge-light card-hover p-8 hover:-translate-y-1"
            >
              <div>
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                  <GraduationCap size={20} aria-hidden />
                </span>
                <h2 className="mt-5 text-xl font-semibold">Eyercall Courses</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Browse practical IT courses, from computer fundamentals to cybersecurity, web
                  development, design and video editing.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text">
                View courses
                <ArrowRight
                  size={14}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          </Reveal>
        </div>
      </section>

      <CTASection
        eyebrow="Start a project"
        title="Let's Talk About What You Need."
        text="Tell us about your business, your team or your learning goals, and we'll suggest a practical next step."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact">
                Contact Eyercall <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/about">About Us</Link>
            </Button>
          </>
        }
      />
    </>
  );
}
