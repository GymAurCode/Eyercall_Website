export type ServiceIcon = "custom" | "web" | "mobile" | "business" | "training";

export interface Service {
  slug: string;
  title: string;
  summary: string;
  description: string;
  icon: ServiceIcon;
  capabilities: string[];
}

export const serviceList: Service[] = [
  {
    slug: "custom-software",
    title: "Custom Software Development",
    summary: "Software built around the way your business actually works.",
    description:
      "We design and build internal tools and management systems for specific operational needs — from record keeping and workflows to reporting — instead of forcing your team into a generic product.",
    icon: "custom",
    capabilities: [
      "Requirements analysis and workflow mapping",
      "Database design and application structure",
      "Dashboards, records and reporting",
      "Iterative delivery with review at each stage",
    ],
  },
  {
    slug: "web-development",
    title: "Web Application Development",
    summary: "Responsive websites and web applications that stay maintainable.",
    description:
      "From corporate websites to authenticated business applications, we build for clarity, performance and long-term maintenance using modern web technology.",
    icon: "web",
    capabilities: [
      "Marketing sites and company websites",
      "Customer portals and internal web tools",
      "Responsive, accessible interfaces",
      "Performance and SEO-conscious builds",
    ],
  },
  {
    slug: "mobile-apps",
    title: "Mobile Application Development",
    summary: "Mobile experiences connected to your existing systems.",
    description:
      "We build mobile applications for teams and customers who need access away from a desk, designed to work with the same data and workflows as your other systems.",
    icon: "mobile",
    capabilities: [
      "Business and field-work applications",
      "Mobile-friendly customer experiences",
      "Integration with existing backends",
      "Interface design for small screens",
    ],
  },
  {
    slug: "business-solutions",
    title: "Business Software Solutions",
    summary: "Ready systems for property, inventory and everyday operations.",
    description:
      "Eyercall develops its own management products — EyerREMS, EyerFlow, EyerStock and EyerType — and helps businesses adopt them to replace scattered spreadsheets and manual registers.",
    icon: "business",
    capabilities: [
      "Real estate and property management systems",
      "Inventory and stock operations",
      "Desktop and web-based business tools",
      "Setup guidance and team onboarding",
    ],
  },
  {
    slug: "training",
    title: "Technical Training & Education",
    summary: "Practical IT training for individuals, teams and institutes.",
    description:
      "Our training programmes cover cybersecurity, web development, design, video and essential IT skills, delivered with an emphasis on practice rather than theory alone.",
    icon: "training",
    capabilities: [
      "Structured IT courses and hands-on exercises",
      "Corporate and team upskilling",
      "Training aligned to workplace tasks",
      "Guidance on learning paths and next steps",
    ],
  },
];
