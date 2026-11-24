import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  Building, DollarSign, Users, CreditCard, Phone, Mail, MapPin,
  Banknote, TrendingDown, Plus, Loader2, Wallet, ArrowUpRight,
  ArrowDownRight, RefreshCw, TrendingUp, CircleDollarSign,
  Target, BarChart3, Activity, ExternalLink, Landmark,
} from "lucide-react";
import { crmApi, DealerLedgerEntry } from "../../lib/crmApi";
import AppDialog from "../../components/ui/AppDialog";
import { FormSection, FormRow, FormField } from "../../components/ui/DialogForm";
import { DialogCancelButton, DialogSubmitButton } from "../../components/ui/DialogButtons";
import {
  DetailPage, DetailHeader, DetailBody, DetailSection,
  InfoGrid, DataTable, StatusBadge, MonoId,
} from "../../components/detail";
import ConfirmDialog from "../../components/actions/ConfirmDialog";
import { useNotifStore } from "../../store/notifications";

const MAIN_TABS = ["Overview", "Leads", "Ledger", "Network", "Charts"];
const LEDGER_SUB_TABS = ["Ledger", "Payouts"];

const pkr = (v: number | null | undefined) =>
  v != null ? `PKR ${Number(v).toLocaleString()}` : "\u2014";

const pct = (v: number | null | undefined) =>
  v != null ? `${Number(v).toFixed(2)}%` : "\u2014";

const fmtDate = (d: string | null | undefined) =>
  d ? new Date(d).toLocaleDateString() : "\u2014";

function StatCard({ label, value, icon: Icon }: {
  label: string; value: string; icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl px-4 py-4 transition-all hover:scale-[1.01]" style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-subtle)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{label}</p>
        <Icon size={14} style={{ color: "var(--text-muted)" }} />
      </div>
      <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

function MiniStatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg px-3 py-3 transition-all" style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-subtle)" }}>
      <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{value}</p>
    </div>
  );
}

