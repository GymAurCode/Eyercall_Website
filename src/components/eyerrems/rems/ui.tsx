import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Lock,
  Search,
  X,
} from "lucide-react";
import { fmtDate, fmtMoney, type StatusTone } from "./data";

/* ────────────────────────── badges ────────────────────────── */

const STATUS_TONES: Record<string, StatusTone> = {
  active: "green",
  completed: "green",
  paid: "green",
  verified: "green",
  cleared: "green",
  present: "green",
  won: "green",
  approved: "green",
  posted: "green",
  pass: "green",
  published: "green",
  delivered: "green",
  success: "green",
  finalized: "green",
  available: "green",
  open: "blue",
  new: "blue",
  assigned: "blue",
  scheduled: "blue",
  pending: "amber",
  reserved: "blue",
  confirmed: "teal",
  in_progress: "violet",
  contacted: "violet",
  qualified: "violet",
  site_visit: "violet",
  negotiation: "amber",
  proposal: "amber",
  "in progress": "violet",
  under_construction: "amber",
  "under construction": "amber",
  expiring: "amber",
  partial: "amber",
  probation: "amber",
  medium: "amber",
  low: "slate",
  draft: "slate",
  inactive: "slate",
  cancelled: "slate",
  ended: "slate",
  snoozed: "slate",
  high: "red",
  urgent: "red",
  overdue: "red",
  lost: "red",
  rejected: "red",
  failed: "red",
  suspended: "red",
  critical: "red",
  blocked: "red",
  absent: "red",
  denied: "red",
  converted: "teal",
  converted_to_sale: "teal",
  on_hold: "amber",
  planning: "blue",
  execution: "violet",
  procurement: "amber",
  quality_inspection: "teal",
  completion: "green",
  budget_approval: "blue",
  inactive_client: "slate",
  verified_payment: "green",
  paid_status: "green",
};

export function toneFor(status: string): StatusTone {
  const key = String(status ?? "")
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  return STATUS_TONES[key] ?? "slate";
}

export function labelize(value: string) {
  return String(value ?? "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function StatusBadge({ status, label }: { status: string; label?: string }) {
  return (
    <span className={`rms-badge is-${toneFor(status)}`}>
      <span aria-hidden className="rms-badge-dot" />
      {label ?? labelize(status)}
    </span>
  );
}

/* ────────────────────────── tabs ────────────────────────── */

export function ModuleTabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="rms-tabs" role="tablist">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === active}
          className={`rms-tab ${tab.id === active ? "is-active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

/* ────────────────────────── page header ────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rms-page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="rms-page-actions">{children}</div>
    </div>
  );
}

/* ────────────────────────── cards ────────────────────────── */

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "teal",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: ReactNode;
  tone?: "teal" | "blue" | "green" | "amber" | "red" | "violet";
}) {
  return (
    <article className="rms-stat">
      <div className="rms-stat-top">
        <span className={`rms-stat-icon is-${tone}`}>{icon}</span>
        <span className="rms-stat-hint">{hint}</span>
      </div>
      <strong>{typeof value === "number" ? value.toLocaleString("en-US") : value}</strong>
      <span className="rms-stat-label">{label}</span>
    </article>
  );
}

export function Card({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title?: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`rms-card ${className}`}>
      {(title || action) && (
        <header className="rms-card-head">
          <div>
            {title && <h2>{title}</h2>}
            {subtitle && <p>{subtitle}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

/* ────────────────────────── charts ────────────────────────── */

export function BarChart({
  data,
  series,
  height = 190,
  format = fmtShortCompact,
}: {
  data: Record<string, string | number>[];
  series: { key: string; label: string; color: string }[];
  height?: number;
  format?: (n: number) => string;
}) {
  const max = Math.max(1, ...data.flatMap((row) => series.map((s) => Number(row[s.key] ?? 0))));
  return (
    <div className="rms-chart-wrap">
      <div className="rms-chart-legend">
        {series.map((s) => (
          <span key={s.key}>
            <i style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>
      <div className="rms-bars" style={{ height }}>
        {data.map((row, rowIndex) => (
          <div className="rms-bar-group" key={rowIndex}>
            <div className="rms-bar-pair">
              {series.map((s) => {
                const value = Number(row[s.key] ?? 0);
                return (
                  <span
                    key={s.key}
                    className="rms-bar"
                    style={{ height: `${Math.max(2, (value / max) * 100)}%`, background: s.color }}
                    title={`${s.label}: ${format(value)}`}
                  />
                );
              })}
            </div>
            <span className="rms-bar-x">
              {String(row["month"] ?? row["label"] ?? row["name"] ?? "")}
            </span>
          </div>
        ))}
      </div>
      <div className="rms-chart-axis">
        <span>{format(0)}</span>
        <span>{format(max)}</span>
      </div>
    </div>
  );
}

export function fmtShortCompact(n: number) {
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${Math.round(n / 1_000)}K`;
  return String(Math.round(n));
}

