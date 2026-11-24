import { useState } from "react";
import { Building2, CircleDollarSign, Clock, Home, Users, Wrench } from "lucide-react";
import { fmtDate, fmtMoney, maintenance, tenants, type NavModule } from "../data";
import {
  Card,
  DataTable,
  DetailDrawer,
  DisabledAction,
  PageHeader,
  PrimaryButton,
  StatCard,
  StatusBadge,
  SummaryStrip,
  labelize,
  money,
} from "../ui";

export function TenantsModule({
  detailId,
  onNavigate,
}: {
  module: NavModule;
  detailId?: string | undefined;
  onNavigate: (path: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  if (detailId) {
    const tenant = tenants.find((t) => String(t.id) === detailId) ?? tenants[0]!;
    return (
      <>
        <PageHeader title={tenant.name} subtitle={`${tenant.tenant_id} · ${tenant.property_name}`}>
          <button
            type="button"
            className="rms-btn is-secondary"
            onClick={() => onNavigate("/tenants")}
          >
            ← Back to Tenants
          </button>
          <DisabledAction>Edit Tenant</DisabledAction>
        </PageHeader>
        <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
          <StatCard
            label="Monthly Rent"
            value={fmtMoney(tenant.monthly_rent)}
            icon={<CircleDollarSign size={15} />}
          />
          <StatCard
            label="Property"
            value={tenant.property_name}
            icon={<Building2 size={15} />}
            tone="blue"
          />
          <StatCard
            label="Unit"
            value={tenant.unit_number}
            icon={<Home size={15} />}
            tone="violet"
          />
          <StatCard
            label="Status"
            value={tenant.is_active ? "Active" : "Ended"}
            icon={<Users size={15} />}
            tone={tenant.is_active ? "green" : "red"}
          />
        </div>
        <div className="rms-split">
          <Card title="Tenant Information">
            <dl className="rms-kv">
              <div>
                <dt>Tenant ID</dt>
                <dd className="rms-mono">{tenant.tenant_id}</dd>
              </div>
              <div>
                <dt>Name</dt>
                <dd>{tenant.name}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>{tenant.phone}</dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>{tenant.email}</dd>
              </div>
              <div>
                <dt>Property</dt>
                <dd>{tenant.property_name}</dd>
              </div>
              <div>
                <dt>Unit</dt>
                <dd>{tenant.unit_number}</dd>
              </div>
              <div>
                <dt>Lease start</dt>
                <dd>{fmtDate(tenant.lease_start)}</dd>
              </div>
              <div>
                <dt>Lease end</dt>
                <dd>{fmtDate(tenant.lease_end)}</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={tenant.is_active ? "Active" : "Ended"} />
                </dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>{fmtDate(tenant.created_at)}</dd>
              </div>
            </dl>
          </Card>
          <Card title="Related Records">
            <ul className="rms-list">
              <li>
                <div className="rms-list-main">
                  <strong>Lease agreement</strong>
                  <span>
                    {fmtDate(tenant.lease_start)} → {fmtDate(tenant.lease_end)}
                  </span>
                </div>
                <StatusBadge status={tenant.is_active ? "Active" : "Ended"} />
              </li>
              <li>
                <div className="rms-list-main">
                  <strong>Rent invoices</strong>
                  <span>6 posted invoices in this sample period</span>
                </div>
                <StatusBadge status="paid" />
              </li>
              <li>
                <div className="rms-list-main">
                  <strong>Maintenance requests</strong>
                  <span>2 work orders linked to this unit</span>
                </div>
                <StatusBadge status="completed" />
              </li>
            </ul>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader title="Tenants" subtitle="Tenant register and lease associations">
        <DisabledAction>Import</DisabledAction>
        <PrimaryButton>Add Tenant</PrimaryButton>
      </PageHeader>
      <SummaryStrip
        items={[
          { label: "Total tenants", value: tenants.length, icon: <Users size={14} /> },
          {
            label: "Active",
            value: tenants.filter((t) => t.is_active).length,
            icon: <Users size={14} />,
            tone: "var(--rms-green)",
          },
          {
            label: "Ended",
            value: tenants.filter((t) => !t.is_active).length,
            icon: <Users size={14} />,
            tone: "var(--rms-text-muted)",
          },
          {
            label: "Monthly rent roll",
            value: fmtMoney(tenants.reduce((s, t) => s + t.monthly_rent, 0)),
            tone: "var(--rms-accent)",
          },
        ]}
      />
      <div style={{ marginTop: 10 }}>
        <DataTable
          data={tenants}
          searchPlaceholder="Search tenants..."
          filters={[
            {
              key: "is_active",
              label: "Statuses",
              options: [
                { value: "true", label: "Active" },
                { value: "false", label: "Ended" },
              ],
              value: (r) => String(r.is_active),
            },
          ]}
          onRowClick={(row) => onNavigate(`/tenants/${row.id}`)}
          columns={[
            {
              key: "tenant_id",
              label: "Tenant ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.tenant_id)}
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
            { key: "email", label: "Email" },
            { key: "property_name", label: "Property" },
            { key: "unit_number", label: "Unit" },
            { key: "lease_end", label: "Lease End", render: (r) => fmtDate(String(r.lease_end)) },
            {
              key: "monthly_rent",
              label: "Rent",
              align: "right",
              render: (r) => money(Number(r.monthly_rent)),
            },
            {
              key: "is_active",
              label: "Status",
              render: (r) => <StatusBadge status={r.is_active ? "Active" : "Ended"} />,
            },
          ]}
        />
      </div>
      <DetailDrawer
        open={Boolean(selected)}
        title={String(selected?.["name"] ?? "Tenant")}
        subtitle="Tenant record"
        onClose={() => setSelected(null)}
        fields={[]}
      />
    </>
  );
}

const MAINTENANCE_SUMMARY = [
  { key: "pending", label: "Pending", color: "#f59e0b" },
  { key: "assigned", label: "Assigned", color: "#3b82f6" },
  { key: "in_progress", label: "In Progress", color: "#8b5cf6" },
  { key: "completed", label: "Completed", color: "#10b981" },
  { key: "cancelled", label: "Cancelled", color: "#64748b" },
];

export function MaintenanceModule() {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  return (
    <>
      <PageHeader title="Maintenance" subtitle="Work orders, assignments and cost tracking">
        <DisabledAction>Export</DisabledAction>
        <PrimaryButton>New Request</PrimaryButton>
      </PageHeader>

      <div className="rms-grid cols-5" style={{ marginBottom: 10 }}>
        {MAINTENANCE_SUMMARY.map((status) => (
          <StatCard
            key={status.key}
            label={status.label}
            value={maintenance.filter((m) => m.status === status.key).length}
            hint={`${Math.round((maintenance.filter((m) => m.status === status.key).length / maintenance.length) * 100)}% of total`}
            icon={<Wrench size={15} />}
            tone={
              status.key === "completed"
                ? "green"
                : status.key === "pending"
                  ? "amber"
                  : status.key === "in_progress"
                    ? "violet"
                    : status.key === "assigned"
                      ? "blue"
                      : "teal"
            }
          />
        ))}
      </div>

      <SummaryStrip
        items={[
          {
            label: "Estimated cost",
            value: fmtMoney(maintenance.reduce((s, m) => s + m.estimated_cost, 0)),
            icon: <Clock size={14} />,
            tone: "var(--rms-amber)",
          },
          {
            label: "Actual cost",
            value: fmtMoney(maintenance.reduce((s, m) => s + m.actual_cost, 0)),
            icon: <CircleDollarSign size={14} />,
            tone: "var(--rms-green)",
          },
          {
            label: "Unassigned",
            value: maintenance.filter((m) => !m.assigned_name).length,
            icon: <Users size={14} />,
            tone: "var(--rms-danger)",
          },
          {
            label: "Completed",
            value: maintenance.filter((m) => m.status === "completed").length,
            icon: <Wrench size={14} />,
            tone: "var(--rms-green)",
          },
        ]}
      />

      <div style={{ marginTop: 10 }}>
        <DataTable
          data={maintenance}
          searchPlaceholder="Search work orders..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: MAINTENANCE_SUMMARY.map((s) => ({ value: s.key, label: s.label })),
            },
            {
              key: "priority",
              label: "Priorities",
              options: ["low", "normal", "high", "urgent"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
            {
              key: "category",
              label: "Categories",
              options: [...new Set(maintenance.map((m) => m.category))].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "request_id",
              label: "Request ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.request_id)}
                </span>
              ),
            },
            {
              key: "date",
              label: "Date",
              render: (r) => (
                <span style={{ whiteSpace: "nowrap" }}>{fmtDate(String(r.date))}</span>
              ),
            },
            {
              key: "property_name",
              label: "Property",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.property_name)}
                </strong>
              ),
            },
            {
              key: "unit_number",
              label: "Unit",
              render: (r) =>
                r.unit_number ? String(r.unit_number) : <span className="rms-muted">—</span>,
            },
            {
              key: "title",
              label: "Title / Description",
              render: (r) => <span title={String(r.description)}>{String(r.title)}</span>,
            },
            {
              key: "category",
              label: "Category",
              render: (r) => (
                <StatusBadge status={String(r.category)} label={labelize(String(r.category))} />
              ),
            },
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
            {
              key: "assigned_name",
              label: "Assigned",
              render: (r) =>
                r.assigned_name ? (
                  String(r.assigned_name)
                ) : (
                  <span className="rms-muted">Unassigned</span>
                ),
            },
            {
              key: "estimated_cost",
              label: "Est. Cost",
              align: "right",
              render: (r) => money(Number(r.estimated_cost)),
            },
          ]}
        />
      </div>

      <DetailDrawer
        open={Boolean(selected)}
        title={String(selected?.["title"] ?? "Work order")}
        subtitle={`${String(selected?.["request_id"] ?? "")} · Maintenance request`}
        onClose={() => setSelected(null)}
        fields={[
          {
            label: "Status",
            value: <StatusBadge status={String(selected?.["status"] ?? "pending")} />,
          },
          {
            label: "Priority",
            value: <StatusBadge status={String(selected?.["priority"] ?? "normal")} />,
          },
          { label: "Property", value: String(selected?.["property_name"] ?? "—") },
          { label: "Unit", value: String(selected?.["unit_number"] ?? "Whole property") },
          { label: "Category", value: labelize(String(selected?.["category"] ?? "—")) },
          { label: "Reported", value: fmtDate(String(selected?.["date"] ?? "")) },
          { label: "Assigned to", value: String(selected?.["assigned_name"] ?? "Unassigned") },
          { label: "Tenant", value: String(selected?.["tenant_name"] ?? "—") },
          { label: "Estimated cost", value: money(Number(selected?.["estimated_cost"] ?? 0)) },
          { label: "Actual cost", value: money(Number(selected?.["actual_cost"] ?? 0)) },
        ]}
        sections={[
          {
            title: "Description",
            fields: [{ label: "Reported issue", value: String(selected?.["description"] ?? "—") }],
          },
        ]}
      />
    </>
  );
}
