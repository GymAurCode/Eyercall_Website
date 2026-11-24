import { useState } from "react";
import {
  AlertTriangle,
  Award,
  CalendarCheck,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import {
  bookings,
  clients,
  crmDashboard,
  crmPayments,
  dealers,
  deals,
  followUps,
  fmtDate,
  fmtMoney,
  leads,
  siteVisits,
  type NavModule,
} from "../data";
import {
  BarChart,
  Card,
  DataTable,
  DetailDrawer,
  DisabledAction,
  Donut,
  Funnel,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  StatCard,
  StatusBadge,
  SummaryStrip,
  fmtShortCompact,
  labelize,
  money,
  type Column,
} from "../ui";

const DONUT_COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ef4444", "#06b6d4"];

export default function CrmModule({
  module,
  tab,
  onNavigate,
  detailId,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
  detailId?: string | undefined;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  if (detailId) {
    const entity = tab || "leads";
    const source =
      entity === "clients"
        ? clients
        : entity === "dealers"
          ? dealers
          : entity === "deals"
            ? deals
            : entity === "bookings"
              ? bookings
              : leads;
    const record =
      source.find((row) => String((row as { id?: number }).id) === detailId) ?? source[0]!;
    return (
      <>
        <PageHeader
          title={`${labelize(entity)} ${"lead_id" in record ? (record as (typeof leads)[number]).lead_id : "record"}`}
          subtitle="Read-only detail view"
        >
          <button
            type="button"
            className="rms-btn is-secondary"
            onClick={() => onNavigate(`/crm/${entity}`)}
          >
            ← Back
          </button>
        </PageHeader>
        <Card title="Record Information">
          <dl className="rms-kv">
            {Object.entries(record)
              .filter(([k]) => k !== "id")
              .map(([key, value]) => (
                <div key={key}>
                  <dt>{labelize(key)}</dt>
                  <dd>{typeof value === "number" ? money(value) : String(value ?? "—")}</dd>
                </div>
              ))}
          </dl>
        </Card>
        <div style={{ marginTop: 10 }}>
          <DetailDrawer
            open
            title="Related Activity"
            subtitle="Read-only"
            onClose={() => onNavigate(`/crm/${entity}`)}
            fields={[
              { label: "Status", value: <StatusBadge status="active" /> },
              { label: "Mode", value: "Read only" },
            ]}
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="CRM" subtitle="Leads, clients, dealers, deals, bookings and collections">
        <DisabledAction>Import</DisabledAction>
        <PrimaryButton>Add Lead</PrimaryButton>
      </PageHeader>

      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/crm/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <CrmDashboard />}
      {tab === "leads" && (
        <DataTable
          data={leads}
          searchPlaceholder="Search leads..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: [...new Set(leads.map((l) => l.status))].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
            {
              key: "source",
              label: "Sources",
              options: [...new Set(leads.map((l) => l.source))].map((v) => ({
                value: v,
                label: v,
              })),
            },
          ]}
          onRowClick={(row) => onNavigate(`/crm/leads/${row.id}`)}
          columns={[
            {
              key: "lead_id",
              label: "Lead ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.lead_id)}
                </span>
              ),
            },
            {
              key: "tracking_id",
              label: "Tracking ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.tracking_id)}
                </span>
              ),
            },
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "phone", label: "Phone" },
            { key: "source", label: "Source" },
            { key: "assigned_to", label: "Assigned" },
            {
              key: "budget",
              label: "Budget",
              align: "right",
              render: (r) => money(Number(r.budget)),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "clients" && (
        <DataTable
          data={clients}
          searchPlaceholder="Search clients..."
          filters={[
            {
              key: "type",
              label: "Types",
              options: [...new Set(clients.map((c) => c.type))].map((v) => ({
                value: v,
                label: v,
              })),
            },
          ]}
          onRowClick={(row) => onNavigate(`/crm/clients/${row.id}`)}
          columns={[
            {
              key: "tracking_id",
              label: "Tracking ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.tracking_id)}
                </span>
              ),
            },
            {
              key: "client_id",
              label: "Client ID",
              render: (r) => <span className="rms-mono">{String(r.client_id)}</span>,
            },
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "phone", label: "Phone" },
            { key: "type", label: "Type" },
            { key: "city", label: "City" },
            { key: "total_deals", label: "Deals", align: "right" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "dealers" && (
        <DataTable
          data={dealers}
          searchPlaceholder="Search dealers..."
          onRowClick={(row) => onNavigate(`/crm/dealers/${row.id}`)}
          columns={[
            {
              key: "dealer_id",
              label: "Dealer ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.dealer_id)}
                </span>
              ),
            },
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "company", label: "Company" },
            { key: "phone", label: "Phone" },
            { key: "city", label: "City" },
            { key: "total_deals", label: "Deals", align: "right" },
            { key: "commission_rate", label: "Commission", render: (r) => `${r.commission_rate}%` },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "deals" && (
        <DataTable
          data={deals}
          searchPlaceholder="Search deals..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["open", "won", "lost"].map((v) => ({ value: v, label: labelize(v) })),
            },
            {
              key: "stage",
              label: "Stages",
              options: [...new Set(deals.map((d) => d.stage))].map((v) => ({ value: v, label: v })),
            },
          ]}
          onRowClick={(row) => onNavigate(`/crm/deals/${row.id}`)}
          columns={[
            {
              key: "tracking_id",
              label: "Tracking ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.tracking_id)}
                </span>
              ),
            },
            {
              key: "deal_id",
              label: "Deal ID",
              render: (r) => <span className="rms-mono">{String(r.deal_id)}</span>,
            },
            { key: "deal_title", label: "Title" },
            { key: "client_name", label: "Client" },
            {
              key: "deal_value",
              label: "Value",
              align: "right",
              render: (r) => money(Number(r.deal_value)),
            },
            {
              key: "paid_amount",
              label: "Paid",
              align: "right",
              render: (r) => money(Number(r.paid_amount)),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "bookings" && (
        <DataTable
          data={bookings}
          searchPlaceholder="Search bookings..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: [...new Set(bookings.map((b) => b.status))].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={(row) => onNavigate(`/crm/bookings/${row.id}`)}
          columns={[
            {
              key: "booking_id",
              label: "Booking ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.booking_id)}
                </span>
              ),
            },
            {
              key: "client_name",
              label: "Client",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.client_name)}
                </strong>
              ),
            },
            { key: "property_name", label: "Property" },
            { key: "unit_number", label: "Unit" },
            {
              key: "booking_amount",
              label: "Booking Amt",
              align: "right",
              render: (r) => money(Number(r.booking_amount)),
            },
            { key: "expiry_date", label: "Expiry", render: (r) => fmtDate(String(r.expiry_date)) },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "follow-ups" && (
        <DataTable
          data={followUps}
          searchPlaceholder="Search follow-ups..."
          filters={[
            {
              key: "priority",
              label: "Priorities",
              options: ["High", "Medium", "Low"].map((v) => ({ value: v, label: v })),
            },
            {
              key: "status",
              label: "Statuses",
              options: ["pending", "completed", "overdue"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "followup_id",
              label: "Follow-up ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.followup_id)}
                </span>
              ),
            },
            {
              key: "contact_name",
              label: "Contact",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.contact_name)}
                </strong>
              ),
            },
            { key: "subject", label: "Subject" },
            { key: "channel", label: "Channel" },
            { key: "owner", label: "Owner" },
            { key: "due_date", label: "Due", render: (r) => fmtDate(String(r.due_date)) },
            {
              key: "priority",
              label: "Priority",
              render: (r) => <StatusBadge status={String(r.priority)} />,
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "site-visits" && (
        <DataTable
          data={siteVisits}
          searchPlaceholder="Search site visits..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: [...new Set(siteVisits.map((v) => v.status))].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "visit_id",
              label: "Visit ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.visit_id)}
                </span>
              ),
            },
            {
              key: "client_name",
              label: "Client",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.client_name)}
                </strong>
              ),
            },
            { key: "property_name", label: "Property" },
            { key: "agent", label: "Agent" },
            {
              key: "scheduled_date",
              label: "Scheduled",
              render: (r) => fmtDate(String(r.scheduled_date)),
            },
            { key: "scheduled_time", label: "Time" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "payments" && (
        <DataTable
          data={crmPayments}
          searchPlaceholder="Search payments..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: [...new Set(crmPayments.map((p) => p.status))].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "payment_id",
              label: "Payment ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.payment_id)}
                </span>
              ),
            },
            {
              key: "payer",
              label: "Payer",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.payer)}
                </strong>
              ),
            },
            { key: "deal_id", label: "Deal Ref" },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              render: (r) => money(Number(r.amount)),
            },
            { key: "method", label: "Method" },
            { key: "payment_date", label: "Date", render: (r) => fmtDate(String(r.payment_date)) },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      <DetailDrawer
        open={Boolean(selected)}
        title={String(
          selected?.["contact_name"] ??
            selected?.["client_name"] ??
            selected?.["payment_id"] ??
            "Record",
        )}
        subtitle="CRM record"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([key]) => key !== "id")
          .map(([key, value]) => ({
            label: labelize(key),
            value:
              typeof value === "number" && /amount|budget|value/i.test(key)
                ? money(value)
                : String(value ?? "—"),
          }))}
      />
    </>
  );
}

