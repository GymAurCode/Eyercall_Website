import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleTheme, useTheme } from "@/lib/theme";
import { LogoMark } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About Us" },
  { to: "/software", label: "Software" },
  { to: "/courses", label: "Courses" },
  { to: "/services", label: "Services" },
  { to: "/contact", label: "Contact Us" },
] as const;

const linkBase =
  "relative rounded-full px-3 py-2 text-sm text-muted-foreground transition-colors duration-200 hover:bg-primary-soft hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary-text xl:px-4";

export function Wordmark() {
  return (
    <span className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
      <LogoMark className="h-7 w-auto" alt="" />
      Eyercall
    </span>
  );
}

function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => toggleTheme()}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="grid h-9 w-9 place-items-center rounded-full border border-teal-border text-muted-foreground transition-colors duration-300 hover:border-teal-border-strong hover:bg-primary-soft hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="relative block h-[18px] w-[18px]">
        <Moon
          size={18}
          strokeWidth={1.75}
          aria-hidden
          className="absolute inset-0 transition-all duration-300 ease-out dark:-rotate-90 dark:scale-50 dark:opacity-0"
        />
        <Sun
          size={18}
          strokeWidth={1.75}
          aria-hidden
          className="absolute inset-0 rotate-90 scale-50 opacity-0 transition-all duration-300 ease-out dark:rotate-0 dark:scale-100 dark:opacity-100"
        />
      </span>
    </button>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-[padding] duration-300"
      style={{ paddingTop: scrolled ? 10 : 20 }}
    >
      <nav
        aria-label="Primary"
        className={`page-shell flex items-center justify-between rounded-full border px-4 transition-all duration-300 ${
          scrolled
            ? "glass-strong edge-light border-glass-border py-2"
            : "border-transparent bg-transparent/50 backdrop-blur-md py-3"
        }`}
      >
        <Link to="/" aria-label="Eyercall home" className="rounded-full">
          <Wordmark />
        </Link>
        <ul className="hidden items-center gap-0.5 lg:flex xl:gap-1">
          {links.map((l) => (
            <li key={l.to}>
              <Link to={l.to} activeOptions={{ exact: l.to === "/" }} className={linkBase}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="glow" size="sm" className="hidden sm:inline-flex">
            <Link to="/contact">Contact Us</Link>
          </Button>
          <Button
            variant="glass"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </Button>
        </div>
      </nav>
      <div
        className={`page-shell mt-2 overflow-hidden rounded-3xl glass-strong transition-all duration-300 lg:hidden ${
          open ? "max-h-[34rem] opacity-100" : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <ul className="p-3">
          {links.map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: l.to === "/" }}
                className="block rounded-2xl px-4 py-3 text-muted-foreground transition-colors duration-200 hover:bg-primary-soft hover:text-foreground data-[status=active]:bg-primary-soft data-[status=active]:text-primary-text"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="px-3 pb-3">
          <Button asChild variant="glow" className="w-full">
            <Link to="/contact" onClick={() => setOpen(false)}>
              Contact Eyercall
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
