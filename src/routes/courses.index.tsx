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
