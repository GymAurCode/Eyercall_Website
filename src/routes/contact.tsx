import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import {
  ArrowRight,
  Code2,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  MessagesSquare,
  Phone,
} from "lucide-react";
import { ContactForm } from "@/components/site/ContactForm";
import { SocialLinks } from "@/components/site/SocialLinks";
import { company, contactChannels, hasSocialLinks, telHref, whatsappHref } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  validateSearch: z.object({
    inquiry: z.enum(["general", "software", "courses"]).optional(),
  }),
  head: () => ({
    meta: [
      { title: "Contact Eyercall" },
      {
        name: "description",
        content:
          "Contact Eyercall about software, custom development, or IT training for yourself or your team.",
      },
      { property: "og:title", content: "Contact Eyercall" },
      {
        property: "og:description",
        content:
          "Ask about our software, discuss a project, or enquire about a course. We'll follow up with the next step.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

const inquiryCards = [
  {
    icon: Code2,
    title: "Software & Services",
    text: "Ask about a product, request a demo, or discuss custom development.",
    to: "/software",
  },
  {
    icon: GraduationCap,
    title: "Course Information",
    text: "Ask about course content, requirements, or enrolment.",
    to: "/courses",
  },
] as const;

function Contact() {
  const { inquiry } = Route.useSearch();

  return (
    <section className="page-shell pb-20 pt-40">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="eyebrow line-rise">Contact Eyercall</p>
          <h1
            className="line-rise mt-4 text-5xl font-semibold leading-[1.02] text-balance sm:text-6xl"
            style={{ animationDelay: "120ms" }}
          >
            Let's Talk About What You Need.
          </h1>
          <p
            className="line-rise mt-6 max-w-lg text-muted-foreground"
            style={{ animationDelay: "240ms" }}
          >
            Whether you're evaluating software for your business, planning a project, or looking at
            a course for yourself or your team, send a message and we'll follow up with the next
            step.
          </p>

          <ul className="line-rise mt-9 space-y-3" style={{ animationDelay: "360ms" }}>
            {inquiryCards.map((card) => {
              const Icon = card.icon;
              return (
                <li key={card.title}>
                  <Link
                    to={card.to}
                    className="group flex items-start gap-4 rounded-3xl glass-subtle p-5 transition-colors hover:border-teal-border-strong hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                      <Icon size={18} aria-hidden />
                    </span>
                    <span className="flex-1">
                      <span className="flex items-center gap-2 font-medium">
                        {card.title}
                        <ArrowRight
                          size={14}
                          aria-hidden
                          className="text-primary-text transition-transform group-hover:translate-x-0.5"
                        />
                      </span>
                      <span className="mt-1 block text-sm text-muted-foreground">{card.text}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
            <li className="flex items-start gap-4 rounded-3xl glass-subtle p-5">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                <MessagesSquare size={18} aria-hidden />
              </span>
              <span className="flex-1">
                <span className="block font-medium">General Inquiry</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  Anything else — a question about Eyercall or how we work.
                </span>
              </span>
            </li>
          </ul>

          {(contactChannels.email ||
            contactChannels.phone ||
            contactChannels.whatsapp ||
            contactChannels.address) && (
            <div className="line-rise mt-8" style={{ animationDelay: "480ms" }}>
              <p className="eyebrow">Direct contact</p>
              <ul className="mt-3 space-y-2.5 text-sm">
                {contactChannels.email && (
                  <li>
                    <a
                      href={`mailto:${contactChannels.email}`}
                      className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
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
                      className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
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
                      className="flex items-center gap-2.5 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <MessageCircle size={16} className="text-primary-text" aria-hidden />
                      WhatsApp
                    </a>
                  </li>
                )}
                {contactChannels.address && (
                  <li className="flex items-start gap-2.5 text-muted-foreground">
                    <MapPin size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                    {contactChannels.address}
                  </li>
                )}
              </ul>
            </div>
          )}

          {hasSocialLinks && (
            <div className="mt-8">
              <p className="eyebrow">Follow Eyercall</p>
              <SocialLinks className="mt-3" />
            </div>
          )}

          <p className="mt-8 text-xs text-muted-foreground">
            {company.name} · {company.tagline}
          </p>
        </div>

        <div
          id="contact-form"
          className="line-rise scroll-mt-24"
          style={{ animationDelay: "300ms" }}
        >
          <ContactForm defaultInquiry={inquiry ?? "general"} />
        </div>
      </div>
    </section>
  );
}
