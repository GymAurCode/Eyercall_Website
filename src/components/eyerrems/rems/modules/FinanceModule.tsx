import { useState } from "react";
import {
  Banknote,
  BarChart3,
  BookOpen,
  CircleDollarSign,
  CreditCard,
  Layers,
  Receipt,
  TrendingUp,
} from "lucide-react";
import {
  accounts,
  bankAccounts,
  cashAccounts,
  commissions,
  expenses,
  financeDashboard,
  financePayments,
  fmtDate,
  fmtMoney,
  invoices,
  journals,
  ledger,
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
  StatCard,
  StatusBadge,
  SummaryStrip,
  fmtShortCompact,
  labelize,
  money,
} from "../ui";

const TAB_ICONS: Record<string, React.ReactNode> = {
  dashboard: <BarChart3 size={13} />,
  accounts: <BookOpen size={13} />,
  journals: <Receipt size={13} />,
  invoices: <CircleDollarSign size={13} />,
  payments: <TrendingUp size={13} />,
  bank: <CreditCard size={13} />,
  cash: <Banknote size={13} />,
  commissions: <CircleDollarSign size={13} />,
  expenses: <Receipt size={13} />,
  ledger: <BookOpen size={13} />,
  reports: <BarChart3 size={13} />,
  operations: <Layers size={13} />,
};

