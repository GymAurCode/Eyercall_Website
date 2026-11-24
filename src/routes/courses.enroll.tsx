import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/courses/enroll")({
  validateSearch: (search: Record<string, unknown>) => ({
    course: (search as { course?: string })["course"],
  }),
  component: EnrollPage,
});

function EnrollPage() {
  const search = Route.useSearch();
  const course = (search as { course?: string })["course"];
  const embedUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScsdPz8FH6dc0_Tv2E9-yB6_rimBolENuVtIcy5sfNnCSkZ6Q/viewform?embedded=true";
  const formUrl =
    "https://docs.google.com/forms/d/e/1FAIpQLScsdPz8FH6dc0_Tv2E9-yB6_rimBolENuVtIcy5sfNnCSkZ6Q/viewform";

  return (
    <div className="page-shell py-20">
      <div className="mx-auto max-w-3xl">
        <Button asChild variant="ghost" className="mb-8" size="sm">
          <Link to="/courses">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Courses
          </Link>
        </Button>

        <div className="text-center">
          <h1 className="text-4xl font-semibold leading-[1.05] sm:text-5xl text-foreground">
            Enroll at Eyercall Institute
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">
            Complete the enrollment form below to begin your learning journey with Eyercall
            Institute.
            {course && (
              <span className="block mt-2 font-medium text-primary">Applying for: {course}</span>
            )}
          </p>
        </div>

        <div className="mt-12 overflow-hidden rounded-2xl glass p-1">
          <iframe
            src={embedUrl}
            width="100%"
            height="1200px"
            frameBorder="0"
            title="Course Enrollment Form"
          >
            Loading…
          </iframe>
        </div>

        <div className="mt-8 text-center">
          <Button asChild variant="outline" size="sm">
            <a href={formUrl} target="_blank" rel="noopener noreferrer">
              Open Form in New Tab <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
