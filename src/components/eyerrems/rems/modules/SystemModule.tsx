import { useMemo, useState } from "react";
import {
  Database,
  Grid3X3,
  History,
  RotateCcw,
  Settings,
  Shield,
  Smartphone,
  Table2,
  Trash2,
  Users,
} from "lucide-react";
import {
  auditLogs,
  fmtDate,
  history,
  recycleBin,
  roles,
  sheets,
  users,
  type NavModule,
} from "../data";
import {
  Card,
  DataTable,
  DetailDrawer,
  DisabledAction,
  PageHeader,
  PrimaryButton,
  StatusBadge,
  SummaryStrip,
  labelize,
} from "../ui";

/* ────────────────────────── spreadsheet ────────────────────────── */

export function SpreadsheetModule() {
  const [selectedSheet, setSelectedSheet] = useState(sheets[0]!.id);
  const sheet = sheets.find((s) => s.id === selectedSheet) ?? sheets[0]!;
  const rows = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i + 1,
        unit: `${String.fromCharCode(65 + (i % 3))}-10${i + 1}`,
        property: ["Cedar Court Residency", "Emerald Heights", "Palm Grove Apartments"][i % 3]!,
        tenant: `Fictional Tenant ${String.fromCharCode(65 + (i % 8))}`,
        rent: 65_000 + i * 4_500,
        status: i % 5 === 0 ? "Vacant" : "Occupied",
        lease_end: `2027-0${(i % 9) + 1}-15`,
      })),
    [],
  );

  return (
    <>
      <PageHeader title="Spreadsheet" subtitle="Read-only workbook workspace">
        <span className="rms-chip">{sheet.sheet}</span>
        <DisabledAction>Save</DisabledAction>
      </PageHeader>
      <SummaryStrip
        items={[
          { label: "Workbooks", value: sheets.length, icon: <Table2 size={14} /> },
          {
            label: "Rows",
            value: sheet.rows,
            icon: <Grid3X3 size={14} />,
            tone: "var(--rms-blue)",
          },
          {
            label: "Columns",
            value: sheet.columns,
            icon: <Grid3X3 size={14} />,
            tone: "var(--rms-violet)",
          },
          { label: "Last updated", value: fmtDate(sheet.updated), tone: "var(--rms-accent)" },
        ]}
      />
      <div className="rms-split" style={{ marginTop: 10 }}>
        <Card
          title="Workbook"
          subtitle="Cells are rendered read-only; no editing or saving is possible"
        >
          <div className="rms-toolbar-line">
            <strong style={{ fontSize: 12 }}>{sheet.sheet}</strong>
            <span className="rms-chip">A1:H19</span>
          </div>
          <div className="rms-table-scroll" style={{ maxHeight: 460, overflowY: "auto" }}>
            <table className="rms-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Unit</th>
                  <th>Property</th>
                  <th>Tenant</th>
                  <th style={{ textAlign: "right" }}>Rent</th>
                  <th>Status</th>
                  <th>Lease End</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    <td className="rms-mono">{row.id}</td>
                    <td>{row.unit}</td>
                    <td>{row.property}</td>
                    <td>{row.tenant}</td>
                    <td style={{ textAlign: "right" }}>{row.rent.toLocaleString()}</td>
                    <td>
                      <StatusBadge status={row.status} />
                    </td>
                    <td>{row.lease_end}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
        <Card title="Workbooks" subtitle="Available sample sheets">
          <ul className="rms-list">
            {sheets.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setSelectedSheet(item.id)}
                  style={{
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    gap: 8,
                    background: "transparent",
                    border: 0,
                    textAlign: "left",
                    color: "inherit",
                  }}
                >
                  <Table2
                    size={14}
                    style={{
                      color:
                        item.id === selectedSheet ? "var(--rms-accent)" : "var(--rms-text-muted)",
                    }}
                  />
                  <div className="rms-list-main">
                    <strong>{item.sheet}</strong>
                    <span>
                      {item.rows} rows · {item.columns} columns
                    </span>
                  </div>
                  <StatusBadge status={item.status} />
                </button>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

/* ────────────────────────── settings ────────────────────────── */

export function SettingsModule({
  module,
  tab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Company preferences, backup, recycle bin and mobile sync"
      />
      <div className="rms-settings-layout">
        <div className="rms-settings-nav">
          {module.tabs?.map((t) => (
            <button
              key={t.id}
              type="button"
              className={tab === t.id ? "is-active" : ""}
              onClick={() => onNavigate(`/settings/${t.id}`)}
            >
              {t.id === "general" ? (
                <Settings size={14} />
              ) : t.id === "backup" ? (
                <Database size={14} />
              ) : t.id === "recycle-bin" ? (
                <Trash2 size={14} />
              ) : (
                <Smartphone size={14} />
              )}
              {t.label}
            </button>
          ))}
        </div>

        {tab === "general" && (
          <div className="rms-stack">
            <Card title="Company Profile" subtitle="Read-only company configuration">
              <dl className="rms-kv">
                <div>
                  <dt>Company name</dt>
                  <dd>Eyercall Demo Realty (Pvt) Ltd</dd>
                </div>
                <div>
                  <dt>Workspace</dt>
                  <dd>EyerREMS Demo</dd>
                </div>
                <div>
                  <dt>Currency</dt>
                  <dd>PKR — Pakistani Rupee</dd>
                </div>
                <div>
                  <dt>Timezone</dt>
                  <dd>Asia/Karachi</dd>
                </div>
                <div>
                  <dt>Language</dt>
                  <dd>English</dd>
                </div>
                <div>
                  <dt>Date format</dt>
                  <dd>YYYY-MM-DD</dd>
                </div>
                <div>
                  <dt>Fiscal year</dt>
                  <dd>July — June</dd>
                </div>
                <div>
                  <dt>Demo mode</dt>
                  <dd>
                    <StatusBadge status="active" label="Read only" />
                  </dd>
                </div>
              </dl>
              <div style={{ marginTop: 12 }}>
                <DisabledAction>Edit Settings</DisabledAction>
              </div>
            </Card>
            <Card title="Modules" subtitle="Enabled module set for this workspace">
              <div className="rms-grid cols-3">
                {[
                  "Properties",
                  "Towns",
                  "CRM",
                  "Tenants",
                  "Maintenance",
                  "Construction",
                  "HR",
                  "Finance",
                  "Reports",
                  "Spreadsheet",
                  "AI Intel",
                  "Communication",
                  "Reminders",
                ].map((m) => (
                  <div
                    key={m}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "6px 8px",
                      border: "1px solid var(--rms-border)",
                      borderRadius: 6,
                    }}
                  >
                    <span style={{ fontSize: 10 }}>{m}</span>
                    <StatusBadge status="active" label="On" />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {tab === "backup" && (
          <div className="rms-stack">
            <Card title="Backup Schedules" subtitle="Configured backups (read only)">
              <DataTable
                data={[
                  {
                    id: 1,
                    schedule: "Daily automatic backup",
                    time: "02:00",
                    retention: "30 days",
                    last_run: "2026-11-22 02:00",
                    status: "success",
                  },
                  {
                    id: 2,
                    schedule: "Weekly archive",
                    time: "Sunday 03:00",
                    retention: "12 weeks",
                    last_run: "2026-11-16 03:00",
                    status: "success",
                  },
                  {
                    id: 3,
                    schedule: "Monthly archive",
                    time: "1st 04:00",
                    retention: "24 months",
                    last_run: "2026-11-01 04:00",
                    status: "success",
                  },
                ]}
                searchPlaceholder="Search backups..."
                columns={[
                  { key: "schedule", label: "Schedule" },
                  { key: "time", label: "Time" },
                  { key: "retention", label: "Retention" },
                  { key: "last_run", label: "Last Run" },
                  {
                    key: "status",
                    label: "Status",
                    render: (r) => <StatusBadge status={String(r.status)} />,
                  },
                ]}
              />
            </Card>
            <Card title="Restore" subtitle="Restoring data is disabled in the demo">
              <div style={{ display: "flex", gap: 8 }}>
                <DisabledAction>
                  <RotateCcw size={13} />
                  Restore Backup
                </DisabledAction>
                <DisabledAction>Create Backup</DisabledAction>
              </div>
            </Card>
          </div>
        )}

        {tab === "recycle-bin" && (
          <Card title="Recycle Bin" subtitle="Deleted record placeholders (read only)">
            <DataTable
              data={recycleBin}
              searchPlaceholder="Search deleted records..."
              columns={[
                { key: "record", label: "Record" },
                { key: "module", label: "Module" },
                { key: "deleted_by", label: "Deleted By" },
                { key: "deleted_at", label: "Deleted At" },
                { key: "size", label: "Size" },
              ]}
            />
          </Card>
        )}

        {tab === "mobile-sync" && (
          <Card title="Mobile Sync" subtitle="Device synchronisation state">
            <dl className="rms-kv">
              <div>
                <dt>Sync status</dt>
                <dd>
                  <StatusBadge status="active" label="Connected" />
                </dd>
              </div>
              <div>
                <dt>Devices</dt>
                <dd>3 registered (sample)</dd>
              </div>
              <div>
                <dt>Last sync</dt>
                <dd>2026-11-22 08:45</dd>
              </div>
              <div>
                <dt>Pending records</dt>
                <dd>0</dd>
              </div>
              <div>
                <dt>Direction</dt>
                <dd>Server → device only</dd>
              </div>
              <div>
                <dt>Conflict policy</dt>
                <dd>Read-only demo</dd>
              </div>
            </dl>
          </Card>
        )}
      </div>
    </>
  );
}

/* ────────────────────────── admin / history ────────────────────────── */

export function AdminModule({
  module,
  tab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);

  return (
    <>
      <PageHeader title="Administration" subtitle="Company detail, roles, users and audit logs">
        <DisabledAction>Add User</DisabledAction>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/admin/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "detail" && (
        <div className="rms-split">
          <Card title="Company Detail" subtitle="Administration overview">
            <dl className="rms-kv">
              <div>
                <dt>Company</dt>
                <dd>Eyercall Demo Realty (Pvt) Ltd</dd>
              </div>
              <div>
                <dt>Workspace ID</dt>
                <dd className="rms-mono">WS-0001</dd>
              </div>
              <div>
                <dt>Plan</dt>
                <dd>Enterprise (demo)</dd>
              </div>
              <div>
                <dt>Users</dt>
                <dd>{users.length}</dd>
              </div>
              <div>
                <dt>Roles</dt>
                <dd>{roles.length}</dd>
              </div>
              <div>
                <dt>Created</dt>
                <dd>2024-03-12</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status="active" />
                </dd>
              </div>
              <div>
                <dt>Data mode</dt>
                <dd>Fictional, deterministic</dd>
              </div>
            </dl>
          </Card>
          <Card title="System Health" subtitle="Demo configuration">
            <ul className="rms-list">
              {[
                ["Database", "Sample local adapter", "active"],
                ["Authentication", "Bypassed for demo", "active"],
                ["API services", "Not contacted", "inactive"],
                ["Audit logging", "Sample entries only", "active"],
              ].map(([label, detail, status]) => (
                <li key={String(label)}>
                  <div className="rms-list-main">
                    <strong>{String(label)}</strong>
                    <span>{String(detail)}</span>
                  </div>
                  <StatusBadge status={String(status)} />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "roles" && (
        <DataTable
          data={roles}
          searchPlaceholder="Search roles..."
          onRowClick={setSelected}
          columns={[
            {
              key: "name",
              label: "Role",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "description", label: "Description" },
            { key: "users", label: "Users", align: "right" },
            { key: "permissions", label: "Permissions", align: "right" },
          ]}
        />
      )}

      {tab === "users" && (
        <DataTable
          data={users}
          searchPlaceholder="Search users..."
          filters={[
            {
              key: "role",
              label: "Roles",
              options: roles.map((r) => ({ value: r.name, label: r.name })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "user_id",
              label: "User ID",
              render: (r) => <span className="rms-mono">{String(r.user_id)}</span>,
            },
            {
              key: "full_name",
              label: "Name",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.full_name)}
                </strong>
              ),
            },
            { key: "email", label: "Email" },
            { key: "role", label: "Role" },
            { key: "last_login", label: "Last Login" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "audit-logs" && (
        <DataTable
          data={auditLogs}
          searchPlaceholder="Search audit logs..."
          pageSizeDefault={25}
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["success", "denied"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          columns={[
            {
              key: "created_at",
              label: "Date",
              render: (r) => new Date(String(r.created_at)).toLocaleString(),
            },
            { key: "user", label: "User" },
            { key: "role", label: "Role" },
            { key: "module", label: "Module" },
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            { key: "ip", label: "IP" },
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
        title={String(selected?.["name"] ?? selected?.["full_name"] ?? "Administration record")}
        subtitle="Read-only record"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([k]) => k !== "id")
          .map(([key, value]) => ({ label: labelize(key), value: String(value ?? "—") }))}
      />
    </>
  );
}

export function HistoryModule() {
  return (
    <>
      <PageHeader
        title="Activity History"
        subtitle="Source audit history route (/history) reproduced read-only"
      >
        <span className="rms-chip">
          <History size={12} /> {history.length} events
        </span>
      </PageHeader>
      <SummaryStrip
        items={[
          { label: "Events", value: history.length, icon: <History size={14} /> },
          {
            label: "Users",
            value: new Set(history.map((h) => h.user)).size,
            icon: <Users size={14} />,
            tone: "var(--rms-blue)",
          },
          {
            label: "Modules",
            value: new Set(history.map((h) => h.module)).size,
            icon: <Shield size={14} />,
            tone: "var(--rms-violet)",
          },
          {
            label: "Denied",
            value: history.filter((h) => h.status === "denied").length,
            icon: <Shield size={14} />,
            tone: "var(--rms-danger)",
          },
        ]}
      />
      <div style={{ marginTop: 10 }}>
        <DataTable
          data={history}
          searchPlaceholder="Search history..."
          pageSizeDefault={25}
          columns={[
            {
              key: "created_at",
              label: "Date",
              render: (r) => new Date(String(r.created_at)).toLocaleString(),
            },
            { key: "user", label: "User" },
            { key: "role", label: "Role" },
            { key: "module", label: "Module" },
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            { key: "description", label: "Description" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
            { key: "ip", label: "IP" },
          ]}
        />
      </div>
      <div style={{ display: "none" }}>
        <PrimaryButton>Clear</PrimaryButton>
      </div>
    </>
  );
}
