import { useState } from "react";
import {
  Calendar,
  CircleDollarSign,
  ClipboardList,
  Settings2,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";
import {
  attendance,
  employees,
  fmtDate,
  fmtMoney,
  leaves,
  payroll,
  performance,
  type NavModule,
} from "../data";
import {
  BarChart,
  Card,
  DataTable,
  DetailDrawer,
  DisabledAction,
  Donut,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  StatCard,
  StatusBadge,
  SummaryStrip,
  labelize,
  money,
} from "../ui";

export default function HrModule({
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
      <PageHeader
        title="Human Resources"
        subtitle="Employees, attendance, leave, payroll and performance"
      >
        <DisabledAction>Export</DisabledAction>
        <PrimaryButton>Add Employee</PrimaryButton>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/hr/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && <HrDashboard />}
      {tab === "employees" && (
        <DataTable
          data={employees}
          searchPlaceholder="Search employees..."
          filters={[
            {
              key: "department",
              label: "Departments",
              options: [...new Set(employees.map((e) => e.department))].map((v) => ({
                value: v,
                label: v,
              })),
            },
            {
              key: "employment_status",
              label: "Statuses",
              options: ["Active", "Inactive", "Probation"].map((v) => ({ value: v, label: v })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "employee_id",
              label: "ID",
              render: (r) => <span className="rms-mono">{String(r.employee_id)}</span>,
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
            { key: "department", label: "Department" },
            { key: "position", label: "Position" },
            { key: "employment_type", label: "Type" },
            {
              key: "employment_status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.employment_status)} />,
            },
            {
              key: "joining_date",
              label: "Joined",
              render: (r) => fmtDate(String(r.joining_date)),
            },
            {
              key: "salary",
              label: "Salary",
              align: "right",
              render: (r) => money(Number(r.salary)),
            },
          ]}
        />
      )}
      {tab === "attendance" && (
        <DataTable
          data={attendance}
          searchPlaceholder="Search attendance..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["present", "late", "absent"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            { key: "date", label: "Date", render: (r) => fmtDate(String(r.date)) },
            {
              key: "employee_name",
              label: "Employee",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.employee_name)}
                </strong>
              ),
            },
            { key: "department", label: "Department" },
            { key: "check_in", label: "Check In" },
            { key: "check_out", label: "Check Out" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "leaves" && (
        <DataTable
          data={leaves}
          searchPlaceholder="Search leave requests..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["pending", "approved", "rejected"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "leave_id",
              label: "Leave ID",
              render: (r) => <span className="rms-mono">{String(r.leave_id)}</span>,
            },
            { key: "employee_name", label: "Employee" },
            { key: "leave_type", label: "Type" },
            { key: "from_date", label: "From", render: (r) => fmtDate(String(r.from_date)) },
            { key: "to_date", label: "To", render: (r) => fmtDate(String(r.to_date)) },
            { key: "days", label: "Days", align: "right" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "payroll" && (
        <DataTable
          data={payroll}
          searchPlaceholder="Search payroll..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["paid", "pending"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "payroll_id",
              label: "Payroll ID",
              render: (r) => <span className="rms-mono">{String(r.payroll_id)}</span>,
            },
            { key: "employee_name", label: "Employee" },
            { key: "department", label: "Department" },
            {
              key: "basic_salary",
              label: "Basic",
              align: "right",
              render: (r) => money(Number(r.basic_salary)),
            },
            {
              key: "allowances",
              label: "Allowances",
              align: "right",
              render: (r) => money(Number(r.allowances)),
            },
            {
              key: "deductions",
              label: "Deductions",
              align: "right",
              render: (r) => money(Number(r.deductions)),
            },
            {
              key: "net_salary",
              label: "Net",
              align: "right",
              render: (r) => money(Number(r.net_salary)),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "performance" && (
        <DataTable
          data={performance}
          searchPlaceholder="Search performance reviews..."
          onRowClick={setSelected}
          columns={[
            { key: "employee_name", label: "Employee" },
            { key: "department", label: "Department" },
            { key: "review_period", label: "Period" },
            {
              key: "rating",
              label: "Rating",
              render: (r) => (
                <StatusBadge
                  status={Number(r.rating) >= 4 ? "completed" : "pending"}
                  label={`${r.rating} / 5`}
                />
              ),
            },
            {
              key: "goals_met",
              label: "Goals Met",
              render: (r) => <ProgressBar value={Number(r.goals_met)} />,
            },
            { key: "reviewer", label: "Reviewer" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}
      {tab === "setup" && (
        <div className="rms-grid cols-2">
          <Card title="Departments" subtitle="7 configured departments">
            <ul className="rms-list">
              {["Sales", "Accounts", "Operations", "HR", "Construction", "Marketing", "IT"].map(
                (dept) => (
                  <li key={dept}>
                    <div className="rms-list-main">
                      <strong>{dept}</strong>
                      <span>{employees.filter((e) => e.department === dept).length} employees</span>
                    </div>
                    <StatusBadge status="active" />
                  </li>
                ),
              )}
            </ul>
          </Card>
          <Card title="Leave Types" subtitle="Configured leave policies">
            <ul className="rms-list">
              {[
                ["Annual Leave", "20 days per year"],
                ["Sick Leave", "10 days per year"],
                ["Casual Leave", "6 days per year"],
                ["Unpaid Leave", "Approval required"],
              ].map(([label, detail]) => (
                <li key={label}>
                  <div className="rms-list-main">
                    <strong>{label}</strong>
                    <span>{detail}</span>
                  </div>
                  <StatusBadge status="active" />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        title={String(
          selected?.["full_name"] ??
            selected?.["employee_name"] ??
            selected?.["leave_id"] ??
            "HR record",
        )}
        subtitle="HR record · read only"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([k]) => k !== "id")
          .map(([key, value]) => ({
            label: labelize(key),
            value: typeof value === "number" ? value.toLocaleString("en-US") : String(value ?? "—"),
          }))}
      />
    </>
  );
}

function HrDashboard() {
  const active = employees.filter((e) => e.employment_status === "Active").length;
  const onProbation = employees.filter((e) => e.employment_status === "Probation").length;
  const inactive = employees.length - active - onProbation;
  const departments = [...new Set(employees.map((e) => e.department))];

  return (
    <>
      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        <StatCard
          label="Total Employees"
          value={employees.length}
          hint={`${departments.length} departments`}
          icon={<Users size={15} />}
        />
        <StatCard
          label="Active"
          value={active}
          hint={`${Math.round((active / employees.length) * 100)}% of headcount`}
          icon={<UserCheck size={15} />}
          tone="green"
        />
        <StatCard
          label="Probation"
          value={onProbation}
          hint="Under review"
          icon={<ClipboardList size={15} />}
          tone="amber"
        />
        <StatCard
          label="Inactive"
          value={inactive}
          hint="Ended employment"
          icon={<Users size={15} />}
          tone="red"
        />
      </div>
      <SummaryStrip
        items={[
          {
            label: "Monthly payroll",
            value: fmtMoney(payroll.reduce((s, p) => s + p.net_salary, 0)),
            icon: <CircleDollarSign size={14} />,
            tone: "var(--rms-accent)",
          },
          {
            label: "Present today",
            value: attendance.filter((a) => a.status === "present").length,
            icon: <Calendar size={14} />,
            tone: "var(--rms-green)",
          },
          {
            label: "Pending leave",
            value: leaves.filter((l) => l.status === "pending").length,
            icon: <FileIcon />,
            tone: "var(--rms-amber)",
          },
          {
            label: "Avg rating",
            value: (performance.reduce((s, p) => s + p.rating, 0) / performance.length).toFixed(1),
            icon: <TrendingUp size={14} />,
            tone: "var(--rms-violet)",
          },
        ]}
      />
      <div className="rms-split" style={{ marginTop: 10 }}>
        <Card title="Headcount by Department" subtitle="Employees per department">
          <BarChart
            data={departments.map((dept) => ({
              month: dept,
              count: employees.filter((e) => e.department === dept).length,
            }))}
            format={(n) => String(n)}
            series={[{ key: "count", label: "Employees", color: "#8b5cf6" }]}
          />
        </Card>
        <Card title="Employment Status" subtitle="Workforce composition">
          <Donut
            segments={[
              { label: "Active", value: active, color: "#10b981" },
              { label: "Probation", value: onProbation, color: "#f59e0b" },
              { label: "Inactive", value: inactive, color: "#64748b" },
            ]}
            centerLabel="employees"
          />
        </Card>
      </div>
      <div className="rms-split" style={{ marginTop: 10 }}>
        <Card title="Recent Attendance" subtitle="Latest check-ins">
          <ul className="rms-list">
            {attendance.slice(0, 6).map((row) => (
              <li key={row.id}>
                <div className="rms-list-main">
                  <strong>{row.employee_name}</strong>
                  <span>
                    {row.department} · {row.check_in} – {row.check_out}
                  </span>
                </div>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="HR Setup" subtitle="Configured policy areas">
          <div className="rms-stack">
            {[
              ["Departments", `${departments.length} configured`, <Users size={14} key="u" />],
              ["Leave Policies", "4 leave types", <Calendar size={14} key="c" />],
              ["Payroll Cycle", "Monthly · 28th", <CircleDollarSign size={14} key="d" />],
              ["Review Cycle", "Quarterly", <Settings2 size={14} key="s" />],
            ].map(([label, detail, icon]) => (
              <div
                key={String(label)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 11,
                  color: "var(--rms-text-secondary)",
                }}
              >
                <span style={{ color: "var(--rms-accent)" }}>{icon}</span>
                <span style={{ flex: 1 }}>{String(label)}</span>
                <span className="rms-muted">{String(detail)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function FileIcon() {
  return <ClipboardList size={14} />;
}
