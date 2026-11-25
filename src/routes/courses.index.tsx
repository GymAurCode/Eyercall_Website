import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  TrendingUp,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseStack } from "@/components/site/CourseStack";
import { CTASection } from "@/components/site/CTASection";
import { PageHero } from "@/components/site/PageHero";
import { Reveal } from "@/components/site/Reveal";
import { courseList } from "@/lib/courses";

export const Route = createFileRoute("/courses/")({
  head: () => ({
    meta: [
      { title: "IT Courses at Eyercall" },
      {
        name: "description",
        content:
          "Practical IT training at Eyercall: cyber security, web development, ITES, graphic design, video editing and essential computer skills.",
      },
      { property: "og:title", content: "IT Courses at Eyercall" },
      {
        property: "og:description",
        content:
          "Hands-on IT courses for individuals, teams and institutes — from digital foundations to cybersecurity and web development.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "canonical", href: "https://www.eyercall.com/courses/" },
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
          name: "Eyercall IT Courses",
          description: "Practical IT training courses offered by Eyercall",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              item: {
                "@type": "Course",
                name: "Cyber Security Fundamentals",
                description: "Essential cybersecurity concepts, threat awareness, and defensive practices for individuals and teams.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/cyber-security"
              }
            },
            {
              "@type": "ListItem",
              position: 2,
              item: {
                "@type": "Course",
                name: "Web Development",
                description: "Modern web development from HTML/CSS fundamentals to full-stack applications with React and Node.js.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/web-development"
              }
            },
            {
              "@type": "ListItem",
              position: 3,
              item: {
                "@type": "Course",
                name: "ITES & BPO Fundamentals",
                description: "Industry-standard skills for IT-enabled services and business process outsourcing roles.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/ites-bpo"
              }
            },
            {
              "@type": "ListItem",
              position: 4,
              item: {
                "@type": "Course",
                name: "Graphic Design",
                description: "Design principles, typography, branding and practical projects using industry tools.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/graphic-design"
              }
            },
            {
              "@type": "ListItem",
              position: 5,
              item: {
                "@type": "Course",
                name: "Video Editing",
                description: "Video editing fundamentals, storytelling techniques and professional post-production workflows.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/video-editing"
              }
            },
            {
              "@type": "ListItem",
              position: 6,
              item: {
                "@type": "Course",
                name: "Essential Computer Skills",
                description: "Core computer literacy, productivity software and digital confidence for work and study.",
                provider: {
                  "@type": "Organization",
                  name: "Eyercall",
                  url: "https://www.eyercall.com"
                },
                url: "https://www.eyercall.com/courses/essential-computer-skills"
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
              name: "Courses",
              item: "https://www.eyercall.com/courses/"
            }
          ]
        }),
      },
    ],
  }),
  component: CoursesPage,
});

const approach: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: BookOpen,
    title: "Learn the fundamentals",
    body: "Each course begins with the core concepts of its subject, explained in plain language and tied to real tasks.",
  },
  {
    icon: Wrench,
    title: "Apply it in practice",
    body: "Exercises and project-style work turn those concepts into skills you can use, not just recall.",
  },
  {
    icon: TrendingUp,
    title: "Build technical confidence",
    body: "Repeated practice builds the independence to handle similar work in study, on a team or in a new role.",
  },
];

function CoursesPage() {
  return (
    <>
      <PageHero
        eyebrow="Courses"
        title="Learn Skills. Build Your Future."
        text="Explore practical IT courses designed to develop technical knowledge and real-world skills."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact" search={{ inquiry: "courses" }}>
                Enquire About a Course <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/services" hash="training">
                Training Services
              </Link>
            </Button>
          </>
        }
      />

      <section aria-labelledby="courses-heading" className="page-shell py-10">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Course catalogue</p>
          <h2
            id="courses-heading"
            className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl"
          >
            Explore Our Courses
          </h2>
          <p className="mt-5 text-muted-foreground">
            Six practical courses, one standard of teaching. Scroll through each course, then open
            it for the full objectives and topic list.
          </p>
        </Reveal>

        <CourseStack courses={courseList} />
      </section>

      <section aria-labelledby="approach-heading" className="page-shell py-10">
        <Reveal className="mx-auto mb-10 max-w-2xl text-center">
          <p className="eyebrow">Our approach</p>
          <h2
            id="approach-heading"
            className="mt-3 text-4xl font-semibold leading-[1.05] sm:text-5xl"
          >
            From Fundamentals to Confidence.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Eyercall's training follows a simple progression: understand the fundamentals, apply
            them in practice, and build the confidence to keep using the skills.
          </p>
        </Reveal>

        <div className="mx-auto grid max-w-[1400px] gap-5 md:grid-cols-3">
          {approach.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.title} delay={index * 90}>
                <div className="h-full rounded-3xl glass edge-light card-hover p-7 sm:p-8">
                  <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary-soft text-primary-text">
                    <Icon size={22} aria-hidden />
                  </span>
                  <p className="mt-6 font-display text-sm text-muted-foreground">0{index + 1}</p>
                  <h3 className="mt-1 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal>
          <p className="mx-auto mt-10 flex max-w-2xl flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground sm:flex-row">
            Training is delivered by Eyercall's training division.
            <Link
              to="/services"
              hash="training"
              className="inline-flex items-center gap-1 font-medium text-primary-text transition-colors hover:text-primary-hover"
            >
              See training services
              <ArrowUpRight size={14} aria-hidden />
            </Link>
          </p>
        </Reveal>
      </section>

      <CTASection
        eyebrow="Course enquiries"
        title="Ready to Start Learning?"
        text="Tell us what you want to learn or the role you're preparing for, and we'll help you choose the course that fits."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/contact" search={{ inquiry: "courses" }}>
                Contact for Course Information <ArrowRight />
              </Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/about">Explore Eyercall</Link>
            </Button>
          </>
        }
      />
    </>
  );
}
