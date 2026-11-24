import { useState } from "react";
import {
  AlertTriangle,
  Building2,
  Calendar,
  CircleDollarSign,
  ClipboardList,
  FileText,
  HardHat,
  Layers,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react";
import {
  clients,
  fmtDate,
  fmtMoney,
  projectBudget,
  projectDocuments,
  projectProcurement,
  projectQuality,
  projectResources,
  projectSafety,
  projectTasks,
  projectTimeline,
  projects,
  type NavModule,
} from "../data";
import {
  Card,
  DataTable,
  DetailDrawer,
  DisabledAction,
  PageHeader,
  PrimaryButton,
  ProgressBar,
  StatCard,
  StatusBadge,
  SummaryStrip,
  labelize,
  money,
} from "../ui";

const PROJECT_TABS = [
  "overview",
  "planning",
  "budget",
  "resources",
  "procurement",
  "execution",
  "quality",
  "safety",
  "finance",
  "documents",
  "timeline",
  "notifications",
];

export default function ConstructionModule({
  module,
  tab,
  detailId,
  subTab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  detailId?: string | undefined;
  subTab?: string | undefined;
  onNavigate: (path: string) => void;
}) {
  if (detailId) {
    return <ProjectDetail id={detailId} tab={subTab ?? "overview"} onNavigate={onNavigate} />;
  }
  if (tab === "projects") {
    return <ProjectList onNavigate={onNavigate} />;
  }
  return <ConstructionDashboard onNavigate={onNavigate} />;
}

function ConstructionDashboard({ onNavigate }: { onNavigate: (path: string) => void }) {
  const active = projects.filter((p) => p.status === "active");
  const budget = projects.reduce((s, p) => s + p.total_budget, 0);
  const spent = projects.reduce((s, p) => s + p.actual_cost, 0);

  return (
    <>
      <PageHeader title="Construction" subtitle="Project portfolio, progress and delivery">
        <button
          type="button"
          className="rms-btn is-secondary"
          onClick={() => onNavigate("/construction/projects")}
        >
          View All Projects
        </button>
        <PrimaryButton>New Project</PrimaryButton>
      </PageHeader>

      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        <StatCard
          label="Active Projects"
          value={active.length}
          hint={`${projects.length} total`}
          icon={<HardHat size={15} />}
        />
        <StatCard
          label="Total Budget"
          value={fmtMoney(budget)}
          hint="Across all projects"
          icon={<CircleDollarSign size={15} />}
          tone="green"
        />
        <StatCard
          label="Spent to Date"
          value={fmtMoney(spent)}
          hint={`${Math.round((spent / budget) * 100)}% utilised`}
          icon={<Layers size={15} />}
          tone="amber"
        />
        <StatCard
          label="Avg. Progress"
          value={`${Math.round(projects.reduce((s, p) => s + p.progress_percentage, 0) / projects.length)}%`}
          hint="Weighted simple average"
          icon={<ClipboardList size={15} />}
          tone="violet"
        />
      </div>

      <div className="rms-split">
        <Card title="Projects" subtitle="Current phase, budget and completion">
          <div className="rms-stack">
            {projects.map((project) => (
              <button
                key={project.id}
                type="button"
                className="rms-project-card"
                style={{ textAlign: "left", cursor: "pointer" }}
                onClick={() => onNavigate(`/construction/projects/${project.id}/overview`)}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <h3>{project.name}</h3>
                  <StatusBadge status={project.status} />
                </div>
                <p>
                  {project.code} · {project.location}
                </p>
                <ProgressBar value={project.progress_percentage} />
                <div className="rms-project-meta">
                  <span>
                    Phase: <StatusBadge status={project.current_phase} />
                  </span>
                  <span>Budget: {fmtMoney(project.total_budget)}</span>
                  <span>Spent: {fmtMoney(project.actual_cost)}</span>
                </div>
              </button>
            ))}
          </div>
        </Card>
        <Card title="Portfolio Snapshot" subtitle="Delivery health">
          <dl className="rms-kv">
            <div>
              <dt>Planning</dt>
              <dd>{projects.filter((p) => p.status === "planning").length}</dd>
            </div>
            <div>
              <dt>Active</dt>
              <dd>{active.length}</dd>
            </div>
            <div>
              <dt>On hold</dt>
              <dd>{projects.filter((p) => p.status === "on_hold").length}</dd>
            </div>
            <div>
              <dt>Completed</dt>
              <dd>{projects.filter((p) => p.status === "completed").length}</dd>
            </div>
            <div>
              <dt>Budget variance</dt>
              <dd style={{ color: "var(--rms-green)" }}>{fmtMoney(budget - spent)} remaining</dd>
            </div>
            <div>
              <dt>High-risk tasks</dt>
              <dd style={{ color: "var(--rms-danger)" }}>
                {projectTasks.filter((t) => t.priority === "critical").length}
              </dd>
            </div>
            <div>
              <dt>Open inspections</dt>
              <dd>{projectQuality.filter((q) => q.status === "open").length}</dd>
            </div>
            <div>
              <dt>Safety incidents</dt>
              <dd>{projectSafety.filter((s) => s.status === "open").length}</dd>
            </div>
          </dl>
          <div style={{ marginTop: 12 }}>
            <h3
              style={{
                fontSize: 10,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: "var(--rms-text-muted)",
                margin: "0 0 6px",
              }}
            >
              Upcoming Milestones
            </h3>
            <ul className="rms-list">
              {projectTimeline.slice(0, 4).map((item) => (
                <li key={item.id}>
                  <div className="rms-list-main">
                    <strong>{item.title}</strong>
                    <span>{item.detail}</span>
                  </div>
                  <span className="rms-muted" style={{ fontSize: 9 }}>
                    {fmtDate(item.date)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>
    </>
  );
}

function ProjectList({ onNavigate }: { onNavigate: (path: string) => void }) {
  return (
    <>
      <PageHeader title="Construction Projects" subtitle="Every verified project record">
        <button
          type="button"
          className="rms-btn is-secondary"
          onClick={() => onNavigate("/construction")}
        >
          ← Dashboard
        </button>
        <PrimaryButton>New Project</PrimaryButton>
      </PageHeader>
      <DataTable
        data={projects}
        searchPlaceholder="Search projects..."
        filters={[
          {
            key: "status",
            label: "Statuses",
            options: ["planning", "active", "on_hold", "completed"].map((v) => ({
              value: v,
              label: labelize(v),
            })),
          },
          {
            key: "current_phase",
            label: "Phases",
            options: [...new Set(projects.map((p) => p.current_phase))].map((v) => ({
              value: v,
              label: labelize(v),
            })),
          },
        ]}
        onRowClick={(row) => onNavigate(`/construction/projects/${row.id}/overview`)}
        columns={[
          {
            key: "code",
            label: "Project Code",
            render: (r) => (
              <span className="rms-mono" style={{ color: "#60a5fa" }}>
                {String(r.code)}
              </span>
            ),
          },
          {
            key: "name",
            label: "Project",
            render: (r) => (
              <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                {String(r.name)}
              </strong>
            ),
          },
          { key: "location", label: "Location" },
          { key: "manager", label: "Manager" },
          {
            key: "current_phase",
            label: "Phase",
            render: (r) => <StatusBadge status={String(r.current_phase)} />,
          },
          {
            key: "status",
            label: "Status",
            render: (r) => <StatusBadge status={String(r.status)} />,
          },
          {
            key: "total_budget",
            label: "Budget",
            align: "right",
            render: (r) => money(Number(r.total_budget)),
          },
          {
            key: "actual_cost",
            label: "Spent",
            align: "right",
            render: (r) => money(Number(r.actual_cost)),
          },
          {
            key: "progress_percentage",
            label: "Progress",
            render: (r) => <ProgressBar value={Number(r.progress_percentage)} />,
          },
        ]}
      />
    </>
  );
}

function ProjectDetail({
  id,
  tab,
  onNavigate,
}: {
  id: string;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const project = projects.find((p) => String(p.id) === id) ?? projects[0]!;
  const [drawer, setDrawer] = useState<Record<string, unknown> | null>(null);

  return (
    <>
      <PageHeader title={project.name} subtitle={`${project.code} · ${project.location}`}>
        <button
          type="button"
          className="rms-btn is-secondary"
          onClick={() => onNavigate("/construction/projects")}
        >
          ← Projects
        </button>
        <DisabledAction>Edit Project</DisabledAction>
      </PageHeader>

      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        <StatCard
          label="Status"
          value={labelize(project.status)}
          hint={labelize(project.current_phase)}
          icon={<HardHat size={15} />}
        />
        <StatCard
          label="Budget"
          value={fmtMoney(project.total_budget)}
          icon={<CircleDollarSign size={15} />}
          tone="green"
        />
        <StatCard
          label="Spent"
          value={fmtMoney(project.actual_cost)}
          icon={<Layers size={15} />}
          tone="amber"
        />
        <StatCard
          label="Progress"
          value={`${project.progress_percentage}%`}
          icon={<ClipboardList size={15} />}
          tone="violet"
        />
      </div>

      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {PROJECT_TABS.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            className={`rms-tab ${tab === key ? "is-active" : ""}`}
            onClick={() => onNavigate(`/construction/projects/${id}/${key}`)}
          >
            {labelize(key)}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="rms-split">
          <Card title="Project Overview" subtitle={project.description}>
            <dl className="rms-kv">
              <div>
                <dt>Project code</dt>
                <dd>{project.code}</dd>
              </div>
              <div>
                <dt>Client</dt>
                <dd>{project.client_name}</dd>
              </div>
              <div>
                <dt>Manager</dt>
                <dd>{project.manager}</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>{project.location}</dd>
              </div>
              <div>
                <dt>Start date</dt>
                <dd>{fmtDate(project.start_date)}</dd>
              </div>
              <div>
                <dt>Target completion</dt>
                <dd>{fmtDate(project.end_date)}</dd>
              </div>
              <div>
                <dt>Phase</dt>
                <dd>
                  <StatusBadge status={project.current_phase} />
                </dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status={project.status} />
                </dd>
              </div>
            </dl>
          </Card>
          <Card
            title="Completion Checklist"
            subtitle="Source checklist reproduced with demo values"
          >
            <ul className="rms-list">
              {[
                ["Tasks completed", true],
                ["Inspections passed", true],
                ["No pending orders", false],
                ["No pending payments", false],
                ["No quality issues", true],
                ["No safety issues", true],
                ["Documents uploaded", true],
                ["Completion approved", false],
              ].map(([label, done]) => (
                <li key={String(label)}>
                  <div className="rms-list-main">
                    <strong>{String(label)}</strong>
                  </div>
                  <StatusBadge
                    status={done ? "completed" : "pending"}
                    label={done ? "Done" : "Pending"}
                  />
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {tab === "planning" && (
        <DataTable
          data={projectTasks}
          searchPlaceholder="Search tasks..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["completed", "in_progress", "pending", "blocked"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
            {
              key: "priority",
              label: "Priorities",
              options: ["critical", "high", "medium", "low"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setDrawer}
          columns={[
            {
              key: "task_number",
              label: "#",
              render: (r) => <span className="rms-mono">{String(r.task_number)}</span>,
            },
            {
              key: "name",
              label: "Task",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "phase_name", label: "Phase" },
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
            { key: "start_date", label: "Start", render: (r) => fmtDate(String(r.start_date)) },
            { key: "end_date", label: "End", render: (r) => fmtDate(String(r.end_date)) },
            {
              key: "estimated_cost",
              label: "Est. Cost",
              align: "right",
              render: (r) => money(Number(r.estimated_cost)),
            },
            {
              key: "progress_pct",
              label: "%",
              render: (r) => <ProgressBar value={Number(r.progress_pct)} />,
            },
          ]}
        />
      )}

      {tab === "budget" && (
        <Card title="Budget Breakdown" subtitle="Budgeted versus spent by cost head">
          <DataTable
            data={projectBudget}
            searchPlaceholder="Search budget lines..."
            columns={[
              {
                key: "label",
                label: "Cost Head",
                render: (r) => (
                  <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                    {String(r.label)}
                  </strong>
                ),
              },
              {
                key: "budgeted",
                label: "Budget",
                align: "right",
                render: (r) => money(Number(r.budgeted)),
              },
              {
                key: "spent",
                label: "Spent",
                align: "right",
                render: (r) => money(Number(r.spent)),
              },
              {
                key: "budgeted",
                label: "Utilisation",
                render: (r) => <ProgressBar value={Number(r.spent)} max={Number(r.budgeted)} />,
              },
            ]}
          />
        </Card>
      )}

      {tab === "resources" && (
        <DataTable
          data={projectResources}
          searchPlaceholder="Search resources..."
          filters={[
            {
              key: "category",
              label: "Categories",
              options: ["human", "equipment", "material"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setDrawer}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "category", label: "Category", render: (r) => labelize(String(r.category)) },
            {
              key: "availability",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.availability)} />,
            },
            {
              key: "unit_cost",
              label: "Unit Cost",
              align: "right",
              render: (r) => money(Number(r.unit_cost)),
            },
            { key: "current_stock", label: "Stock", align: "right" },
          ]}
        />
      )}

      {tab === "procurement" && (
        <Card title="Procurement" subtitle="Purchase requests and purchase orders">
          <DataTable
            data={projectProcurement}
            searchPlaceholder="Search procurement..."
            filters={[
              {
                key: "status",
                label: "Statuses",
                options: ["approved", "pending", "delivered", "rejected"].map((v) => ({
                  value: v,
                  label: labelize(v),
                })),
              },
            ]}
            onRowClick={setDrawer}
            columns={[
              {
                key: "pr_number",
                label: "PR #",
                render: (r) => <span className="rms-mono">{String(r.pr_number)}</span>,
              },
              {
                key: "po_number",
                label: "PO #",
                render: (r) => <span className="rms-mono">{String(r.po_number)}</span>,
              },
              { key: "title", label: "Title" },
              { key: "vendor_name", label: "Vendor" },
              {
                key: "status",
                label: "Status",
                render: (r) => <StatusBadge status={String(r.status)} />,
              },
              {
                key: "total_amount",
                label: "Amount",
                align: "right",
                render: (r) => money(Number(r.total_amount)),
              },
            ]}
          />
        </Card>
      )}

      {tab === "execution" && (
        <Card title="Execution" subtitle="Site tasks and daily progress">
          <DataTable
            data={projectTasks.filter((t) => t.status !== "pending")}
            searchPlaceholder="Search execution tasks..."
            onRowClick={setDrawer}
            columns={[
              { key: "name", label: "Task" },
              { key: "phase_name", label: "Phase" },
              {
                key: "priority",
                label: "Priority",
                render: (r) => <StatusBadge status={String(r.priority)} />,
              },
              {
                key: "progress_pct",
                label: "Progress",
                render: (r) => <ProgressBar value={Number(r.progress_pct)} />,
              },
              { key: "start_date", label: "Date", render: (r) => fmtDate(String(r.start_date)) },
            ]}
          />
        </Card>
      )}

      {tab === "quality" && (
        <DataTable
          data={projectQuality}
          searchPlaceholder="Search inspections..."
          onRowClick={setDrawer}
          columns={[
            { key: "inspection_type", label: "Type" },
            {
              key: "inspection_date",
              label: "Date",
              render: (r) => fmtDate(String(r.inspection_date)),
            },
            { key: "inspector_name", label: "Inspector" },
            {
              key: "result",
              label: "Result",
              render: (r) => <StatusBadge status={String(r.result)} />,
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "safety" && (
        <DataTable
          data={projectSafety}
          searchPlaceholder="Search safety records..."
          onRowClick={setDrawer}
          columns={[
            {
              key: "incident_type",
              label: "Type",
              render: (r) => labelize(String(r.incident_type)),
            },
            { key: "title", label: "Title" },
            {
              key: "incident_date",
              label: "Date",
              render: (r) => fmtDate(String(r.incident_date)),
            },
            {
              key: "severity",
              label: "Severity",
              render: (r) => <StatusBadge status={String(r.severity)} />,
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "finance" && (
        <Card title="Project Finance" subtitle="Committed and paid project costs">
          <DataTable
            data={projectBudget.map((row, i) => ({
              ...row,
              reference: `PV-${1000 + i}`,
              payment_status: i % 3 === 0 ? "pending" : "paid",
              date: fmtDate(project.start_date),
            }))}
            searchPlaceholder="Search finance entries..."
            columns={[
              { key: "date", label: "Date" },
              { key: "label", label: "Cost Head" },
              {
                key: "spent",
                label: "Amount",
                align: "right",
                render: (r) => money(Number(r.spent)),
              },
              {
                key: "reference",
                label: "Ref",
                render: (r) => <span className="rms-mono">{String(r.reference)}</span>,
              },
              {
                key: "payment_status",
                label: "Status",
                render: (r) => <StatusBadge status={String(r.payment_status)} />,
              },
            ]}
          />
        </Card>
      )}

      {tab === "documents" && (
        <DataTable
          data={projectDocuments}
          searchPlaceholder="Search documents..."
          onRowClick={setDrawer}
          columns={[
            {
              key: "name",
              label: "Name",
              render: (r) => (
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}>
                  <FileText size={13} />
                  {String(r.name)}
                </span>
              ),
            },
            { key: "folder", label: "Folder" },
            {
              key: "tags",
              label: "Tags",
              render: (r) => <span className="rms-chip">{String(r.tags)}</span>,
            },
            { key: "created_at", label: "Uploaded", render: (r) => fmtDate(String(r.created_at)) },
          ]}
        />
      )}

      {tab === "timeline" && (
        <Card title="Project Timeline" subtitle="Planning through completion">
          <ul className="rms-list">
            {projectTimeline.map((event) => (
              <li key={event.id}>
                <span className="rms-activity-dot" style={{ background: "#8b5cf6" }} />
                <div className="rms-list-main">
                  <strong>{event.title}</strong>
                  <span>{event.detail}</span>
                </div>
                <span className="rms-chip">{labelize(event.type)}</span>
                <span className="rms-muted" style={{ fontSize: 9 }}>
                  {fmtDate(event.date)}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {tab === "notifications" && (
        <Card title="Alerts &amp; Notifications" subtitle="Project-level notification inbox">
          <ul className="rms-list">
            {[
              [
                "Budget threshold reached",
                "Procurement costs have crossed 70% of the approved budget.",
                "high",
              ],
              [
                "Inspection scheduled",
                "Third-party structural inspection is due next week.",
                "medium",
              ],
              [
                "Document approved",
                "Revised architectural drawing set was marked approved.",
                "completed",
              ],
              [
                "Safety observation closed",
                "Open excavation edge was barricaded and verified.",
                "completed",
              ],
            ].map(([title, detail, status]) => (
              <li key={String(title)}>
                <AlertTriangle size={14} style={{ color: "var(--rms-amber)" }} />
                <div className="rms-list-main">
                  <strong>{String(title)}</strong>
                  <span>{String(detail)}</span>
                </div>
                <StatusBadge status={String(status)} />
              </li>
            ))}
          </ul>
        </Card>
      )}

      <DetailDrawer
        open={Boolean(drawer)}
        title={String(
          drawer?.["name"] ?? drawer?.["title"] ?? drawer?.["pr_number"] ?? "Project record",
        )}
        subtitle="Construction · read only"
        onClose={() => setDrawer(null)}
        fields={Object.entries(drawer ?? {})
          .filter(([key]) => key !== "id")
          .map(([key, value]) => ({
            label: labelize(key),
            value: typeof value === "number" ? value.toLocaleString("en-US") : String(value ?? "—"),
          }))}
      />
    </>
  );
}
