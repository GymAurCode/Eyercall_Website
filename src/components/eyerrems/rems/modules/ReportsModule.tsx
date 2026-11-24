import { useState } from "react";
import {
  ArrowLeft,
  Building2,
  Briefcase,
  Calendar,
  CircleDollarSign,
  FileBarChart,
  Search,
  ShieldCheck,
  ToolCase,
  UserCheck,
  Users,
} from "lucide-react";
import { fmtDate, fmtMoney, reportModules, reportRows, type NavModule } from "../data";
import { Card, DataTable, DisabledAction, PageHeader, StatusBadge, labelize } from "../ui";

const ICONS: Record<string, React.ReactNode> = {
  building: <Building2 size={18} />,
  users: <Users size={18} />,
  "currency-dollar": <CircleDollarSign size={18} />,
  "user-check": <UserCheck size={18} />,
  tool: <ToolCase size={18} />,
  "building-skyscraper": <Building2 size={18} />,
  briefcase: <Briefcase size={18} />,
  calendar: <Calendar size={18} />,
};

export default function ReportsModule({
  module,
  tab,
  detailId,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  detailId?: string | undefined;
  onNavigate: (path: string) => void;
}) {
  const activeModule = reportModules.find((m) => m.key === tab);
  const reportType = activeModule
    ? (activeModule.reportTypes.find((t) => t.key === detailId) ?? activeModule.reportTypes[0])
    : undefined;
  const rawRows = reportType ? (reportRows[reportType.key] ?? []) : [];
  const columns = Object.keys(rawRows[0] ?? { id: 0 }).filter((key) => key !== "id");
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("2026-01-01");
  const [toDate, setToDate] = useState("2026-12-31");

  const rows = rawRows.filter(
    (row) => !search || JSON.stringify(row).toLowerCase().includes(search.toLowerCase()),
  );

  if (!activeModule) {
    return (
      <>
        <PageHeader
          title="Reports"
          subtitle="Every verified report family in the source application"
        >
          <span className="rms-chip">{reportModules.length} modules</span>
        </PageHeader>
        <div className="rms-grid cols-3">
          {reportModules.map((mod) => (
            <button
              key={mod.key}
              type="button"
              className="rms-project-card"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => onNavigate(`/reports/${mod.key}`)}
            >
              <span style={{ color: mod.color }}>
                {ICONS[mod.icon] ?? <FileBarChart size={18} />}
              </span>
              <h3>{mod.label}</h3>
              <p>{mod.description}</p>
              <span className="rms-chip">{mod.reportTypes.length} report types</span>
            </button>
          ))}
        </div>
        <div style={{ display: "none" }}>{module.label}</div>
      </>
    );
  }

  if (!detailId) {
    return (
      <>
        <PageHeader title={activeModule.label} subtitle={activeModule.description}>
          <button
            type="button"
            className="rms-btn is-secondary"
            onClick={() => onNavigate("/reports")}
          >
            <ArrowLeft size={13} />
            All Reports
          </button>
        </PageHeader>
        <div className="rms-grid cols-2">
          {activeModule.reportTypes.map((type) => (
            <button
              key={type.key}
              type="button"
              className="rms-project-card"
              style={{ textAlign: "left", cursor: "pointer" }}
              onClick={() => onNavigate(`/reports/${activeModule.key}/${type.key}`)}
            >
              <h3>{type.label}</h3>
              <p>{type.description}</p>
              <span className="rms-chip">Open report →</span>
            </button>
          ))}
        </div>
      </>
    );
  }

  if (!reportType) return null;

  return (
    <>
      <PageHeader
        title={reportType.label}
        subtitle={`${activeModule.label} · ${reportType.description}`}
      >
        <button
          type="button"
          className="rms-btn is-secondary"
          onClick={() => onNavigate(`/reports/${activeModule.key}`)}
        >
          <ArrowLeft size={13} />
          Back
        </button>
        <DisabledAction>Export</DisabledAction>
      </PageHeader>

      <Card
        className="rms-report-filters"
        title="Report Filters"
        subtitle="Filters apply locally to the deterministic sample rows"
      >
        <div className="rms-filter-row" style={{ marginBottom: 8 }}>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              color: "var(--rms-text-secondary)",
            }}
          >
            From
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{
                height: 30,
                border: "1px solid var(--rms-border)",
                background: "transparent",
                color: "var(--rms-text)",
                borderRadius: 7,
                padding: "0 7px",
                fontSize: 10,
              }}
            />
          </label>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 10,
              color: "var(--rms-text-secondary)",
            }}
          >
            To
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{
                height: 30,
                border: "1px solid var(--rms-border)",
                background: "transparent",
                color: "var(--rms-text)",
                borderRadius: 7,
                padding: "0 7px",
                fontSize: 10,
              }}
            />
          </label>
          <label className="rms-search" style={{ maxWidth: 240, height: 30 }}>
            <Search size={14} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter report rows..."
            />
          </label>
        </div>
        <div className="rms-summary-strip" style={{ marginTop: 4 }}>
          <div>
            <div>
              <strong>{rows.length}</strong>
              <span>Rows</span>
            </div>
          </div>
          <div>
            <div>
              <strong>{columns.length}</strong>
              <span>Columns</span>
            </div>
          </div>
          <div>
            <div>
              <strong>{fmtDate(fromDate)}</strong>
              <span>Period start</span>
            </div>
          </div>
          <div>
            <div>
              <strong>{fmtDate(toDate)}</strong>
              <span>Period end</span>
            </div>
          </div>
        </div>
      </Card>

      <div style={{ marginTop: 10 }}>
        <DataTable
          data={rows}
          searchPlaceholder="Search report rows..."
          pageSizeDefault={25}
          columns={columns.map((key) => ({
            key,
            label: labelize(key),
            align: typeof rawRows[0]?.[key] === "number" ? "right" : "left",
            render: (row) => renderReportCell(key, row[key]),
          }))}
        />
      </div>
      <div
        style={{
          marginTop: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 9,
          color: "var(--rms-text-muted)",
        }}
      >
        <ShieldCheck size={12} /> Report totals are computed from fictional demo records only.
      </div>
    </>
  );
}

function renderReportCell(key: string, value: unknown) {
  if (value == null || value === "") return <span className="rms-muted">—</span>;
  if (
    key === "status" ||
    key === "payment_status" ||
    key === "result" ||
    key === "employment_status"
  ) {
    return <StatusBadge status={String(value)} />;
  }
  if (typeof value === "number") {
    if (/date/i.test(key)) return String(value);
    if (
      /price|amount|budget|spent|variance|rent|balance|salary|revenue|cost|value|paid|debit|credit/i.test(
        key,
      )
    )
      return fmtMoney(value);
    return value.toLocaleString("en-US");
  }
  if (/date/i.test(key)) return fmtDate(String(value));
  return String(value);
}
