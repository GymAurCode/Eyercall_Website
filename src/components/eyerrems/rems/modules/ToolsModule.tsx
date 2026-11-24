import { useMemo, useState } from "react";
import {
  AlertTriangle,
  BellRing,
  Bot,
  CalendarDays,
  CheckCircle2,
  Copy,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  aiInsights,
  anomalies,
  auditLogs,
  callLogs,
  chatThreads,
  duplicates,
  fmtDate,
  inbox,
  reminderLogs,
  reminderTemplates,
  reminders,
  riskScores,
  whatsappThreads,
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
} from "../ui";

/* ────────────────────────── AI ────────────────────────── */

export function AiModule({
  module,
  tab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const highRisk = riskScores.filter(
    (r) => r.risk_level === "high" || r.risk_level === "critical",
  ).length;

  return (
    <>
      <PageHeader
        title="AI Intelligence"
        subtitle="Anomalies, risk, duplicates and operational insights"
      >
        <span className="rms-demo-pill">
          <Bot size={11} /> Demo inference
        </span>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/ai/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
            <StatCard
              label="Anomalies"
              value={anomalies.length}
              hint="Detected in sample data"
              icon={<AlertTriangle size={15} />}
              tone="amber"
            />
            <StatCard
              label="Alerts"
              value={
                anomalies.filter((a) => a.severity === "high" || a.severity === "critical").length
              }
              hint="High severity"
              icon={<ShieldAlert size={15} />}
              tone="red"
            />
            <StatCard
              label="Duplicates"
              value={duplicates.length}
              hint="Candidate pairs"
              icon={<Copy size={15} />}
              tone="violet"
            />
            <StatCard
              label="High Risk"
              value={highRisk}
              hint="Entities above threshold"
              icon={<TrendingUp size={15} />}
              tone="red"
            />
          </div>
          <div className="rms-split">
            <Card title="Latest Insights" subtitle="Generated from fictional operational data">
              <div className="rms-stack">
                {aiInsights.map((insight) => (
                  <div key={insight.id} className="rms-project-card">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <h3>{insight.title}</h3>
                      <StatusBadge
                        status={
                          insight.tone === "positive"
                            ? "completed"
                            : insight.tone === "warning"
                              ? "pending"
                              : insight.tone === "danger"
                                ? "high"
                                : "low"
                        }
                        label={labelize(insight.tone)}
                      />
                    </div>
                    <p>{insight.detail}</p>
                  </div>
                ))}
              </div>
            </Card>
            <Card title="Anomaly Severity" subtitle="Current detection mix">
              <Donut
                segments={[
                  {
                    label: "Critical",
                    value: anomalies.filter((a) => a.severity === "critical").length,
                    color: "#ef4444",
                  },
                  {
                    label: "High",
                    value: anomalies.filter((a) => a.severity === "high").length,
                    color: "#f97316",
                  },
                  {
                    label: "Medium",
                    value: anomalies.filter((a) => a.severity === "medium").length,
                    color: "#f59e0b",
                  },
                  {
                    label: "Low",
                    value: anomalies.filter((a) => a.severity === "low").length,
                    color: "#64748b",
                  },
                ]}
                centerLabel="anomalies"
              />
            </Card>
          </div>
        </>
      )}

      {tab === "anomalies" && (
        <DataTable
          data={anomalies}
          searchPlaceholder="Search anomalies..."
          filters={[
            {
              key: "severity",
              label: "Severities",
              options: ["critical", "high", "medium", "low"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "anomaly_type",
              label: "Type",
              render: (r) => <span className="rms-mono">{labelize(String(r.anomaly_type))}</span>,
            },
            {
              key: "severity",
              label: "Severity",
              render: (r) => <StatusBadge status={String(r.severity)} />,
            },
            { key: "module", label: "Module" },
            { key: "description", label: "Description" },
            {
              key: "risk_score",
              label: "Risk",
              align: "right",
              render: (r) => <strong>{Number(r.risk_score).toFixed(0)}</strong>,
            },
            {
              key: "created_at",
              label: "Time",
              render: (r) => new Date(String(r.created_at)).toLocaleString(),
            },
          ]}
        />
      )}

      {tab === "alerts" && (
        <div className="rms-stack">
          {anomalies
            .filter((a) => a.severity === "high" || a.severity === "critical")
            .map((alert) => (
              <Card
                key={alert.id}
                title={labelize(alert.anomaly_type)}
                subtitle={`${alert.module} · ${new Date(alert.created_at).toLocaleString()}`}
                action={<StatusBadge status={alert.severity} />}
              >
                <p style={{ margin: 0, fontSize: 11, color: "var(--rms-text-secondary)" }}>
                  {alert.description}
                </p>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <DisabledAction>Acknowledge</DisabledAction>
                  <DisabledAction>Assign</DisabledAction>
                </div>
              </Card>
            ))}
        </div>
      )}

      {tab === "risk" && (
        <DataTable
          data={riskScores}
          searchPlaceholder="Search risk scores..."
          onRowClick={setSelected}
          columns={[
            {
              key: "subject_id",
              label: "Subject",
              render: (r) => <strong>#{String(r.subject_id)}</strong>,
            },
            { key: "subject_type", label: "Type", render: (r) => labelize(String(r.subject_type)) },
            {
              key: "risk_level",
              label: "Risk Level",
              render: (r) => <StatusBadge status={String(r.risk_level)} />,
            },
            {
              key: "score",
              label: "Score",
              render: (r) => <ProgressBar value={Number(r.score)} max={100} label={`${r.score}`} />,
            },
            {
              key: "last_computed",
              label: "Last Computed",
              render: (r) => new Date(String(r.last_computed)).toLocaleString(),
            },
          ]}
        />
      )}

      {tab === "duplicates" && (
        <DataTable
          data={duplicates}
          searchPlaceholder="Search duplicate candidates..."
          onRowClick={setSelected}
          columns={[
            { key: "entity", label: "Entity" },
            {
              key: "primary_record",
              label: "Primary Record",
              render: (r) => <span className="rms-mono">{String(r.primary_record)}</span>,
            },
            {
              key: "duplicate_record",
              label: "Duplicate",
              render: (r) => <span className="rms-mono">{String(r.duplicate_record)}</span>,
            },
            {
              key: "match_score",
              label: "Match",
              render: (r) => (
                <ProgressBar value={Number(r.match_score)} label={`${r.match_score}%`} />
              ),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "audit" && (
        <DataTable
          data={auditLogs}
          searchPlaceholder="Search audit events..."
          pageSizeDefault={25}
          columns={[
            {
              key: "created_at",
              label: "Time",
              render: (r) => new Date(String(r.created_at)).toLocaleString(),
            },
            { key: "user", label: "User" },
            { key: "module", label: "Module" },
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "query" && <AiQuery />}

      {tab === "insights" && (
        <div className="rms-grid cols-2">
          {aiInsights
            .concat(aiInsights)
            .slice(0, 8)
            .map((insight, i) => (
              <Card
                key={`${insight.id}-${i}`}
                title={insight.title}
                subtitle={`Insight ${String(i + 1).padStart(2, "0")}`}
                action={
                  <StatusBadge
                    status={
                      insight.tone === "positive"
                        ? "completed"
                        : insight.tone === "warning"
                          ? "pending"
                          : "high"
                    }
                    label={labelize(insight.tone)}
                  />
                }
              >
                <p style={{ margin: 0, fontSize: 11, color: "var(--rms-text-secondary)" }}>
                  {insight.detail}
                </p>
              </Card>
            ))}
        </div>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        title={String(
          selected?.["anomaly_type"] ??
            selected?.["subject_type"] ??
            selected?.["entity"] ??
            "AI record",
        )}
        subtitle="AI intelligence · read only"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([k]) => k !== "id")
          .map(([key, value]) => ({ label: labelize(String(key)), value: String(value ?? "—") }))}
      />
    </>
  );
}

function AiQuery() {
  const [query, setQuery] = useState("Which properties have the highest outstanding receivables?");
  const [asked, setAsked] = useState(false);
  return (
    <div className="rms-split">
      <Card title="AI Query" subtitle="Ask a question about the fictional demo dataset">
        <div className="rms-query-box">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask about portfolio, CRM, finance or maintenance…"
          />
          <div style={{ display: "flex", gap: 8 }}>
            <PrimaryButton>
              <Sparkles size={13} />
              Run Query
            </PrimaryButton>
            <DisabledAction>Clear History</DisabledAction>
          </div>
          {asked && (
            <div className="rms-notice">
              <Bot size={14} /> Demo mode returns a fixed sample answer; no model or API is
              contacted.
            </div>
          )}
        </div>
        <div style={{ marginTop: 12 }}>
          <h3 style={{ fontSize: 11, margin: "0 0 6px", color: "var(--rms-text-secondary)" }}>
            Sample answer
          </h3>
          <p
            style={{ margin: 0, fontSize: 11, color: "var(--rms-text-secondary)", lineHeight: 1.7 }}
          >
            Cedar Court Residency and Emerald Heights carry the largest sample outstanding balances.
            Three invoices are overdue and two follow-ups are pending. Figures are calculated from
            the local deterministic dataset only.
          </p>
        </div>
        <div style={{ marginTop: 10 }}>
          <button type="button" className="rms-btn is-secondary" onClick={() => setAsked(true)}>
            Show demo response
          </button>
        </div>
      </Card>
      <Card title="Suggested Questions" subtitle="Source query workspace defaults">
        <ul className="rms-list">
          {[
            "Show leads with no follow-up in 30 days",
            "Which projects are over budget?",
            "List overdue invoices by client",
            "Summarise maintenance cost by property",
            "Which units are vacant?",
          ].map((q) => (
            <li key={q}>
              <div className="rms-list-main">
                <strong>{q}</strong>
              </div>
              <MessageSquare size={13} className="rms-muted" />
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

/* ────────────────────────── communication ────────────────────────── */

export function CommunicationModule({
  module,
  tab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const [selectedMail, setSelectedMail] = useState(0);
  const mail = inbox[selectedMail] ?? inbox[0]!;

  return (
    <>
      <PageHeader title="Communication" subtitle="Email, WhatsApp, calls and internal chat">
        <DisabledAction>Compose</DisabledAction>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/communication/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "email" && (
        <div className="rms-email-layout">
          <div>
            <div className="rms-toolbar-line">
              <h2>Inbox</h2>
              <span className="rms-chip">{inbox.filter((m) => m.unread).length} unread</span>
            </div>
            <div className="rms-email-list">
              {inbox.map((message, i) => (
                <button
                  key={message.id}
                  type="button"
                  className={`rms-email-item ${i === selectedMail ? "is-active" : ""}`}
                  onClick={() => setSelectedMail(i)}
                >
                  <strong>
                    {message.from}
                    <em>{fmtDate(message.date)}</em>
                  </strong>
                  <span>{message.subject}</span>
                  <small>{message.preview}</small>
                </button>
              ))}
            </div>
          </div>
          <Card
            title={mail.subject}
            subtitle={`From ${mail.from} · ${fmtDate(mail.date)}`}
            action={<StatusBadge status="active" label="Email" />}
          >
            <p style={{ fontSize: 11, lineHeight: 1.8, color: "var(--rms-text-secondary)" }}>
              {mail.preview}
            </p>
            <p style={{ fontSize: 11, lineHeight: 1.8, color: "var(--rms-text-secondary)" }}>
              This conversation is reproduced for layout fidelity. No message can be sent, replied
              to, archived or deleted in the read-only demo.
            </p>
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <DisabledAction>Reply</DisabledAction>
              <DisabledAction>Forward</DisabledAction>
              <DisabledAction>Archive</DisabledAction>
            </div>
          </Card>
        </div>
      )}

      {tab === "whatsapp" && (
        <div className="rms-split">
          <Card title="WhatsApp Threads" subtitle="Connected demo channel">
            <ul className="rms-list">
              {whatsappThreads.map((thread) => (
                <li key={thread.id}>
                  <span className="rms-avatar">
                    <MessageCircle size={13} />
                  </span>
                  <div className="rms-list-main">
                    <strong>{thread.contact}</strong>
                    <span>{thread.last_message}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 9, color: "var(--rms-text-muted)" }}>{thread.time}</div>
                    {thread.unread && <StatusBadge status="new" label="Unread" />}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Channel Status" subtitle="WhatsApp provider configuration">
            <dl className="rms-kv">
              <div>
                <dt>Provider</dt>
                <dd>Meta Cloud API (demo)</dd>
              </div>
              <div>
                <dt>Status</dt>
                <dd>
                  <StatusBadge status="active" label="Connected" />
                </dd>
              </div>
              <div>
                <dt>Phone number</dt>
                <dd className="rms-mono">+92 300 0000000</dd>
              </div>
              <div>
                <dt>Webhook</dt>
                <dd className="rms-mono">/demo/webhook</dd>
              </div>
              <div>
                <dt>Messages sent</dt>
                <dd>1,248 (sample)</dd>
              </div>
              <div>
                <dt>Delivery rate</dt>
                <dd>98.2%</dd>
              </div>
            </dl>
            <div style={{ marginTop: 10 }}>
              <DisabledAction>Send Message</DisabledAction>
            </div>
          </Card>
        </div>
      )}

      {tab === "calls" && (
        <DataTable
          data={callLogs}
          searchPlaceholder="Search call logs..."
          filters={[
            {
              key: "direction",
              label: "Directions",
              options: ["inbound", "outbound"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          columns={[
            {
              key: "direction",
              label: "Direction",
              render: (r) => (
                <StatusBadge
                  status={String(r.direction) === "inbound" ? "new" : "completed"}
                  label={labelize(String(r.direction))}
                />
              ),
            },
            {
              key: "contact",
              label: "Contact",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.contact)}
                </strong>
              ),
            },
            {
              key: "number",
              label: "Number",
              render: (r) => <span className="rms-mono">{String(r.number)}</span>,
            },
            { key: "duration", label: "Duration" },
            { key: "date", label: "Date", render: (r) => String(r.date) },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "chat" && (
        <div className="rms-grid cols-3">
          {chatThreads.map((thread) => (
            <Card
              key={thread.id}
              title={thread.team}
              subtitle={thread.last_message}
              action={<StatusBadge status="active" label={thread.unread ? "Unread" : "Read"} />}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  fontSize: 10,
                  color: "var(--rms-text-muted)",
                }}
              >
                <MessageSquare size={13} /> {thread.time}
              </div>
              <div style={{ marginTop: 10 }}>
                <DisabledAction>Open Chat</DisabledAction>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}

/* ────────────────────────── reminders ────────────────────────── */

export function RemindersModule({
  module,
  tab,
  onNavigate,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const pending = reminders.filter((r) => r.status === "pending").length;
  const overdue = reminders.filter((r) => r.status === "overdue").length;

  return (
    <>
      <PageHeader
        title="Reminders &amp; Notifications"
        subtitle="Scheduled reminders, templates and delivery logs"
      >
        <DisabledAction>New Reminder</DisabledAction>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/reminders/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "dashboard" && (
        <>
          <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
            <StatCard
              label="Today"
              value={reminders.filter((r) => r.due_date === "2026-11-22").length}
              icon={<BellRing size={15} />}
            />
            <StatCard
              label="Pending"
              value={pending}
              icon={<CalendarDays size={15} />}
              tone="amber"
            />
            <StatCard
              label="Overdue"
              value={overdue}
              icon={<AlertTriangle size={15} />}
              tone="red"
            />
            <StatCard
              label="Completed"
              value={reminders.filter((r) => r.status === "completed").length}
              icon={<CheckCircle2 size={15} />}
              tone="green"
            />
          </div>
          <div className="rms-split">
            <Card title="Today's Reminders" subtitle="Scheduled for the current demo date">
              <ul className="rms-list">
                {reminders.slice(0, 7).map((reminder) => (
                  <li key={reminder.id}>
                    <div className="rms-list-main">
                      <strong>{reminder.title}</strong>
                      <span>
                        {reminder.category} · {reminder.due_time} · {reminder.assigned_to}
                      </span>
                    </div>
                    <StatusBadge status={reminder.priority} />
                    <StatusBadge status={reminder.status} />
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="Channels" subtitle="Notification delivery mix">
              <Donut
                segments={[
                  { label: "Email", value: 18, color: "#3b82f6" },
                  { label: "SMS", value: 12, color: "#f59e0b" },
                  { label: "WhatsApp", value: 9, color: "#10b981" },
                  { label: "In-app", value: 7, color: "#8b5cf6" },
                ]}
                centerLabel="sent"
              />
            </Card>
          </div>
        </>
      )}

      {tab === "my" && (
        <DataTable
          data={reminders}
          searchPlaceholder="Search reminders..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["pending", "completed", "overdue", "snoozed"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
            {
              key: "priority",
              label: "Priorities",
              options: ["high", "medium", "low"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "reminder_id",
              label: "ID",
              render: (r) => <span className="rms-mono">{String(r.reminder_id)}</span>,
            },
            { key: "title", label: "Title" },
            { key: "category", label: "Category" },
            { key: "due_date", label: "Due Date", render: (r) => fmtDate(String(r.due_date)) },
            { key: "due_time", label: "Time" },
            {
              key: "priority",
              label: "Priority",
              render: (r) => <StatusBadge status={String(r.priority)} />,
            },
            { key: "assigned_to", label: "Assigned" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "calendar" && <ReminderCalendar />}

      {tab === "stats" && (
        <div className="rms-split">
          <Card title="Reminders by Status" subtitle="Current distribution">
            <BarChart
              data={["pending", "completed", "overdue", "snoozed"].map((status) => ({
                month: labelize(status),
                count: reminders.filter((r) => r.status === status).length,
              }))}
              format={(n) => String(n)}
              series={[{ key: "count", label: "Reminders", color: "#f6ce3a" }]}
            />
          </Card>
          <Card title="Delivery Summary" subtitle="Channel performance">
            <SummaryStrip
              items={[
                {
                  label: "Delivered",
                  value: reminderLogs.filter((l) => l.status === "delivered").length,
                  tone: "var(--rms-green)",
                },
                {
                  label: "Failed",
                  value: reminderLogs.filter((l) => l.status === "failed").length,
                  tone: "var(--rms-danger)",
                },
                { label: "Templates", value: reminderTemplates.length, tone: "var(--rms-blue)" },
                { label: "Logs", value: reminderLogs.length, tone: "var(--rms-violet)" },
              ]}
            />
          </Card>
        </div>
      )}

      {tab === "templates" && (
        <DataTable
          data={reminderTemplates}
          searchPlaceholder="Search templates..."
          columns={[
            { key: "name", label: "Template" },
            { key: "channel", label: "Channel" },
            { key: "trigger", label: "Trigger" },
            {
              key: "active",
              label: "Status",
              render: (r) => <StatusBadge status={r.active ? "active" : "inactive"} />,
            },
          ]}
        />
      )}

      {tab === "logs" && (
        <DataTable
          data={reminderLogs}
          searchPlaceholder="Search delivery logs..."
          pageSizeDefault={25}
          columns={[
            { key: "sent_at", label: "Sent At", render: (r) => String(r.sent_at) },
            { key: "template", label: "Template" },
            { key: "recipient", label: "Recipient" },
            { key: "channel", label: "Channel" },
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
        title={String(selected?.["title"] ?? "Reminder")}
        subtitle="Reminder · read only"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([k]) => k !== "id")
          .map(([key, value]) => ({ label: labelize(key), value: String(value ?? "—") }))}
      />
    </>
  );
}

function ReminderCalendar() {
  const firstDay = new Date(Date.UTC(2026, 10, 1));
  const daysInMonth = 30;
  const startOffset = firstDay.getUTCDay();
  const cells = useMemo(() => {
    const result: ({ day: number; muted: boolean; events: string[] } | null)[] = [];
    for (let i = 0; i < startOffset; i++) result.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = `2026-11-${String(d).padStart(2, "0")}`;
      result.push({
        day: d,
        muted: false,
        events: reminders.filter((r) => r.due_date === iso).map((r) => r.title),
      });
    }
    while (result.length % 7 !== 0) result.push(null);
    return result;
  }, []);

  return (
    <div className="rms-calendar">
      <div className="rms-calendar-head">
        <h2>November 2026</h2>
        <div style={{ display: "flex", gap: 2 }}>
          <button type="button" className="rms-icon-btn" title="Previous month">
            ‹
          </button>
          <button type="button" className="rms-icon-btn" title="Next month">
            ›
          </button>
        </div>
      </div>
      <div className="rms-calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((dow) => (
          <div key={dow} className="rms-calendar-dow">
            {dow}
          </div>
        ))}
        {cells.map((cell, i) =>
          cell ? (
            <div key={i} className={`rms-calendar-day ${cell.day === 22 ? "is-today" : ""}`}>
              <b>{cell.day}</b>
              {cell.events.slice(0, 2).map((event) => (
                <span key={event} className="rms-calendar-event">
                  {event}
                </span>
              ))}
            </div>
          ) : (
            <div key={i} className="rms-calendar-day is-muted" />
          ),
        )}
      </div>
    </div>
  );
}