export function Donut({
  segments,
  centerLabel,
  centerValue,
  size = 148,
}: {
  segments: { label: string; value: number; color: string }[];
  centerLabel?: string;
  centerValue?: string;
  size?: number;
}) {
  const total = Math.max(
    1,
    segments.reduce((sum, s) => sum + s.value, 0),
  );
  let offset = 0;
  const stops = segments.map((s) => {
    const start = offset;
    offset += (s.value / total) * 100;
    return `${s.color} ${start}% ${offset}%`;
  });
  return (
    <div className="rms-donut-row">
      <div
        className="rms-donut"
        style={{ width: size, height: size, background: `conic-gradient(${stops.join(",")})` }}
      >
        <div>
          <strong>{centerValue ?? total.toLocaleString("en-US")}</strong>
          {centerLabel && <span>{centerLabel}</span>}
        </div>
      </div>
      <ul className="rms-legend">
        {segments.map((s) => (
          <li key={s.label}>
            <i style={{ background: s.color }} />
            <span>{s.label}</span>
            <strong>{s.value.toLocaleString("en-US")}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Funnel({ rows }: { rows: { stage: string; count: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  const colors = ["#3b82f6", "#8b5cf6", "#f59e0b", "#6366f1", "#10b981", "#14b8a6"];
  return (
    <div className="rms-funnel">
      {rows.map((row, i) => (
        <div className="rms-funnel-row" key={row.stage}>
          <span className="rms-funnel-label">{row.stage}</span>
          <div className="rms-funnel-track">
            <div
              style={{
                width: `${Math.max(4, (row.count / max) * 100)}%`,
                background: colors[i % colors.length],
              }}
            >
              {row.count}
            </div>
          </div>
          {i > 0 && (
            <span className="rms-funnel-pct">
              {Math.round((row.count / Math.max(1, rows[i - 1]!.count)) * 100)}%
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export function ProgressBar({
  value,
  max = 100,
  label,
}: {
  value: number;
  max?: number;
  label?: string;
}) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  const color = pct >= 95 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="rms-progress">
      <div className="rms-progress-track">
        <span style={{ width: `${pct}%`, background: color }} />
      </div>
      <em style={{ color }}>{label ?? `${pct}%`}</em>
    </div>
  );
}

/* ────────────────────────── data table ────────────────────────── */

export type Column<T> = {
  key: string;
  label: string;
  sortable?: boolean;
  align?: "left" | "right" | "center";
  width?: string;
  render?: (row: T) => ReactNode;
  className?: string;
};

export type FilterDef<T> = {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  value?: (row: T) => string;
};

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  filters = [],
  searchPlaceholder = "Search...",
  toolbar,
  onRowClick,
  pageSizeDefault = 10,
  emptyTitle = "No records found",
  rowKey,
  actionsLabel = "Actions",
}: {
  data: T[];
  columns: Column<T>[];
  filters?: FilterDef<T>[];
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  pageSizeDefault?: number;
  emptyTitle?: string;
  rowKey?: (row: T) => string | number;
  actionsLabel?: string;
}) {
  const [query, setQuery] = useState("");
  const [filterState, setFilterState] = useState<Record<string, string>>({});
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(pageSizeDefault);

  useEffect(() => {
    setPage(1);
  }, [query, filterState, data]);

  const rowId =
    rowKey ??
    ((row: T) => String(row["id"] ?? row[columns[0]?.key ?? "id"] ?? JSON.stringify(row)));

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    let rows = [...data];
    if (needle) {
      rows = rows.filter(
        (row) =>
          columns.some((col) => {
            const raw = row[col.key];
            const value = raw == null ? "" : String(raw);
            return value.toLowerCase().includes(needle);
          }) || JSON.stringify(row).toLowerCase().includes(needle),
      );
    }
    filters.forEach((filter) => {
      const selected = filterState[filter.key];
      if (selected) {
        rows = rows.filter((row) => {
          const value = filter.value ? filter.value(row) : String(row[filter.key] ?? "");
          return value === selected;
        });
      }
    });
    if (sortKey) {
      rows.sort((a, b) => {
        const av = a[sortKey];
        const bv = b[sortKey];
        if (av == null) return 1;
        if (bv == null) return -1;
        const cmp =
          typeof av === "number" && typeof bv === "number"
            ? av - bv
            : String(av).localeCompare(String(bv), undefined, { numeric: true });
        return sortDir === "asc" ? cmp : -cmp;
      });
    }
    return rows;
  }, [data, columns, filters, filterState, query, sortKey, sortDir]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const rows = filtered.slice((safePage - 1) * pageSize, (safePage - 1) * pageSize + pageSize);

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
    setPage(1);
  }

  return (
    <div className="rms-table-card">
      <div className="rms-table-toolbar">
        <label className="rms-search">
          <Search size={15} aria-hidden />
          <input
            type="search"
            value={query}
            placeholder={searchPlaceholder}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
        <div className="rms-filter-row">
          {filters.map((filter) => (
            <select
              key={filter.key}
              value={filterState[filter.key] ?? ""}
              aria-label={`Filter by ${filter.label}`}
              onChange={(event) => {
                setFilterState((state) => ({ ...state, [filter.key]: event.target.value }));
                setPage(1);
              }}
            >
              <option value="">All {filter.label}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ))}
          {toolbar}
        </div>
      </div>

      <div className="rms-table-scroll">
        <table className="rms-table">
          <thead>
            <tr>
              {columns.map((col) => {
                const active = sortKey === col.key;
                const Icon = active ? (sortDir === "asc" ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    style={{ width: col.width, textAlign: col.align ?? "left" }}
                  >
                    {col.sortable === false ? (
                      col.label
                    ) : (
                      <button
                        type="button"
                        className="rms-th-sort"
                        onClick={() => toggleSort(col.key)}
                      >
                        {col.label}
                        <Icon size={11} aria-hidden className={active ? "is-active" : ""} />
                      </button>
                    )}
                  </th>
                );
              })}
              {onRowClick && (
                <th scope="col" style={{ width: 54 }}>
                  {actionsLabel}
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={rowId(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? "is-clickable" : undefined}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align ?? "left" }}
                    className={col.className}
                  >
                    {col.render ? col.render(row) : formatValue(row[col.key])}
                  </td>
                ))}
                {onRowClick && (
                  <td>
                    <button
                      type="button"
                      className="rms-row-eye"
                      aria-label="View record"
                      title="Open record (read only)"
                      onClick={(event) => {
                        event.stopPropagation();
                        onRowClick(row);
                      }}
                    >
                      <Eye size={14} />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 && (
          <div className="rms-empty">
            <Search size={22} aria-hidden />
            <strong>{emptyTitle}</strong>
            <span>Try a different search term or filter.</span>
          </div>
        )}
      </div>

      <div className="rms-table-footer">
        <span>
          Showing {filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1}–
          {Math.min(safePage * pageSize, filtered.length)} of {filtered.length} results
        </span>
        <div className="rms-pager-controls">
          <label>
            Rows per page:
            <select
              value={pageSize}
              onChange={(event) => {
                setPageSize(Number(event.target.value));
                setPage(1);
              }}
            >
              {[10, 25, 50, 100].map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>
          <div className="rms-pager-btns">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(1)}
              title="First page"
            >
              <ChevronsLeft size={15} />
            </button>
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage(safePage - 1)}
              title="Previous page"
            >
              <ChevronLeft size={15} />
            </button>
            <span>
              Page {safePage} of {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage(safePage + 1)}
              title="Next page"
            >
              <ChevronRight size={15} />
            </button>
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage(pageCount)}
              title="Last page"
            >
              <ChevronsRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatValue(value: unknown): ReactNode {
  if (value == null || value === "") return <span className="rms-muted">—</span>;
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "number") return value.toLocaleString("en-US");
  return String(value);
}

/* ────────────────────────── read-only action + drawer ────────────────────────── */

export function DisabledAction({
  children,
  title = "Unavailable in Demo Mode — this action would change business data.",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <button type="button" className="rms-btn is-muted" disabled title={title}>
      <Lock size={13} aria-hidden />
      {children}
    </button>
  );
}

export function PrimaryButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="rms-btn is-primary"
      disabled
      title="Unavailable in Demo Mode — creating or saving records is disabled."
    >
      {children}
    </button>
  );
}

export type DetailField = { label: string; value: ReactNode };

export function DetailDrawer({
  open,
  title,
  subtitle,
  fields,
  sections,
  onClose,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  fields: DetailField[];
  sections?: { title: string; fields: DetailField[] }[];
  onClose: () => void;
}) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="rms-drawer-backdrop"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <aside className="rms-drawer" role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <header>
          <div>
            <p>{subtitle ?? "Record detail"}</p>
            <h2 id={titleId}>{title}</h2>
          </div>
          <button
            type="button"
            className="rms-icon-btn"
            onClick={onClose}
            aria-label="Close detail"
          >
            <X size={18} />
          </button>
        </header>
        <div className="rms-drawer-body">
          <dl className="rms-detail-grid">
            {fields.map((field) => (
              <div key={field.label}>
                <dt>{field.label}</dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
          {(sections ?? []).map((section) => (
            <section key={section.title} className="rms-detail-section">
              <h3>{section.title}</h3>
              <dl className="rms-detail-grid">
                {section.fields.map((field) => (
                  <div key={field.label}>
                    <dt>{field.label}</dt>
                    <dd>{field.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          ))}
        </div>
        <footer>
          <span className="rms-readonly-note">
            <Lock size={12} /> Read-only · fictional demo data
          </span>
          <button type="button" className="rms-btn is-secondary" onClick={onClose}>
            Close
          </button>
        </footer>
      </aside>
    </div>
  );
}

export function SummaryStrip({
  items,
}: {
  items: { label: string; value: ReactNode; tone?: string; icon?: ReactNode }[];
}) {
  return (
    <div className="rms-summary-strip">
      {items.map((item) => (
        <div key={item.label}>
          {item.icon && (
            <span className="rms-summary-icon" style={{ color: item.tone ?? "var(--rms-accent)" }}>
              {item.icon}
            </span>
          )}
          <div>
            <strong style={{ color: item.tone ?? "var(--rms-text)" }}>{item.value}</strong>
            <span>{item.label}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Notice({ children }: { children: ReactNode }) {
  return (
    <div className="rms-notice">
      <AlertTriangle size={15} aria-hidden />
      <span>{children}</span>
    </div>
  );
}

export function money(n: number) {
  return fmtMoney(n);
}
export function date(d: string) {
  return fmtDate(d);
}