export default function DealerDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const tabParam = searchParams.get("tab");
  const initialTab = tabParam === "ledger" ? 2 : tabParam === "leads" ? 1 : tabParam === "network" ? 3 : tabParam === "charts" ? 4 : 0;
  const [mainTab, setMainTab] = useState(initialTab);
  const [ledgerSubTab, setLedgerSubTab] = useState(0);
  const [payOpen, setPayOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ item: any; type: string } | null>(null);
  const [hierarchy, setHierarchy] = useState<any>(null);
  const pushToast = useNotifStore((s) => s.pushToast);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    crmApi.getDealerDetail(id)
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!data?.dealer?.id) return;
    crmApi.getDealerHierarchy(data.dealer.id).then(setHierarchy).catch(() => setHierarchy(null));
  }, [data?.dealer?.id]);

  if (loading) {
    return (
      <DetailPage>
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full" />
        </div>
      </DetailPage>
    );
  }

  if (!data) {
    return (
      <DetailPage>
        <p className="text-sm text-red-400 text-center py-10">Dealer not found.</p>
      </DetailPage>
    );
  }

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const { item, type } = deleteTarget;
      if (type === "dealer") {
        await crmApi.deleteDealer(item.id);
        pushToast({ title: "Dealer Deleted", message: "Dealer has been deleted", type: "success" });
        navigate("/crm");
      }
    } catch (e: any) {
      pushToast({ title: "Error", message: e?.response?.data?.detail ?? "Failed to delete", priority: "urgent" });
    } finally {
      setDeleteTarget(null);
    }
  };

  const { dealer, financial_summary, lead_stats, lead_cost_summary, commission_summary,
    recent_leads = [], recent_ledger_entries = [], assigned_clients = [], active_deals = [] } = data;

  const currentBalance = financial_summary?.net_balance ?? (data as any).current_balance ?? 0;

  return (
    <DetailPage>
      <DetailHeader
        backTo="/crm"
        title={dealer.name}
        subtitle={`${dealer.dealer_id}${dealer.company ? ` \u00b7 ${dealer.company}` : ""}`}
        badge={<StatusBadge status={dealer.is_active ? "active" : "inactive"} />}
        meta={[
          { label: "Phone", value: dealer.phone ?? "\u2014" },
          { label: "Email", value: dealer.email ?? "\u2014" },
          { label: "CNIC", value: dealer.cnic ?? "\u2014" },
          { label: "Joined", value: fmtDate(dealer.created_at) },
          { label: "Commission", value: dealer.commission_rate
            ? `${dealer.commission_rate}${dealer.commission_type === "percentage" ? "%" : " (fixed)"}`
            : "\u2014" },
        ]}
      />

      {hierarchy?.upline?.length > 0 && (
        <div className="flex items-center gap-1.5 text-xs mb-3 flex-wrap">
          <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Reports to:
          </span>
          {hierarchy.upline.slice().reverse().map((u: any, i: number) => (
            <span key={u.id} className="flex items-center gap-1">
              {i > 0 && <span style={{ color: "var(--text-muted)" }}>/</span>}
              <button
                onClick={() => navigate(`/crm/dealers/${u.id}`)}
                className="hover:underline font-medium"
                style={{ color: "var(--text-link, #60a5fa)" }}
              >
                {u.name}
              </button>
            </span>
          ))}
          <span style={{ color: "var(--text-muted)" }}>/</span>
          <span className="font-semibold" style={{ color: "var(--text-primary)" }}>{dealer.name}</span>
        </div>
      )}

      <div className="flex justify-end -mt-2 mb-3">
        <button onClick={() => setPayOpen(true)}
          className="btn-primary flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-xl">
          <CreditCard size={14} /> Record Payout
        </button>
      </div>

      <div className="flex gap-1 p-0.5 rounded-lg mb-4" style={{ background: "var(--bg-surface2)" }}>
        {MAIN_TABS.map((t, i) => (
          <button key={t} onClick={() => setMainTab(i)}
            className="px-4 py-1.5 text-[10px] font-semibold rounded-md transition-all"
            style={{
              background: mainTab === i ? "var(--bg-surface)" : "transparent",
              color: mainTab === i ? "var(--text-primary)" : "var(--text-muted)",
              border: mainTab === i ? "1px solid var(--border)" : "1px solid transparent",
            }}>
            {t}
          </button>
        ))}
      </div>

      <DetailBody>
        {mainTab === 0 && (
          <>
            <DetailSection title="Dealer Information" icon={Building}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                    Contact Details
                  </h4>
                  <InfoGrid items={[
                    { label: "Phone", value: dealer.phone ? (
                      <a href={`tel:${dealer.phone}`} className="hover:underline" style={{ color: "var(--text-link, #60a5fa)" }}>{dealer.phone}</a>
                    ) : "\u2014" },
                    { label: "Email", value: dealer.email ? (
                      <a href={`mailto:${dealer.email}`} className="hover:underline" style={{ color: "var(--text-link, #60a5fa)" }}>{dealer.email}</a>
                    ) : "\u2014" },
                    { label: "CNIC", value: dealer.cnic ?? "\u2014" },
                    { label: "Company", value: dealer.company ?? "\u2014" },
                    { label: "Address", value: dealer.address ?? "\u2014" },
                  ]} />
                </div>
                <div>
                  <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                    Commission & Costing
                  </h4>
                  <InfoGrid items={[
                    { label: "Commission Type", value: dealer.commission_type === "percentage" ? "Percentage (%)" : "Fixed Amount" },
                    { label: "Commission Rate", value: dealer.commission_rate
                      ? `${dealer.commission_rate}${dealer.commission_type === "percentage" ? "%" : " PKR"}`
                      : "Not set" },
                    { label: "Cost per Lead", value: dealer.cost_per_lead ? pkr(dealer.cost_per_lead) : "Not set" },
                    { label: "Status", value: <StatusBadge status={dealer.is_active ? "active" : "inactive"} /> },
                  ]} />
                  {dealer.notes && (
                    <>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest mt-4 mb-2" style={{ color: "var(--text-muted)" }}>
                        Internal Notes
                      </h4>
                      <p className="text-xs whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>
                        {dealer.notes}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </DetailSection>

            <DetailSection title="Financial Summary" icon={DollarSign}>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
                <StatCard label="Total Commission Earned" value={pkr(financial_summary?.total_commission_earned)} icon={DollarSign} />
                <StatCard label="Total Lead Cost" value={pkr(financial_summary?.total_lead_cost)} icon={TrendingDown} />
                <StatCard label="Net Balance" value={pkr(financial_summary?.net_balance)} icon={Wallet} />
                <StatCard label="Payable to Dealer" value={pkr(financial_summary?.amount_payable_to_dealer)} icon={ArrowUpRight} />
                <StatCard label="Receivable from Dealer" value={pkr(financial_summary?.amount_receivable_from_dealer)} icon={ArrowDownRight} />
                <StatCard label="Payments Received" value={pkr(financial_summary?.payments_received)} icon={Banknote} />
                <StatCard label="Pending Balance" value={pkr(financial_summary?.pending_balance)} icon={RefreshCw} />
                <StatCard label="This Month Commission" value={pkr(financial_summary?.current_month_commission)} icon={TrendingUp} />
                <StatCard label="This Month Lead Cost" value={pkr(financial_summary?.current_month_lead_cost)} icon={CircleDollarSign} />
              </div>
            </DetailSection>

            <DetailSection title="Lead Statistics" icon={Target}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {[
                  { label: "Total Assigned", key: "total_assigned" },
                  { label: "New", key: "new" },
                  { label: "Contacted", key: "contacted" },
                  { label: "Follow-up", key: "follow_up" },
                  { label: "Negotiation", key: "negotiation" },
                  { label: "Site Visit", key: "site_visit" },
                  { label: "Booked", key: "booked" },
                  { label: "Won", key: "won" },
                  { label: "Lost", key: "lost" },
                  { label: "Cancelled", key: "cancelled" },
                  { label: "Expired", key: "expired" },
                ].map((s) => (
                  <div key={s.key} className="rounded-lg px-3 py-2.5 text-center" style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-subtle)" }}>
                    <p className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>{(lead_stats as any)?.[s.key] ?? 0}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider mt-0.5" style={{ color: "var(--text-muted)" }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
                {[
                  { label: "Conversion Rate", value: lead_stats?.conversion_rate },
                  { label: "Win Rate", value: lead_stats?.win_rate },
                  { label: "Lost Rate", value: lead_stats?.lost_rate },
                ].map((r) => {
                  const val = r.value ?? 0;
                  return (
                    <div key={r.label} className="rounded-lg px-4 py-3" style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-subtle)" }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>{r.label}</p>
                        <p className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>{pct(val)}</p>
                      </div>
                      <div className="w-full h-2 rounded-full" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(val, 100)}%`, background: "var(--text-primary)" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </DetailSection>

            <DetailSection title="Lead Cost Summary" icon={Activity}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                {[
                  { label: "Cost Per Lead", value: pkr(lead_cost_summary?.cost_per_lead) },
                  { label: "Charged Leads", value: lead_cost_summary?.total_charged_leads ?? "\u2014" },
                  { label: "Total Lead Cost", value: pkr(lead_cost_summary?.total_lead_cost) },
                  { label: "Avg Cost / Won", value: pkr(lead_cost_summary?.avg_cost_per_won_lead) },
                  { label: "Avg Cost / Closed", value: pkr(lead_cost_summary?.avg_cost_per_closed_deal) },
                  { label: "Cost Recovery", value: pct(lead_cost_summary?.cost_recovery_pct) },
                ].map((c) => <MiniStatCard key={c.label} label={c.label} value={c.value} />)}
              </div>
            </DetailSection>

            <DetailSection title="Commission Summary" icon={Landmark}>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-7 gap-2">
                {[
                  { label: "Deals Closed", value: commission_summary?.total_deals_closed ?? "\u2014" },
                  { label: "Total Commission", value: pkr(commission_summary?.total_commission) },
                  { label: "Avg Commission", value: pkr(commission_summary?.avg_commission) },
                  { label: "Highest", value: pkr(commission_summary?.highest_commission) },
                  { label: "Lowest", value: pkr(commission_summary?.lowest_commission) },
                  { label: "This Month", value: pkr(commission_summary?.commission_this_month) },
                  { label: "Last Month", value: pkr(commission_summary?.commission_last_month) },
                ].map((c) => <MiniStatCard key={c.label} label={c.label} value={c.value} />)}
              </div>
            </DetailSection>
          </>
        )}

        {mainTab === 1 && (
          <DetailSection title="Recent Assigned Leads" icon={Target}>
            <DataTable
              columns={[
                { key: "lead_id", label: "Lead ID" },
                { key: "name", label: "Client Name" },
                { key: "phone", label: "Phone" },
                { key: "property", label: "Property" },
                { key: "date", label: "Assigned Date" },
                { key: "stage", label: "Current Stage" },
                { key: "cost", label: "Lead Cost", align: "right" },
                { key: "commission", label: "Expected Comm.", align: "right" },
                { key: "status", label: "Status" },
                { key: "action", label: "", align: "center" },
              ]}
              rows={recent_leads.map((l: any) => ({
                lead_id: <MonoId value={l.lead_id} />,
                name: l.name,
                phone: l.phone ?? "\u2014",
                property: l.property_name ?? "\u2014",
                date: <span className="text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(l.assigned_date)}</span>,
                stage: <span className="text-xs capitalize">{l.current_stage?.replace(/_/g, " ")}</span>,
                cost: l.lead_cost != null ? <span className="font-mono text-xs">{pkr(l.lead_cost)}</span> : "\u2014",
                commission: l.expected_commission != null ? <span className="font-mono text-xs">{pkr(l.expected_commission)}</span> : "\u2014",
                status: <StatusBadge status={l.status} />,
                action: (
                  <button onClick={() => navigate(`/crm/leads/${l.lead_id ?? l.id}`)}
                    className="px-2.5 py-1 text-[10px] font-semibold rounded-lg transition-all"
                    style={{ background: "var(--bg-surface2)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}>
                    Open
                  </button>
                ),
                _id: l.id,
              }))}
              emptyText="No leads assigned to this dealer."
            />
          </DetailSection>
        )}

        {mainTab === 2 && (
          <DetailSection title="Ledger & Transactions" icon={Banknote}
            action={
              <div className="flex gap-1 p-0.5 rounded-lg" style={{ background: "var(--bg-surface2)" }}>
                {LEDGER_SUB_TABS.map((t, i) => (
                  <button key={t} onClick={() => setLedgerSubTab(i)}
                    className="px-3 py-1.5 text-[10px] font-semibold rounded-md transition-all"
                    style={{
                      background: ledgerSubTab === i ? "var(--bg-surface)" : "transparent",
                      color: ledgerSubTab === i ? "var(--text-primary)" : "var(--text-muted)",
                      border: ledgerSubTab === i ? "1px solid var(--border)" : "1px solid transparent",
                    }}>
                    {t}
                  </button>
                ))}
              </div>
            }
          >
            {ledgerSubTab === 0 ? (
              <LedgerTable dealerId={dealer.id} entries={recent_ledger_entries} />
            ) : (
              <PayoutsTable dealerId={dealer.id} />
            )}
          </DetailSection>
        )}

        {mainTab === 3 && (
          <DetailSection title="Assigned Network" icon={Users}>
            {hierarchy?.direct_sub_dealers?.length > 0 && (
              <div className="mb-6">
                <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                  Sub-Dealers ({hierarchy.direct_sub_dealers.length})
                </h4>
                <DataTable
                  columns={[
                    { key: "dealer_id", label: "Dealer ID" },
                    { key: "name", label: "Name" },
                    { key: "phone", label: "Phone" },
                    { key: "email", label: "Email" },
                    { key: "status", label: "Status" },
                  ]}
                  rows={hierarchy.direct_sub_dealers.map((sd: any) => ({
                    dealer_id: <MonoId value={sd.dealer_id} />,
                    name: sd.name,
                    phone: sd.phone ?? "\u2014",
                    email: sd.email ?? "\u2014",
                    status: <StatusBadge status={sd.is_active ? "active" : "inactive"} />,
                    _id: sd.id,
                  }))}
                  onRowClick={(row) => navigate(`/crm/dealers/${row._id}`)}
                  emptyText="No sub-dealers."
                />
              </div>
            )}
            <div className="mb-6">
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                Clients ({assigned_clients.length})
              </h4>
              <DataTable
                columns={[
                  { key: "client_id", label: "Client ID" },
                  { key: "tracking_id", label: "Tracking ID" },
                  { key: "name", label: "Name" },
                  { key: "phone", label: "Phone" },
                  { key: "status", label: "Status" },
                ]}
                rows={assigned_clients.map((c: any) => ({
                  client_id: <MonoId value={c.client_id} />,
                  tracking_id: <MonoId value={c.tracking_id} />,
                  name: c.name, phone: c.phone ?? "\u2014",
                  status: <StatusBadge status={c.status} />, _id: c.id,
                }))}
                onRowClick={(row) => navigate(`/crm/clients/${row._id}`)}
                emptyText="No clients assigned to this dealer."
              />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: "var(--text-muted)" }}>
                Active Deals ({active_deals.length})
              </h4>
              <DataTable
                columns={[
                  { key: "deal_id", label: "Deal ID" }, { key: "tracking_id", label: "Tracking ID" },
                  { key: "title", label: "Title" }, { key: "client", label: "Client" },
                  { key: "value", label: "Value", align: "right" }, { key: "status", label: "Status" },
                ]}
                rows={active_deals.map((d: any) => ({
                  deal_id: <MonoId value={d.deal_id} />, tracking_id: <MonoId value={d.tracking_id} />,
                  title: d.deal_title ?? "\u2014", client: d.client_name ?? "\u2014",
                  value: <span className="font-medium">{Number(d.deal_value).toLocaleString()}</span>,
                  status: <StatusBadge status={d.status} />, _id: d.id,
                }))}
                onRowClick={(row) => navigate(`/crm/deals/${row._id}`)}
                emptyText="No deals linked to this dealer."
              />
            </div>
          </DetailSection>
        )}

        {mainTab === 4 && (
          <DetailSection title="Monthly Charts" icon={BarChart3}>
            <ChartsSection recentLeads={recent_leads} financialSummary={financial_summary} commissionSummary={commission_summary} leadCostSummary={lead_cost_summary} />
          </DetailSection>
        )}
      </DetailBody>

      <RecordPayoutDialog open={payOpen} onClose={() => setPayOpen(false)}
        onSaved={() => { setPayOpen(false); window.location.reload(); }}
        dealerId={dealer.id} dealerName={dealer.name} currentBalance={currentBalance} />

      <ConfirmDialog
        open={!!deleteTarget}
        title="Confirm Delete"
        message={`Are you sure you want to delete this ${deleteTarget?.type}?`}
        confirmLabel="Delete"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </DetailPage>
  );
}

// ── Section: Ledger Table ──

function LedgerTable({ dealerId, entries: initialEntries }: { dealerId: number; entries: any[] }) {
  const navigate = useNavigate();
  const [entries, setEntries] = useState<any[]>(initialEntries);
  const [loading, setLoading] = useState(initialEntries.length === 0);

  useEffect(() => {
    if (initialEntries.length > 0) { setLoading(false); return; }
    setLoading(true);
    crmApi.getDealerLedger(dealerId).then(setEntries).catch(() => setEntries([])).finally(() => setLoading(false));
  }, [dealerId, initialEntries]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 size={16} className="animate-spin" /></div>;

  return (
    <DataTable
      columns={[
        { key: "date", label: "Date" },
        { key: "tid", label: "Reference" },
        { key: "type", label: "Transaction Type" },
        { key: "debit", label: "Debit", align: "right" },
        { key: "credit", label: "Credit", align: "right" },
        { key: "balance", label: "Running Balance", align: "right" },
        { key: "description", label: "Description" },
      ]}
      rows={entries.slice(0, 50).map((e: any) => ({
        date: <span className="text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(e.created_at)}</span>,
        tid: <MonoId value={e.tid} />,
        type: <StatusBadge status={e.entry_type.replace(/_/g, " ")} />,
        debit: e.debit > 0 ? <span className="font-mono text-xs" style={{ color: "#ef4444" }}>{Number(e.debit).toLocaleString()}</span> : "\u2014",
        credit: e.credit > 0 ? <span className="font-mono text-xs" style={{ color: "#10b981" }}>{Number(e.credit).toLocaleString()}</span> : "\u2014",
        balance: <span className="font-mono text-xs">{Number(e.running_balance).toLocaleString()}</span>,
        description: <span className="text-xs">{e.description}{e.lead_name ? ` \u2014 ${e.lead_name}` : ""}</span>,
        _id: e.id,
      }))}
      emptyText="No ledger entries yet."
    />
  );
}

// ── Section: Payouts Table ──

function PayoutsTable({ dealerId }: { dealerId: number }) {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    crmApi.getDealerLedger(dealerId).then(all => setEntries(all.filter((e: any) => e.entry_type === "payout"))).catch(() => setEntries([])).finally(() => setLoading(false));
  }, [dealerId]);

  if (loading) return <div className="flex justify-center py-8"><Loader2 size={16} className="animate-spin" /></div>;

  return (
    <DataTable
      columns={[
        { key: "tid", label: "Ref" },
        { key: "amount", label: "Amount", align: "right" },
        { key: "method", label: "Method" },
        { key: "notes", label: "Notes" },
        { key: "date", label: "Date" },
      ]}
      rows={entries.map((e: any) => ({
        tid: <MonoId value={e.tid} />,
        amount: <span className="font-mono text-xs" style={{ color: "#ef4444" }}>{Number(e.debit).toLocaleString()}</span>,
        method: e.reference_no || "\u2014",
        notes: e.description,
        date: <span className="text-xs" style={{ color: "var(--text-muted)" }}>{fmtDate(e.created_at)}</span>,
      }))}
      emptyText="No payouts recorded."
    />
  );
}

// ── Section: Charts (CSS bars) ──

function ChartsSection({ recentLeads, financialSummary, commissionSummary, leadCostSummary }: {
  recentLeads: any[]; financialSummary: any; commissionSummary: any; leadCostSummary: any;
}) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const last6: { label: string; leads: number; commission: number; leadCost: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${months[d.getMonth()]} ${d.getFullYear()}`;
    const leads = recentLeads.filter((l: any) => {
      const ld = l.assigned_date ? new Date(l.assigned_date) : null;
      return ld && ld.getMonth() === d.getMonth() && ld.getFullYear() === d.getFullYear();
    }).length;
    last6.push({
      label,
      leads,
      commission: i === 0 ? (commissionSummary?.commission_this_month ?? 0) : 0,
      leadCost: i === 0 ? (leadCostSummary?.total_lead_cost ?? 0) / 6 : 0,
    });
  }

  const maxLeads = Math.max(1, ...last6.map(m => m.leads));
  const maxMoney = Math.max(1, ...last6.map(m => Math.max(m.commission, m.leadCost)));

  return (
    <div className="space-y-8">
      {/* Monthly Assigned Leads */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          Monthly Assigned Leads
        </h4>
        <div className="space-y-2">
          {last6.map((m) => {
            const barPct = (m.leads / maxLeads) * 100;
            return (
              <div key={m.label} className="flex items-center gap-3">
                <span className="text-[11px] font-medium w-20 shrink-0 text-right" style={{ color: "var(--text-secondary)" }}>{m.label}</span>
                <div className="flex-1 h-5 rounded-md" style={{ background: "var(--border)" }}>
                  <div className="h-full rounded-md transition-all flex items-center justify-end pr-2" style={{ width: `${Math.max(barPct, 4)}%`, background: "var(--text-primary)" }}>
                    <span className="text-[10px] font-bold" style={{ color: "var(--bg-surface)" }}>{m.leads}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monthly Commission vs Lead Cost */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-muted)" }}>
          Monthly Commission vs Lead Cost
        </h4>
        <div className="space-y-3">
          {last6.map((m) => {
            const commPct = (m.commission / maxMoney) * 100;
            const costPct = (m.leadCost / maxMoney) * 100;
            return (
              <div key={m.label}>
                <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>{m.label}</span>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4 rounded-md" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-md transition-all" style={{ width: `${Math.max(commPct, 3)}%`, background: "var(--text-primary)" }} />
                      </div>
                      <span className="text-[10px] font-mono font-medium shrink-0" style={{ color: "var(--text-muted)" }}>{pkr(m.commission)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-4 rounded-md" style={{ background: "var(--border)" }}>
                        <div className="h-full rounded-md transition-all" style={{ width: `${Math.max(costPct, 3)}%`, background: "var(--text-muted)" }} />
                      </div>
                      <span className="text-[10px] font-mono font-medium shrink-0" style={{ color: "var(--text-muted)" }}>{pkr(m.leadCost)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Record Payout Dialog ──

function RecordPayoutDialog({ open, onClose, onSaved, dealerId, dealerName, currentBalance }: {
  open: boolean; onClose: () => void; onSaved: () => void; dealerId: number; dealerName: string; currentBalance: number;
}) {
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [referenceNo, setReferenceNo] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const pushToast = useNotifStore((s) => s.pushToast);

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) { setErr("Enter a valid amount"); return; }
    if (Number(amount) > currentBalance) { setErr(`Amount (PKR ${Number(amount).toLocaleString()}) exceeds available balance (PKR ${currentBalance.toLocaleString()})`); return; }
    setSaving(true); setErr("");
    try {
      await crmApi.createDealerPayout({
        dealer_id: dealerId, amount: Number(amount),
        payment_method: paymentMethod,
        reference_no: referenceNo.trim() || null,
        notes: notes.trim() || null,
      });
      pushToast({ title: "Payout Recorded", message: `Payout of PKR ${Number(amount).toLocaleString()} recorded`, type: "success" });
      onSaved();
    } catch (e: any) { setErr(e?.response?.data?.detail ?? "Payout failed"); }
    finally { setSaving(false); }
  };

  return (
    <AppDialog isOpen={open} onClose={onClose} title="Record Payout"
      icon={<CreditCard size={18} />} subtitle={`Payout to ${dealerName}`} size="md"
      footer={<><DialogCancelButton onClick={onClose} /><DialogSubmitButton onClick={handleSubmit} label="Record Payout" loading={saving} /></>}>
      {err && <div className="mb-4 px-3 py-2 rounded-lg text-xs" style={{ background: "rgba(239,68,68,0.08)", color: "#ef4444" }}>{err}</div>}
      <div className="mb-4 p-3 rounded-lg" style={{ background: "var(--bg-surface2)", border: "1px solid var(--border-subtle)" }}>
        <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
          Available Balance: <strong style={{ color: "var(--text-primary)" }}>PKR {currentBalance.toLocaleString()}</strong>
        </p>
      </div>
      <FormSection title="Payout Details">
        <FormRow cols={2}>
          <FormField label="Amount (PKR)" required>
            <input className="dialog-input w-full" type="number" min="0" step="0.01" value={amount}
              onChange={(e) => setAmount(e.target.value)} placeholder="0.00" />
          </FormField>
          <FormField label="Payment Method" required>
            <select className="dialog-select w-full" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option value="cash">Cash</option>
              <option value="bank">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="online">Online</option>
            </select>
          </FormField>
        </FormRow>
        <FormRow cols={2}>
          <FormField label="Reference No">
            <input className="dialog-input w-full" value={referenceNo} onChange={(e) => setReferenceNo(e.target.value)} placeholder="Cheque/Transaction #" />
          </FormField>
          <FormField label="&nbsp;" />
        </FormRow>
        <FormField label="Notes" fullWidth>
          <textarea className="dialog-textarea w-full" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
        </FormField>
      </FormSection>
    </AppDialog>
  );
}

function Clock(props: any) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