function CrmDashboard() {
  const stats = crmDashboard.stats;
  const kpis = [
    {
      label: "Total Leads",
      value: stats.total_leads,
      icon: <Users size={15} />,
      tone: "blue" as const,
    },
    {
      label: "New Leads",
      value: stats.new_leads,
      icon: <UserPlus size={15} />,
      tone: "violet" as const,
    },
    {
      label: "Active Clients",
      value: stats.active_clients,
      icon: <UserCheck size={15} />,
      tone: "green" as const,
    },
    {
      label: "Total Deals",
      value: stats.total_deals,
      icon: <TrendingUp size={15} />,
      tone: "amber" as const,
    },
    {
      label: "Won Deals",
      value: stats.won_deals,
      icon: <Award size={15} />,
      tone: "green" as const,
    },
    {
      label: "Lost Deals",
      value: stats.lost_deals,
      icon: <XCircle size={15} />,
      tone: "red" as const,
    },
    {
      label: "Bookings",
      value: stats.total_bookings,
      icon: <CalendarCheck size={15} />,
      tone: "blue" as const,
    },
    {
      label: "Revenue",
      value: fmtShortCompact(stats.revenue),
      icon: <DollarSign size={15} />,
      tone: "green" as const,
    },
    {
      label: "Pending Revenue",
      value: fmtShortCompact(stats.pending_revenue),
      icon: <Clock size={15} />,
      tone: "amber" as const,
    },
    {
      label: "Overdue Installments",
      value: stats.overdue_installments,
      icon: <AlertTriangle size={15} />,
      tone: "red" as const,
    },
  ];

  return (
    <>
      <SummaryStrip
        items={[
          {
            label: "Win rate",
            value: `${Math.round((stats.won_deals / stats.total_deals) * 100)}%`,
            tone: "var(--rms-green)",
          },
          {
            label: "Avg deal size",
            value: fmtMoney(Math.round(stats.revenue / stats.won_deals)),
            tone: "var(--rms-accent)",
          },
          { label: "Avg lead age", value: `${stats.avg_lead_age} days`, tone: "var(--rms-blue)" },
          {
            label: "Conversion",
            value: `${Math.round((stats.won_deals / stats.total_leads) * 100)}%`,
            tone: "var(--rms-violet)",
          },
        ]}
      />
      <div className="rms-grid cols-5" style={{ margin: "10px 0" }}>
        {kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            tone={kpi.tone}
          />
        ))}
      </div>

      <div className="rms-split" style={{ marginBottom: 10 }}>
        <Card title="Conversion Funnel" subtitle="Lead progression across pipeline stages">
          <Funnel rows={crmDashboard.conversion_funnel} />
        </Card>
        <Card title="Lead Sources" subtitle="Where leads originate">
          <Donut
            segments={crmDashboard.lead_source_distribution.map((s, i) => ({
              label: s.source,
              value: s.count,
              color: DONUT_COLORS[i % DONUT_COLORS.length]!,
            }))}
            centerLabel="leads"
          />
        </Card>
      </div>

      <div className="rms-split" style={{ marginBottom: 10 }}>
        <Card title="Deal Value &amp; Count" subtitle="Sample monthly performance">
          <BarChart
            data={[
              { month: "Jun", count: 6, value: 12_400_000 },
              { month: "Jul", count: 8, value: 16_800_000 },
              { month: "Aug", count: 7, value: 14_200_000 },
              { month: "Sep", count: 10, value: 21_600_000 },
              { month: "Oct", count: 9, value: 19_400_000 },
              { month: "Nov", count: 12, value: 26_800_000 },
            ]}
            format={fmtShortCompact}
            series={[
              { key: "count", label: "Deals", color: "#3b82f6" },
              { key: "value", label: "Value", color: "#10b981" },
            ]}
          />
        </Card>
        <Card title="Dealer Performance" subtitle="Top dealers by deals">
          <ul className="rms-list">
            {dealers.slice(0, 5).map((dealer) => (
              <li key={dealer.id}>
                <div className="rms-list-main">
                  <strong>{dealer.name}</strong>
                  <span>
                    {dealer.company} · {dealer.commission_rate}% commission
                  </span>
                </div>
                <div style={{ width: 90 }}>
                  <ProgressBar value={dealer.total_deals} max={8} label={`${dealer.total_deals}`} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="rms-split">
        <Card title="Recent Activity" subtitle="Latest CRM events">
          <ul className="rms-activity">
            {crmDashboard.recent_activities.map((item) => (
              <li key={item.description}>
                <span className="rms-activity-dot" style={{ background: "#3b82f6" }} />
                <div>
                  <strong>{labelize(item.action)}</strong>
                  <span>{item.description}</span>
                </div>
                <time>{new Date(item.created_at).toLocaleDateString()}</time>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Pipeline Summary" subtitle="Open opportunities">
          <dl className="rms-kv">
            <div>
              <dt>Open deals</dt>
              <dd>8</dd>
            </div>
            <div>
              <dt>Won this month</dt>
              <dd>4</dd>
            </div>
            <div>
              <dt>Lost this month</dt>
              <dd>2</dd>
            </div>
            <div>
              <dt>Follow-ups due</dt>
              <dd>6</dd>
            </div>
            <div>
              <dt>Visits scheduled</dt>
              <dd>3</dd>
            </div>
            <div>
              <dt>Bookings pending</dt>
              <dd>5</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}
