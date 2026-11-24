export type SocialIcon = "facebook" | "instagram" | "linkedin" | "youtube";

export interface SocialLink {
  key: SocialIcon;
  label: string;
  url: string;
}

export interface LeadershipMember {
  name: string;
  role: string;
  bio: string;
  linkedin?: string;
}

function env(key: string): string | undefined {
  const value = (import.meta.env as Record<string, unknown>)[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function isWebUrl(value: string | undefined): boolean {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}

/*
 * Social profiles live in environment variables so the site never ships a
 * guessed or placeholder account. Add a verified URL and the icon appears in
 * the navbar area, homepage, About page, Contact page and footer automatically.
 */
const socialCandidates: { key: SocialIcon; label: string; url?: string | undefined }[] = [
  { key: "facebook", label: "Facebook", url: env("VITE_SOCIAL_FACEBOOK") },
  { key: "instagram", label: "Instagram", url: env("VITE_SOCIAL_INSTAGRAM") },
  { key: "linkedin", label: "LinkedIn", url: env("VITE_SOCIAL_LINKEDIN") },
  { key: "youtube", label: "YouTube", url: env("VITE_SOCIAL_YOUTUBE") },
];

export const socialLinks: SocialLink[] = socialCandidates
  .filter((item) => isWebUrl(item.url))
  .map((item) => ({ key: item.key, label: item.label, url: item.url as string }));

export const hasSocialLinks = socialLinks.length > 0;

/** Leadership profiles render only when real, verified entries are configured. */
export const leadership: LeadershipMember[] = [];

const email = env("VITE_CONTACT_EMAIL");
const phone = env("VITE_CONTACT_PHONE");
const whatsapp = env("VITE_CONTACT_WHATSAPP");
const address = env("VITE_CONTACT_ADDRESS");

export const contactChannels = {
  email,
  phone,
  whatsapp,
  address,
};

export const hasContactChannels = Boolean(email || phone || whatsapp || address);

export function whatsappHref(value: string): string {
  if (isWebUrl(value)) return value;
  const digits = value.replace(/[^\d]/g, "");
  return `https://wa.me/${digits}`;
}

export function telHref(value: string): string {
  return `tel:${value.replace(/[^\d+]/g, "")}`;
}

export const company = {
  name: "Eyercall",
  tagline: "Software development and IT training.",
  shortDescription:
    "Eyercall builds business software and delivers practical IT training for individuals and organizations.",
  description:
    "Eyercall is a technology company working across software development, digital solutions and IT education. We build management systems, web and mobile applications, and deliver practical training in cybersecurity, web development, design and essential IT skills.",
} as const;
