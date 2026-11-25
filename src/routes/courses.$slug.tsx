import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Check, GraduationCap, ListChecks, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CourseIconBadge } from "@/components/site/CourseIcon";
import { CTASection } from "@/components/site/CTASection";
import { Reveal } from "@/components/site/Reveal";
import { courses, courseList, type CourseSlug } from "@/lib/courses";

export const Route = createFileRoute("/courses/$slug")({
  loader: ({ params }) => {
    const course = courses[params.slug as CourseSlug];
    if (!course) throw notFound();
    return { slug: course.slug };
  },
  head: ({ loaderData }) => {
    const course = loaderData && courses[loaderData.slug];
    if (!course)
      return {
        meta: [{ title: "Course not found | Eyercall" }, { name: "robots", content: "noindex" }],
      };
    const title = course.name.endsWith("Course")
      ? `${course.name} | Eyercall`
      : `${course.name} Course | Eyercall`;
    const canonicalUrl = `https://www.eyercall.com/courses/${course.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: course.description },
        { property: "og:title", content: title },
        { property: "og:description", content: course.description },
        { property: "og:type", content: "article" },
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
            "@type": "Course",
            name: course.name,
            description: course.description,
            provider: {
              "@type": "Organization",
              name: "Eyercall",
              url: "https://www.eyercall.com"
            },
            url: canonicalUrl,
            hasCourseInstance: {
              "@type": "CourseInstance",
              courseMode: "Online",
              courseWorkload: "Self-paced",
              instructor: {
                "@type": "Person",
                name: "Eyercall Training Team",
                url: "https://www.eyercall.com/about"
              }
            },
            teaches: course.objectives.join(", "),
            educationalCredentialAwarded: "Certificate of Completion"
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
                name: "Courses",
                item: "https://www.eyercall.com/courses/"
              },
              {
                "@type": "ListItem",
                position: 3,
                name: course.name,
                item: canonicalUrl
              }
            ]
          }),
        },
      ],
    };
  },
  component: CoursePage,
});

function CoursePage() {
  const { slug } = Route.useLoaderData();
  const course = courses[slug];
  const others = courseList.filter((item) => item.slug !== course.slug);

  return (
    <>
      <section className="page-shell pb-16 pt-40">
        <div className="grid items-start gap-12 lg:grid-cols-[1.15fr_1fr]">
          <div>
            <div className="line-rise flex items-center gap-4">
              <CourseIconBadge icon={course.icon} />
              <p className="eyebrow">{course.category}</p>
            </div>
            <h1
              className="line-rise mt-6 text-5xl font-semibold leading-[1.02] sm:text-6xl"
              style={{ animationDelay: "120ms" }}
            >
              {course.name}
            </h1>
            <p
              className="line-rise mt-4 text-2xl text-muted-foreground"
              style={{ animationDelay: "240ms" }}
            >
              {course.tagline}
            </p>
            <p
              className="line-rise mt-6 max-w-xl text-muted-foreground"
              style={{ animationDelay: "360ms" }}
            >
              {course.description}
            </p>
            <div
              className="line-rise mt-8 flex flex-wrap gap-3"
              style={{ animationDelay: "480ms" }}
            >
              <Button asChild variant="glow" size="lg">
                <Link to="/courses/enroll" search={{ course: course.name }}>
                  Enroll Now <ArrowRight />
                </Link>
              </Button>
              <Button asChild variant="glass" size="lg">
                <a href="#topics">See topics</a>
              </Button>
            </div>
          </div>
          <div className="line-rise" style={{ animationDelay: "300ms" }}>
            <div className="rounded-4xl glass edge-light p-8">
              <p className="text-sm text-muted-foreground">Course overview</p>
              <p className="mt-3">{course.overview}</p>
              <dl className="mt-6 space-y-4 border-t border-glass-border pt-6 text-sm">
                <div className="flex gap-3">
                  <dt className="flex w-28 shrink-0 items-center gap-2 text-muted-foreground">
                    <Users size={15} className="text-primary-text" aria-hidden />
                    Who it's for
                  </dt>
                  <dd>{course.audience}</dd>
                </div>
                <div className="flex gap-3">
                  <dt className="flex w-28 shrink-0 items-center gap-2 text-muted-foreground">
                    <GraduationCap size={15} className="text-primary-text" aria-hidden />
                    Prerequisites
                  </dt>
                  <dd>{course.prerequisites}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      <section className="page-shell py-16" aria-labelledby="objectives-heading">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <p className="eyebrow">Objectives</p>
            <h2 id="objectives-heading" className="mt-3 text-4xl font-semibold sm:text-5xl">
              What You'll Learn
            </h2>
            <p className="mt-4 text-muted-foreground">
              By the end of the course, learners should be able to apply the following in practice.
            </p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2">
            {course.objectives.map((objective, index) => (
              <Reveal key={objective} delay={(index % 2) * 80}>
                <div className="flex h-full gap-3 rounded-3xl glass-subtle p-5">
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-primary-text" aria-hidden />
                  <p className="text-sm">{objective}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="topics" className="page-shell scroll-mt-24 py-16">
        <Reveal>
          <p className="eyebrow">Curriculum</p>
          <h2 className="mt-3 text-4xl font-semibold sm:text-5xl">Topics Covered</h2>
        </Reveal>
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {course.topics.map((topic, index) => (
            <Reveal as="li" key={topic} delay={(index % 3) * 80}>
              <div className="flex h-full items-start gap-4 rounded-3xl glass edge-light card-hover p-6">
                <span className="font-display text-lg text-primary-text">0{index + 1}</span>
                <p className="text-sm">{topic}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="page-shell py-16">
        <Reveal>
          <div className="grid items-center gap-8 rounded-[2.5rem] glass-strong edge-light p-8 sm:p-12 lg:grid-cols-[1.3fr_1fr]">
            <div>
              <p className="flex items-center gap-2 text-sm font-medium text-primary-text">
                <BookOpen size={16} aria-hidden />
                Enrolment
              </p>
              <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
                Ready to Enrol or Have a Question?
              </h2>
              <p className="mt-4 max-w-xl text-muted-foreground">
                Send an enquiry about the {course.name} course and tell us what you're aiming for.
                We'll reply with the information you need and help you decide whether it fits.
              </p>
              <ul className="mt-5 space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <ListChecks size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                  Ask about the course content and requirements
                </li>
                <li className="flex gap-2">
                  <ListChecks size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                  Discuss enrolment for yourself or your team
                </li>
              </ul>
            </div>
            <div className="flex lg:justify-end">
              <Button asChild variant="glow" size="lg">
                <Link to="/courses/enroll" search={{ course: course.name }}>
                  Enroll Now <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="page-shell py-16" aria-labelledby="other-courses">
        <Reveal>
          <h2 id="other-courses" className="mb-8 text-3xl font-semibold">
            Other Courses
          </h2>
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {others.map((other, index) => (
            <Reveal key={other.slug} delay={(index % 3) * 60}>
              <Link
                to="/courses/$slug"
                params={{ slug: other.slug }}
                className="group flex h-full flex-col justify-between rounded-3xl glass card-hover p-6 hover:-translate-y-1"
              >
                <div>
                  <p className="eyebrow">{other.category}</p>
                  <h3 className="mt-2 text-lg font-semibold transition-colors group-hover:text-primary-text">
                    {other.name}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{other.tagline}</p>
                </div>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text">
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
        eyebrow="Training with Eyercall"
        title="Learn Skills You Can Use."
        text="Browse the full course catalogue or talk to us about training for yourself or your team."
        actions={
          <>
            <Button asChild variant="glow" size="lg">
              <Link to="/courses">All Courses</Link>
            </Button>
            <Button asChild variant="glass" size="lg">
              <Link to="/contact" search={{ inquiry: "courses" }}>
                Contact Us <ArrowRight />
              </Link>
            </Button>
          </>
        }
      />
    </>
  );
}
