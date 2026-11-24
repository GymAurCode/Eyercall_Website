import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

type BreadcrumbTarget = "/" | "/about" | "/software" | "/courses" | "/services" | "/contact";

export interface BreadcrumbItem {
  label: string;
  to?: BreadcrumbTarget;
}

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {index > 0 && <ChevronRight size={12} aria-hidden className="opacity-60" />}
              {item.to && !last ? (
                <Link
                  to={item.to}
                  className="rounded-sm transition-colors hover:text-primary-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={last ? "text-foreground" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