export default function FinanceModule({
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
      <PageHeader title="Finance" subtitle="Accounts, journals, invoices, payments and ledger">
        <DisabledAction>Export</DisabledAction>
        <PrimaryButton>New Journal</PrimaryButton>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={`rms-tab ${tab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/finance/${t.id}`)}
          >
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
              {TAB_ICONS[t.id]}
              {t.label}
            </span>
          </button>
        ))}
      </div>

      {tab === "dashboard" && <FinanceDashboard />}

      {tab === "accounts" && (
        <DataTable
          data={accounts}
          searchPlaceholder="Search accounts..."
          filters={[
            {
              key: "account_type",
              label: "Types",
              options: ["Asset", "Liability", "Equity", "Revenue", "Expense"].map((v) => ({
                value: v,
                label: v,
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "code",
              label: "Code",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.code)}
                </span>
              ),
            },
            {
              key: "account_name",
              label: "Account",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.account_name)}
                </strong>
              ),
            },
            { key: "account_type", label: "Type" },
            {
              key: "balance",
              label: "Balance",
              align: "right",
              render: (r) => money(Number(r.balance)),
            },
            {
              key: "is_active",
              label: "Status",
              render: (r) => <StatusBadge status={r.is_active ? "active" : "inactive"} />,
            },
          ]}
        />
      )}

      {tab === "journals" && (
        <DataTable
          data={journals}
          searchPlaceholder="Search journal entries..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["posted", "draft"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "journal_id",
              label: "Journal ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.journal_id)}
                </span>
              ),
            },
            { key: "date", label: "Date", render: (r) => fmtDate(String(r.date)) },
            {
              key: "reference",
              label: "Reference",
              render: (r) => <span className="rms-mono">{String(r.reference)}</span>,
            },
            { key: "description", label: "Description" },
            { key: "debit_account", label: "Debit Account" },
            { key: "credit_account", label: "Credit Account" },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              render: (r) => money(Number(r.amount)),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "invoices" && (
        <DataTable
          data={invoices}
          searchPlaceholder="Search invoices..."
          filters={[
            {
              key: "status",
              label: "Statuses",
              options: ["paid", "partial", "overdue"].map((v) => ({
                value: v,
                label: labelize(v),
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "invoice_no",
              label: "Invoice No",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.invoice_no)}
                </span>
              ),
            },
            { key: "client_name", label: "Client" },
            {
              key: "issue_date",
              label: "Issue Date",
              render: (r) => fmtDate(String(r.issue_date)),
            },
            { key: "due_date", label: "Due Date", render: (r) => fmtDate(String(r.due_date)) },
            {
              key: "total_amount",
              label: "Total",
              align: "right",
              render: (r) => money(Number(r.total_amount)),
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

      {tab === "payments" && (
        <DataTable
          data={financePayments}
          searchPlaceholder="Search payments..."
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
            { key: "date", label: "Date", render: (r) => fmtDate(String(r.date)) },
            { key: "payer", label: "Payer" },
            { key: "invoice_no", label: "Invoice" },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              render: (r) => money(Number(r.amount)),
            },
            { key: "method", label: "Method" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "bank" && (
        <div className="rms-grid cols-2">
          {bankAccounts.map((account) => (
            <Card
              key={account.id}
              title={account.bank_name}
              subtitle={`${account.account_title} · ${account.branch}`}
              action={<StatusBadge status={account.status} />}
            >
              <dl className="rms-kv">
                <div>
                  <dt>Account number</dt>
                  <dd className="rms-mono">{account.account_number}</dd>
                </div>
                <div>
                  <dt>Branch</dt>
                  <dd>{account.branch}</dd>
                </div>
                <div>
                  <dt>Balance</dt>
                  <dd style={{ color: "var(--rms-green)", fontWeight: 600 }}>
                    {money(account.balance)}
                  </dd>
                </div>
                <div>
                  <dt>Reconciliation</dt>
                  <dd>Current</dd>
                </div>
              </dl>
            </Card>
          ))}
        </div>
      )}

      {tab === "cash" && (
        <DataTable
          data={cashAccounts}
          searchPlaceholder="Search cash accounts..."
          onRowClick={setSelected}
          columns={[
            {
              key: "name",
              label: "Cash Account",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>
                  {String(r.name)}
                </strong>
              ),
            },
            { key: "custodian", label: "Custodian" },
            {
              key: "balance",
              label: "Balance",
              align: "right",
              render: (r) => money(Number(r.balance)),
            },
            {
              key: "last_reconciled",
              label: "Last Reconciled",
              render: (r) => fmtDate(String(r.last_reconciled)),
            },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "commissions" && (
        <DataTable
          data={commissions}
          searchPlaceholder="Search commissions..."
          filters={[
            {
              key: "payment_status",
              label: "Statuses",
              options: ["paid", "unpaid"].map((v) => ({ value: v, label: labelize(v) })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "id",
              label: "COM-ID",
              render: (r) => (
                <span
                  className="rms-mono"
                  style={{ color: "#60a5fa" }}
                >{`COM-${String(r.id).padStart(4, "0")}`}</span>
              ),
            },
            { key: "dealer_name", label: "Dealer" },
            { key: "deal_code", label: "Deal Ref" },
            { key: "property_name", label: "Property" },
            {
              key: "sale_amount",
              label: "Sale Value",
              align: "right",
              render: (r) => money(Number(r.sale_amount)),
            },
            {
              key: "commission_rate",
              label: "Rate",
              align: "right",
              render: (r) => `${r.commission_rate}%`,
            },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              render: (r) => money(Number(r.amount)),
            },
            {
              key: "payment_status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.payment_status)} />,
            },
          ]}
        />
      )}

      {tab === "expenses" && (
        <DataTable
          data={expenses}
          searchPlaceholder="Search expenses..."
          filters={[
            {
              key: "account_name",
              label: "Accounts",
              options: [...new Set(expenses.map((e) => e.account_name))].map((v) => ({
                value: v,
                label: v,
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "id",
              label: "#",
              render: (r) => <span className="rms-mono">{String(r.id)}</span>,
            },
            {
              key: "account_code",
              label: "Account",
              render: (r) => `${r.account_code} ${r.account_name}`,
            },
            { key: "description", label: "Description" },
            {
              key: "amount",
              label: "Amount",
              align: "right",
              render: (r) => money(Number(r.amount)),
            },
            { key: "date", label: "Date", render: (r) => fmtDate(String(r.date)) },
            { key: "payment_method", label: "Method" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
          ]}
        />
      )}

      {tab === "ledger" && (
        <DataTable
          data={ledger}
          searchPlaceholder="Search ledger entries..."
          filters={[
            {
              key: "account",
              label: "Accounts",
              options: [...new Set(ledger.map((l) => l.account))].map((v) => ({
                value: v,
                label: v,
              })),
            },
          ]}
          onRowClick={setSelected}
          columns={[
            {
              key: "entry_id",
              label: "Entry ID",
              render: (r) => (
                <span className="rms-mono" style={{ color: "#60a5fa" }}>
                  {String(r.entry_id)}
                </span>
              ),
            },
            { key: "date", label: "Date", render: (r) => fmtDate(String(r.date)) },
            { key: "account", label: "Account" },
            { key: "description", label: "Description" },
            {
              key: "reference",
              label: "Reference",
              render: (r) => <span className="rms-mono">{String(r.reference)}</span>,
            },
            {
              key: "debit",
              label: "Debit",
              align: "right",
              render: (r) => (Number(r.debit) ? money(Number(r.debit)) : "—"),
            },
            {
              key: "credit",
              label: "Credit",
              align: "right",
              render: (r) => (Number(r.credit) ? money(Number(r.credit)) : "—"),
            },
            {
              key: "balance",
              label: "Balance",
              align: "right",
              render: (r) => money(Number(r.balance)),
            },
          ]}
        />
      )}

      {tab === "reports" && <FinanceReports />}

      {tab === "operations" && (
        <Card title="Finance Operations" subtitle="Period close and reconciliation status">
          <div className="rms-grid cols-3">
            {[
              ["Bank Reconciliation", "4 accounts · last run 2 days ago", "completed"],
              ["Cash Reconciliation", "3 imprest accounts · 1 pending", "pending"],
              ["Month-end Close", "November 2026 · in progress", "in_progress"],
              ["Journal Posting", "9 posted · 1 draft", "posted"],
              ["Invoice Run", "12 invoices generated", "completed"],
              ["Commission Payout", "9 entries · 3 unpaid", "pending"],
            ].map(([title, detail, status]) => (
              <div key={String(title)} className="rms-project-card">
                <h3>{String(title)}</h3>
                <p>{String(detail)}</p>
                <StatusBadge status={String(status)} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <DetailDrawer
        open={Boolean(selected)}
        title={String(
          selected?.["account_name"] ??
            selected?.["invoice_no"] ??
            selected?.["journal_id"] ??
            selected?.["entry_id"] ??
            selected?.["name"] ??
            "Finance record",
        )}
        subtitle="Finance record · read only"
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([k]) => k !== "id")
          .map(([key, value]) => ({
            label: labelize(key),
            value:
              typeof value === "number" &&
              /balance|amount|total|paid|price|salary|cost|debit|credit/i.test(key)
                ? money(value)
                : String(value ?? "—"),
          }))}
      />
    </>
  );
}

function FinanceDashboard() {
  return (
    <>
      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        {financeDashboard.kpis.map((kpi) => (
          <StatCard
            key={kpi.label}
            label={kpi.label}
            value={fmtMoney(kpi.value)}
            hint={kpi.hint}
            tone={kpi.tone === "green" ? "green" : kpi.tone === "red" ? "red" : "amber"}
            icon={<CircleDollarSign size={15} />}
          />
        ))}
      </div>
      <SummaryStrip
        items={[
          { label: "Accounts", value: accounts.length, tone: "var(--rms-blue)" },
          {
            label: "Posted journals",
            value: journals.filter((j) => j.status === "posted").length,
            tone: "var(--rms-green)",
          },
          {
            label: "Open invoices",
            value: invoices.filter((i) => i.status !== "paid").length,
            tone: "var(--rms-amber)",
          },
          {
            label: "Unpaid commissions",
            value: commissions.filter((c) => c.payment_status === "unpaid").length,
            tone: "var(--rms-danger)",
          },
        ]}
      />
      <div className="rms-split" style={{ marginTop: 10 }}>
        <Card title="Income vs Expenses" subtitle="Last six months">
          <BarChart
            data={financeDashboard.monthly}
            format={fmtShortCompact}
            series={[
              { key: "income", label: "Income", color: "#10b981" },
              { key: "expense", label: "Expenses", color: "#ef4444" },
            ]}
          />
        </Card>
        <Card title="Expense Breakdown" subtitle="By category">
          <Donut segments={financeDashboard.expenseBreakdown} centerLabel="expenses" />
        </Card>
      </div>
      <div className="rms-split" style={{ marginTop: 10 }}>
        <Card title="Recent Journals" subtitle="Latest postings">
          <ul className="rms-list">
            {journals.slice(0, 5).map((j) => (
              <li key={j.id}>
                <div className="rms-list-main">
                  <strong>{j.description}</strong>
                  <span>
                    {j.journal_id} · {fmtDate(j.date)}
                  </span>
                </div>
                <span style={{ fontSize: 11, color: "var(--rms-text)" }}>{fmtMoney(j.amount)}</span>
                <StatusBadge status={j.status} />
              </li>
            ))}
          </ul>
        </Card>
        <Card title="Cash &amp; Bank" subtitle="Liquidity position">
          <dl className="rms-kv">
            <div>
              <dt>Bank balances</dt>
              <dd>{fmtMoney(bankAccounts.reduce((s, b) => s + b.balance, 0))}</dd>
            </div>
            <div>
              <dt>Cash balances</dt>
              <dd>{fmtMoney(cashAccounts.reduce((s, c) => s + c.balance, 0))}</dd>
            </div>
            <div>
              <dt>Receivables</dt>
              <dd>
                {fmtMoney(
                  invoices
                    .filter((i) => i.status !== "paid")
                    .reduce((s, i) => s + i.total_amount - i.paid_amount, 0),
                )}
              </dd>
            </div>
            <div>
              <dt>Payables</dt>
              <dd>{fmtMoney(expenses.reduce((s, e) => s + e.amount, 0))}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </>
  );
}

function FinanceReports() {
  return (
    <div className="rms-grid cols-2">
      {[
        ["Trial Balance", "Debit and credit balances for all accounts", accounts],
        [
          "Income Statement",
          "Revenue and expense summary",
          accounts.filter((a) => a.account_type === "Revenue" || a.account_type === "Expense"),
        ],
        [
          "Balance Sheet",
          "Assets, liabilities and equity",
          accounts.filter((a) => a.account_type !== "Revenue" && a.account_type !== "Expense"),
        ],
        ["General Ledger", "Detailed postings by account", ledger],
      ].map(([title, description, rows]) => (
        <Card
          key={String(title)}
          title={String(title)}
          subtitle={String(description)}
          action={<DisabledAction>Export</DisabledAction>}
        >
          <div style={{ fontSize: 11, color: "var(--rms-text-secondary)", marginBottom: 8 }}>
            {Array.isArray(rows) ? rows.length : 0} rows in this sample report
          </div>
          <table className="rms-table">
            <thead>
              <tr>
                <th>Line</th>
                <th>Description</th>
                <th style={{ textAlign: "right" }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {(Array.isArray(rows) ? rows.slice(0, 5) : []).map((row, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    {String(
                      (row as Record<string, unknown>)["account_name"] ??
                        (row as Record<string, unknown>)["description"] ??
                        (row as Record<string, unknown>)["account"] ??
                        "—",
                    )}
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {money(
                      Number(
                        (row as Record<string, unknown>)["balance"] ??
                          (row as Record<string, unknown>)["debit"] ??
                          (row as Record<string, unknown>)["amount"] ??
                          0,
                      ),
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ))}
    </div>
  );
}
