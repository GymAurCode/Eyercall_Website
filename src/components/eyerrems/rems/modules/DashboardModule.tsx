import {
  BellRing,
  Building2,
  ChartNoAxesColumnIncreasing,
  CheckCircle2,
  DoorOpen,
  Receipt,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { dashboard, fmtMoney, type NavModule } from "../data";
import {
  BarChart,
  Card,
  DisabledAction,
  Donut,
  Funnel,
  PageHeader,
  StatCard,
  StatusBadge,
  fmtShortCompact,
} from "../ui";

export default function DashboardModule({ module }: { module: NavModule }) {
  const stats = dashboard.stats;
  const occupiedPct = Math.round((stats.occupied_units / stats.total_units) * 100);

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Real-time overview of your portfolio">
        <span className="rms-chip">November 2026</span>
        <DisabledAction>Refresh</DisabledAction>
      </PageHeader>

      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        <StatCard
          label="Total Properties"
          value={stats.total_properties}
          hint={`${stats.total_units} units`}
          icon={<Building2 size={15} />}
        />
        <StatCard
          label="Total Income"
          value={fmtMoney(stats.income)}
          hint={`${fmtMoney(stats.expense)} expenses`}
          icon={<Wallet size={15} />}
          tone="green"
        />
        <StatCard
          label="Vacant Units"
          value={stats.vacant_units}
          hint={`${stats.active_deals} active deals`}
          icon={<DoorOpen size={15} />}
          tone="blue"
        />
        <StatCard
          label="Occupied Units"
          value={stats.occupied_units}
          hint={`${occupiedPct}% occupancy`}
          icon={<Users size={15} />}
          tone="green"
        />
      </div>

      <div className="rms-split" style={{ marginBottom: 10 }}>
        <Card
          title="Income &amp; Expenses"
          subtitle="Last six months"
          action={
            <span className="rms-chip">
              <ChartNoAxesColumnIncreasing size={12} /> +14.2%
            </span>
          }
        >
          <BarChart
            data={dashboard.monthly}
            format={fmtShortCompact}
            series={[
              { key: "income", label: "Income", color: "#f6ce3a" },
              { key: "expense", label: "Expenses", color: "#ef4444" },
            ]}
          />
        </Card>
        <Card title="Portfolio Occupancy" subtitle="Units by current state">
          <Donut
            segments={[
              { label: "Occupied", value: stats.occupied_units, color: "#f6ce3a" },
              { label: "Vacant", value: stats.vacant_units, color: "#1b3636" },
            ]}
            centerValue={`${occupiedPct}%`}
            centerLabel="occupied"
          />
        </Card>
      </div>

      <div className="rms-split" style={{ marginBottom: 10 }}>
        <Card title="Sales Pipeline" subtitle="Leads by current stage">
          <Funnel rows={dashboard.pipeline} />
        </Card>
        <Card title="Recent Activity" subtitle="Latest workspace events">
          <ul className="rms-activity">
            {dashboard.activity.map((item) => (
              <li key={item.title}>
                <span className="rms-activity-dot" style={{ background: item.color }} />
                <div>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </div>
                <time>{item.time}</time>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="rms-split">
        <Card
          title="Quick Actions"
          subtitle="Source controls are shown; mutations are disabled in demo mode"
        >
          <div className="rms-grid cols-3">
            {[
              { label: "Add Property", icon: <Building2 size={15} /> },
              { label: "New Lease", icon: <CheckCircle2 size={15} /> },
              { label: "Add Tenant", icon: <Users size={15} /> },
              { label: "Collect Rent", icon: <Wallet size={15} /> },
              { label: "Maintenance Request", icon: <BellRing size={15} /> },
              { label: "View Reports", icon: <Receipt size={15} /> },
            ].map((action) => (
              <button
                key={action.label}
                type="button"
                className="rms-project-card"
                disabled
                title="Unavailable in Demo Mode — this action would change business data."
              >
                <span style={{ color: "var(--rms-accent)" }}>{action.icon}</span>
                <span style={{ fontSize: 10 }}>{action.label}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Needs Attention" subtitle="Fixed sample counts">
          <div className="rms-alert-grid" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>
            {dashboard.alerts.map((alert) => (
              <div key={alert.label} className="rms-alert">
                <strong>{alert.value}</strong>
                <span>{alert.label}</span>
              </div>
            ))}
          </div>
          <div
            style={{
              marginTop: 10,
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 10,
              color: "var(--rms-text-muted)",
            }}
          >
            <TrendingUp size={13} /> All figures are deterministic fictional demo data.
          </div>
        </Card>
      </div>

      <div style={{ display: "none" }}>
        {module.label}
        <StatusBadge status="active" />
      </div>
    </>
  );
}
