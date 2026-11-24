import { Facebook, Instagram, Linkedin, Youtube, type LucideIcon } from "lucide-react";
import { socialLinks, type SocialIcon } from "@/lib/site";

const icons: Record<SocialIcon, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export function SocialLinks({
  className = "",
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md";
}) {
  if (socialLinks.length === 0) return null;

  const box = size === "sm" ? "h-9 w-9" : "h-10 w-10";
  const glyph = size === "sm" ? 16 : 18;

  return (
    <ul className={`flex flex-wrap items-center gap-2.5 ${className}`}>
      {socialLinks.map(({ key, label, url }) => {
        const Icon = icons[key];
        return (
          <li key={key}>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Eyercall on ${label}`}
              title={`Eyercall on ${label}`}
              className={`grid ${box} place-items-center rounded-full border border-teal-border bg-card/60 text-muted-foreground transition-all duration-200 hover:-translate-y-0.5 hover:border-teal-border-strong hover:bg-primary-soft hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
            >
              <Icon size={glyph} strokeWidth={1.75} aria-hidden />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
