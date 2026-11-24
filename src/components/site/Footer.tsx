import { Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Wordmark } from "./Nav";
import { SocialLinks } from "./SocialLinks";
import { company, contactChannels, hasContactChannels, telHref, whatsappHref } from "@/lib/site";
import { productList } from "@/lib/content";

const footerLink = "text-muted-foreground transition-colors hover:text-foreground";

export function Footer() {
  return (
    <footer className="relative mt-32 overflow-hidden border-t border-glass-border bg-secondary">
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 select-none font-display text-[22vw] font-bold leading-none text-foreground/[0.03]"
      >
        Eyercall
      </div>
      <div className="page-shell relative grid gap-10 pb-12 pt-16 md:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr]">
        <div>
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{company.shortDescription}</p>
          <SocialLinks className="mt-6" size="sm" />
        </div>

        <nav aria-label="Software">
          <h3 className="eyebrow mb-4">Software</h3>
          <ul className="space-y-2 text-sm">
            {productList.map((product) => (
              <li key={product.slug}>
                <Link to="/software/$slug" params={{ slug: product.slug }} className={footerLink}>
                  {product.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/software" className={footerLink}>
                All software
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Company">
          <h3 className="eyebrow mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className={footerLink}>
                About Us
              </Link>
            </li>
            <li>
              <Link to="/services" className={footerLink}>
                Services
              </Link>
            </li>
            <li>
              <Link to="/courses" className={footerLink}>
                Courses
              </Link>
            </li>
            <li>
              <Link to="/contact" className={footerLink}>
                Contact Us
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h3 className="eyebrow mb-4">Get in touch</h3>
          {hasContactChannels ? (
            <ul className="space-y-3 text-sm text-muted-foreground">
              {contactChannels.email && (
                <li>
                  <a
                    href={`mailto:${contactChannels.email}`}
                    className="flex items-start gap-2.5 transition-colors hover:text-foreground"
                  >
                    <Mail size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                    <span className="break-all">{contactChannels.email}</span>
                  </a>
                </li>
              )}
              {contactChannels.phone && (
                <li>
                  <a
                    href={telHref(contactChannels.phone)}
                    className="flex items-start gap-2.5 transition-colors hover:text-foreground"
                  >
                    <Phone size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                    <span>{contactChannels.phone}</span>
                  </a>
                </li>
              )}
              {contactChannels.whatsapp && (
                <li>
                  <a
                    href={whatsappHref(contactChannels.whatsapp)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-2.5 transition-colors hover:text-foreground"
                  >
                    <MessageCircle
                      size={16}
                      className="mt-0.5 shrink-0 text-primary-text"
                      aria-hidden
                    />
                    <span>WhatsApp</span>
                  </a>
                </li>
              )}
              {contactChannels.address && (
                <li className="flex items-start gap-2.5">
                  <MapPin size={16} className="mt-0.5 shrink-0 text-primary-text" aria-hidden />
                  <span>{contactChannels.address}</span>
                </li>
              )}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">
              Use the contact form to send us an enquiry.
            </p>
          )}
          <Link
            to="/contact"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-text transition-colors hover:text-primary-hover"
          >
            Contact Eyercall
            <ArrowRight size={14} aria-hidden />
          </Link>
        </div>
      </div>

      <div className="relative border-t border-glass-border">
        <div className="page-shell flex flex-col gap-2 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Eyercall. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className={footerLink}>
              Privacy Policy
            </Link>
            <Link to="/contact" className={footerLink}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
