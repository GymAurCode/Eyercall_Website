import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useLocation,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Nav } from "../components/site/Nav";
import { Footer } from "../components/site/Footer";
import { Splash } from "../components/site/Splash";
import { ScrollIndicator } from "../components/site/ScrollIndicator";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-(--shadow-cta) transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-(--shadow-cta) transition-colors hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-teal-border px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-teal-border-strong hover:bg-primary-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Eyercall — Software Solutions & IT Training" },
      {
        name: "description",
        content:
          "Eyercall builds business software and delivers practical IT training for individuals and organizations.",
      },
      { name: "application-name", content: "Eyercall" },
      { name: "apple-mobile-web-app-title", content: "Eyercall" },
      { property: "og:title", content: "Eyercall — Software Solutions & IT Training" },
      {
        property: "og:description",
        content:
          "Software development, digital solutions and practical IT training for businesses and aspiring professionals.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Eyercall" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:image:type", content: "image/png" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Eyercall" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", sizes: "16x16 32x32 48x48" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png" },
      { rel: "icon", type: "image/png", sizes: "48x48", href: "/favicon-48x48.png" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css",
      },
      { rel: "canonical", href: "https://www.eyercall.com/" },
      {
        rel: "alternate",
        type: "application/ld+json",
        href: "/robots.txt",
      },
    ],
    script: [
      {
        type: "application/ld+json",
        content: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Eyercall",
          url: "https://www.eyercall.com",
          description: "Software development and IT training company.",
          potentialAction: {
            "@type": "SearchAction",
            target: "https://www.eyercall.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script
          dangerouslySetInnerHTML={{
            __html: [
              "try{document.documentElement.dataset.reveal='on'}catch(e){};",
              "try{var r=document.documentElement,s=null;try{s=localStorage.getItem('eyercall-theme')}catch(e){}",
              "var d=s?s==='dark':matchMedia('(prefers-color-scheme: dark)').matches;",
              "r.classList.toggle('dark',d);r.style.colorScheme=d?'dark':'light'}catch(e){};",
              "try{if(sessionStorage.getItem('eyercall-splash')||matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.splashed='1'}catch(e){};",
            ].join(""),
          }}
        />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const demo = /^\/software\/(eyerrems|eyerstock|eyerflow)\/demo(?:\/|$)/.test(useLocation().pathname);

  if (demo) return <QueryClientProvider client={queryClient}><Outlet /></QueryClientProvider>;

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <div className="atmosphere" aria-hidden>
        <div className="orb left-[-10%] top-[-10%] h-[40rem] w-[40rem] bg-primary/[0.05] dark:bg-primary/[0.1]" />
        <div
          className="orb right-[-10%] top-[20%] h-[36rem] w-[36rem] bg-primary/[0.03] dark:bg-primary/[0.07]"
          style={{ animationDelay: "-8s" }}
        />
      </div>
      <Splash />
      <ScrollIndicator />
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </QueryClientProvider>
  );
}
