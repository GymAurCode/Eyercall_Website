export type ProductSlug = "eyerrems" | "eyerflow" | "eyerstock" | "eyertype";

export interface Product {
  slug: ProductSlug;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  description: string;
  theme: "theme-rems" | "theme-flow";
  highlights: string[];
  problem: string;
  overview: string;
  modules: { title: string; body: string }[];
  workflow: { title: string; body: string }[];
  benefits: string[];
  intendedFor: string[];
  faq: { q: string; a: string }[];
}

export const products: Record<ProductSlug, Product> = {
  eyerrems: {
    slug: "eyerrems",
    name: "EyerREMS",
    category: "Real Estate Management System",
    tagline: "Property operations, organized in one place.",
    summary:
      "A real estate management platform for property, tenant, client and financial records.",
    description:
      "EyerREMS is a real estate management platform designed to help organize property-related information and streamline day-to-day property management workflows.",
    theme: "theme-rems",
    highlights: [
      "Property & tenant records",
      "CRM and client records",
      "Maintenance tracking",
      "Finance and ledger",
      "Reports and activity",
    ],
    problem:
      "Property information often lives across spreadsheets, paper files, and message threads. Tenants, units, maintenance requests, and payments end up disconnected, which makes it hard to see what needs attention.",
    overview:
      "EyerREMS brings property, tenant, client, maintenance, and financial information into one structured system, so teams can work from a shared, consistent source of records.",
    modules: [
      {
        title: "Property management",
        body: "Keep properties and units organized with structured records that are easy to search and update.",
      },
      {
        title: "Tenant management",
        body: "Maintain tenant details and their relationship to properties and units in one place.",
      },
      {
        title: "CRM & client records",
        body: "Track clients and prospects alongside the properties they relate to.",
      },
      {
        title: "Maintenance management",
        body: "Log maintenance work and follow it through to completion.",
      },
      {
        title: "Construction management",
        body: "Organize information related to construction and development activity.",
      },
      {
        title: "Finance & ledger",
        body: "Record property-related financial entries in a structured ledger.",
      },
      {
        title: "Reports & activity",
        body: "Review business activity and summaries drawn from your records.",
      },
      { title: "Team & administration", body: "Manage team members and administrative workflows." },
    ],
    workflow: [
      {
        title: "Set up your portfolio",
        body: "Add properties and units to build a structured foundation.",
      },
      {
        title: "Connect people",
        body: "Link tenants and clients to the properties they belong to.",
      },
      {
        title: "Run daily operations",
        body: "Handle maintenance, finance entries, and team tasks from one interface.",
      },
      {
        title: "Review and decide",
        body: "Use reports to see activity and decide what to act on next.",
      },
    ],
    benefits: [
      "One consistent source of property records",
      "Less time spent searching across files",
      "Clearer visibility into ongoing work",
      "A structure that grows with your portfolio",
    ],
    intendedFor: [
      "Property managers and real estate teams",
      "Agencies handling tenants, clients and units",
      "Businesses replacing spreadsheets with a structured system",
    ],
    faq: [
      {
        q: "Who is EyerREMS for?",
        a: "Businesses and teams that manage properties and want a structured system for property, tenant, client, and operational records.",
      },
      {
        q: "Which modules are included?",
        a: "EyerREMS covers property, tenant, CRM, maintenance, construction, finance, reporting, and team workflows. Module availability for your setup can be confirmed during a demo.",
      },
      {
        q: "Can I see it before deciding?",
        a: "Yes. You can explore EyerREMS directly in your browser with our interactive read-only demo. Look for the 'Show Demo' button.",
      },
    ],
  },
  eyerflow: {
    slug: "eyerflow",
    name: "EyerFlow",
    category: "Inventory Management System",
    tagline: "Clear stock. Calm operations.",
    summary: "Inventory and business workflow software for organized stock operations.",
    description:
      "EyerFlow is an inventory management system designed to help businesses organize stock information, monitor inventory activity, and maintain clearer operational workflows.",
    theme: "theme-flow",
    highlights: [
      "Item management",
      "Stock movement tracking",
      "Product categorization",
      "Reporting and visibility",
    ],
    problem:
      "When stock is tracked manually, it becomes difficult to know what is on hand, what moved, and why. Small inconsistencies grow into missed orders and wasted time.",
    overview:
      "EyerFlow gives inventory a clear structure: items, categories, and stock movements are recorded consistently so teams can understand their inventory at a glance.",
    modules: [
      {
        title: "Inventory & items",
        body: "Create and maintain item records with the details your team relies on.",
      },
      {
        title: "Stock movement",
        body: "Record stock coming in and going out to keep an activity trail.",
      },
      {
        title: "Categorization",
        body: "Group products into categories for faster navigation and cleaner records.",
      },
      {
        title: "Records & organization",
        body: "Keep inventory information consistent and easy to find.",
      },
      {
        title: "Reporting & visibility",
        body: "Review inventory activity to understand what is happening in your operations.",
      },
    ],
    workflow: [
      { title: "Catalog your items", body: "Add products and organize them into categories." },
      { title: "Record movement", body: "Log stock changes as they happen." },
      { title: "Monitor activity", body: "See what moved and keep records aligned with reality." },
      {
        title: "Review and plan",
        body: "Use reports to inform restocking and operational decisions.",
      },
    ],
    benefits: [
      "A clearer picture of what you hold",
      "Traceable stock activity",
      "Organized, searchable product records",
      "Smoother day-to-day operations",
    ],
    intendedFor: [
      "Businesses holding and moving stock",
      "Teams that need a consistent inventory record",
      "Operations moving away from manual stock registers",
    ],
    faq: [
      {
        q: "Who is EyerFlow for?",
        a: "Businesses that hold stock and want an organized, consistent way to manage items and inventory activity.",
      },
      {
        q: "Does it track stock movement?",
        a: "Yes. EyerFlow is designed to record stock activity so teams can see how inventory changes over time.",
      },
      {
        q: "How do I get started?",
        a: "The interactive demo for EyerFlow is coming soon. Please contact our team for a walkthrough.",
      },
    ],
  },
  eyerstock: {
    slug: "eyerstock",
    name: "EyerStock",
    category: "Desktop Inventory Software",
    tagline: "Stock, purchases, sales and payments in one desktop system.",
    summary:
      "A streamlined desktop system for inventory records, purchases, sales, payments and reporting.",
    description:
      "EyerStock is a desktop inventory application for businesses that need to manage items, purchases, sales, payments and financial records in one structured system.",
    theme: "theme-rems",
    highlights: [
      "Inventory and item records",
      "Purchases and sales",
      "Payments tracking",
      "Finance and reporting",
    ],
    problem:
      "Small businesses often run stock, purchases, sales and payments through separate registers. Reconciling them takes time and makes it easy to lose track of what was bought, sold and paid.",
    overview:
      "EyerStock brings the day-to-day records of a stock-based business into one desktop application: items, purchases, sales, payments, and the reports that summarize them.",
    modules: [
      {
        title: "Items & categories",
        body: "Maintain structured item records and group them for faster navigation.",
      },
      {
        title: "Purchases",
        body: "Record incoming stock and supplier purchases as they happen.",
      },
      {
        title: "Sales",
        body: "Keep sales entries tied to the items and quantities involved.",
      },
      {
        title: "Payments",
        body: "Track payments made and received alongside purchase and sales records.",
      },
      {
        title: "Finance & ledger",
        body: "Organize financial entries from daily activity in a consistent structure.",
      },
      {
        title: "Reports",
        body: "Review inventory and financial summaries drawn from your records.",
      },
    ],
    workflow: [
      {
        title: "Set up items",
        body: "Create your item records and categories in the system.",
      },
      {
        title: "Record purchases and sales",
        body: "Log stock coming in and going out as part of daily operations.",
      },
      {
        title: "Track payments",
        body: "Keep payment records connected to the corresponding activity.",
      },
      {
        title: "Review reports",
        body: "Use summaries to understand stock and financial position.",
      },
    ],
    benefits: [
      "One place for stock, purchases, sales and payments",
      "Consistent daily records",
      "Less manual reconciliation",
      "Desktop operation without an internet dependency",
    ],
    intendedFor: [
      "Shops and distributors managing stock",
      "Small businesses that prefer a desktop workflow",
      "Teams replacing separate manual registers",
    ],
    faq: [
      {
        q: "Who is EyerStock for?",
        a: "Businesses that manage stock, purchases, sales and payments and want those records organized in a single desktop system.",
      },
      {
        q: "Which records does it cover?",
        a: "EyerStock covers items and categories, purchases, sales, payments, finance entries and reporting. Confirm the exact module set for your setup during a demo.",
      },
      {
        q: "How can I evaluate it?",
        a: "The interactive demo for EyerStock is coming soon. Please contact our team for a walkthrough.",
      },
    ],
  },
  eyertype: {
    slug: "eyertype",
    name: "EyerType",
    category: "Typing Practice & Learning Platform",
    tagline: "Build speed and accuracy, one lesson at a time.",
    summary:
      "A typing practice platform with lessons, tests and game-based exercises for learners.",
    description:
      "EyerType is a typing practice and learning platform built around structured lessons, practice tests and game-based exercises that help learners improve speed and accuracy.",
    theme: "theme-flow",
    highlights: [
      "Structured typing lessons",
      "Practice tests",
      "Game-based exercises",
      "Progress tracking",
    ],
    problem:
      "Typing speed and accuracy improve through regular, deliberate practice. Without structure, learners repeat the same habits and find it hard to see whether they are improving.",
    overview:
      "EyerType gives typing practice a clear progression: lessons build the basics, tests measure accuracy and speed, and game-based exercises keep practice engaging over time.",
    modules: [
      {
        title: "Typing lessons",
        body: "Work through structured lessons that build from the fundamentals.",
      },
      {
        title: "Practice tests",
        body: "Measure speed and accuracy with timed practice sessions.",
      },
      {
        title: "Game-based practice",
        body: "Reinforce skills through exercises designed to keep practice engaging.",
      },
      {
        title: "Progress tracking",
        body: "Review results across lessons and tests to see how skills develop.",
      },
    ],
    workflow: [
      { title: "Start with the basics", body: "Work through foundational typing lessons." },
      { title: "Practice consistently", body: "Reinforce technique with short, regular sessions." },
      {
        title: "Test your accuracy",
        body: "Use practice tests to measure speed and consistency.",
      },
      {
        title: "Review progress",
        body: "Track results over time and focus on the areas that need work.",
      },
    ],
    benefits: [
      "A structured path for beginners",
      "Clear feedback on speed and accuracy",
      "Practice that stays engaging",
      "Useful for students, institutes and professionals",
    ],
    intendedFor: [
      "Students building computer skills",
      "Training institutes running IT courses",
      "Professionals who want faster, more accurate typing",
    ],
    faq: [
      {
        q: "Who is EyerType for?",
        a: "Students, training institutes and professionals who want a structured way to improve typing speed and accuracy.",
      },
      {
        q: "Does it include tests?",
        a: "Yes. EyerType combines lessons, practice tests and game-based exercises, with results to review.",
      },
      {
        q: "Can institutes use it?",
        a: "Yes. EyerType is suitable for classroom and lab practice. Contact Eyercall to discuss how it fits your training programme.",
      },
    ],
  },
};

export const productList = [
  products.eyerrems,
  products.eyerflow,
  products.eyerstock,
  products.eyertype,
];
