export type CourseSlug =
  | "cyber-security"
  | "web-development"
  | "ites"
  | "graphic-designing"
  | "video-editing"
  | "basic-computer";

export type CourseIcon = "security" | "code" | "services" | "design" | "video" | "computer";

export interface Course {
  slug: CourseSlug;
  name: string;
  category: string;
  tagline: string;
  description: string;
  icon: CourseIcon;
  overview: string;
  objectives: string[];
  topics: string[];
  audience: string;
  prerequisites: string;
}

export const courses: Record<CourseSlug, Course> = {
  "cyber-security": {
    slug: "cyber-security",
    name: "Cyber Security",
    category: "Security Fundamentals",
    tagline: "Learn how to recognize threats and protect systems.",
    description:
      "A foundational cyber security course covering defensive principles, common threats and the practices that reduce everyday risk.",
    icon: "security",
    overview:
      "This course introduces the concepts behind defensive security and safe digital practice. It is designed for people starting in IT or looking to strengthen the security awareness of their team, with an emphasis on practical understanding rather than theory alone.",
    objectives: [
      "Understand the common threats individuals and organizations face",
      "Apply core security principles such as least privilege and defence in depth",
      "Recognize phishing, weak authentication and other everyday risks",
      "Build safer habits for accounts, devices and data",
    ],
    topics: [
      "Security fundamentals and terminology",
      "Network and internet basics",
      "Accounts, authentication and access control",
      "Common attack types and social engineering",
      "Safe browsing and device practices",
      "Risk awareness and incident reporting",
    ],
    audience:
      "Beginners entering IT, support staff, and teams that want a stronger security foundation.",
    prerequisites:
      "Basic familiarity with computers and the internet. No prior security experience is required.",
  },
  "web-development": {
    slug: "web-development",
    name: "Web Development",
    category: "Frontend & Backend",
    tagline: "Build websites and web applications from the ground up.",
    description:
      "A practical web development course covering frontend structure and styling, JavaScript, backend concepts and the path from code to a working site.",
    icon: "code",
    overview:
      "The course follows the way real websites are built: structure first, then styling, interactivity and the backend services behind the interface. Learners work with the core technologies and connect the pieces into complete, responsive pages.",
    objectives: [
      "Write clean, semantic HTML and responsive CSS",
      "Use JavaScript to add interactivity and handle data",
      "Understand how frontend and backend communicate",
      "Work with a code editor, version control and deployment basics",
    ],
    topics: [
      "HTML structure and accessibility basics",
      "CSS layout, responsive design and components",
      "JavaScript fundamentals and the DOM",
      "Requests, APIs and data handling",
      "Backend concepts and databases",
      "Project structure, testing and deployment basics",
    ],
    audience:
      "Aspiring developers, design students, and professionals moving into web development.",
    prerequisites: "Basic computer literacy. No prior programming experience is required.",
  },
  ites: {
    slug: "ites",
    name: "ITES",
    category: "IT Enabled Services",
    tagline: "Practical digital workplace skills for IT-enabled roles.",
    description:
      "A workplace-focused course covering the digital tools, data handling and service practices used in IT-enabled services roles.",
    icon: "services",
    overview:
      "ITES roles depend on accurate data handling, clear communication and reliable use of workplace tools. This course focuses on the practical skills that transfer directly into day-to-day work in service and back-office environments.",
    objectives: [
      "Work confidently with common business software and digital tools",
      "Handle data accurately and follow structured processes",
      "Communicate clearly with customers and colleagues",
      "Understand service quality, privacy and workplace conduct",
    ],
    topics: [
      "Workplace software and productivity tools",
      "Data entry, validation and record keeping",
      "Written and verbal business communication",
      "Customer support and service basics",
      "Process quality and accuracy",
      "Digital privacy and responsible use",
    ],
    audience:
      "Job seekers preparing for IT-enabled services roles and teams standardizing digital workflows.",
    prerequisites: "Basic computer literacy and comfort using email and the internet.",
  },
  "graphic-designing": {
    slug: "graphic-designing",
    name: "Graphic Designing",
    category: "Visual Communication",
    tagline: "Turn ideas into clear, considered visual design.",
    description:
      "A design fundamentals course covering layout, typography, colour, brand consistency and the tools used to produce professional visuals.",
    icon: "design",
    overview:
      "Good design is about communication before decoration. The course builds a practical understanding of composition, hierarchy and consistency, then applies it through exercises with industry-standard design tools.",
    objectives: [
      "Apply layout, hierarchy and balance to real design work",
      "Use typography and colour intentionally",
      "Build consistent visuals for a brand or campaign",
      "Prepare files correctly for digital and print use",
    ],
    topics: [
      "Design principles and visual hierarchy",
      "Typography fundamentals",
      "Colour theory and usage",
      "Layout for social media and print",
      "Design tools and workflows",
      "File formats, export and handoff",
    ],
    audience:
      "Beginners interested in design, marketing staff, and business owners creating their own visuals.",
    prerequisites: "Basic computer literacy. No prior design experience is required.",
  },
  "video-editing": {
    slug: "video-editing",
    name: "Video Editing",
    category: "Content Production",
    tagline: "Learn the craft of editing video with confidence.",
    description:
      "A practical video editing course covering the editing workflow, cutting and pacing, audio, colour and exporting content for different platforms.",
    icon: "video",
    overview:
      "The course follows a complete edit from footage to final export. Learners practice organizing footage, building a timeline, shaping pacing and sound, and preparing versions for the platforms they publish on.",
    objectives: [
      "Organize footage and build a clean, efficient timeline",
      "Cut for pacing, clarity and story",
      "Balance audio and apply basic colour correction",
      "Export correctly for web, social and presentation use",
    ],
    topics: [
      "Editing fundamentals and workspace setup",
      "Timelines, cuts and transitions",
      "Working with audio and music",
      "Titles, graphics and lower thirds",
      "Colour correction and basic grading",
      "Export settings and delivery formats",
    ],
    audience:
      "Content creators, marketing staff, students, and anyone producing video for their organization.",
    prerequisites:
      "Basic computer literacy. Access to a computer capable of video editing is recommended.",
  },
  "basic-computer": {
    slug: "basic-computer",
    name: "Basic Computer Course",
    category: "Digital Foundations",
    tagline: "Essential computer skills for study, work and daily life.",
    description:
      "A beginner-friendly course covering computer fundamentals, operating system basics, office applications, internet use and safe digital habits.",
    icon: "computer",
    overview:
      "This course is designed for learners starting from the beginning. It builds confidence with the computer itself, the applications used for documents and spreadsheets, and the everyday online services people rely on.",
    objectives: [
      "Use a computer, files and common applications confidently",
      "Create and format documents and spreadsheets",
      "Use email, browsers and online services safely",
      "Apply good habits for privacy, security and backups",
    ],
    topics: [
      "Computer and operating system basics",
      "Files, folders and storage",
      "Word processing and documents",
      "Spreadsheets and basic calculations",
      "Internet, email and online forms",
      "Digital safety and responsible use",
    ],
    audience:
      "Absolute beginners, students, and adults returning to study or preparing for office work.",
    prerequisites: "No prior computer experience is required.",
  },
};

export const courseList = [
  courses["cyber-security"],
  courses["web-development"],
  courses.ites,
  courses["graphic-designing"],
  courses["video-editing"],
  courses["basic-computer"],
];
