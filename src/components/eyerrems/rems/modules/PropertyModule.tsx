import { useState } from "react";
import { Building2, MapPin, Store, Users } from "lucide-react";
import {
  buyers,
  fmtDate,
  fmtMoney,
  leases,
  properties,
  sales,
  sellers,
  townBlocks,
  towns,
  units,
  type NavModule,
} from "../data";
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
  date,
  money,
  type Column,
} from "../ui";

export default function PropertyModule({
  module,
  tab,
  onNavigate,
  detailId,
  subTab,
}: {
  module: NavModule;
  tab: string;
  onNavigate: (path: string) => void;
  detailId?: string | undefined;
  subTab?: string | undefined;
}) {
  const [selected, setSelected] = useState<Record<string, unknown> | null>(null);
  const active = module.tabs?.find((t) => t.id === tab) ?? module.tabs?.[0];

  if (detailId)
    return <TownDetail id={detailId} tab={subTab ?? "overview"} onNavigate={onNavigate} />;

  return (
    <>
      <PageHeader title="Properties" subtitle="Portfolio, inventory, leases and sales">
        <DisabledAction>Import</DisabledAction>
        <PrimaryButton>Add Property</PrimaryButton>
      </PageHeader>

      <SummaryStrip
        items={[
          { label: "Properties", value: properties.length, icon: <Building2 size={14} /> },
          {
            label: "Total units",
            value: properties.reduce((sum, p) => sum + p.units, 0),
            icon: <Store size={14} />,
            tone: "var(--rms-blue)",
          },
          {
            label: "Occupied",
            value: properties.reduce((sum, p) => sum + p.occupied_units, 0),
            icon: <Users size={14} />,
            tone: "var(--rms-green)",
          },
          {
            label: "Portfolio value",
            value: fmtMoney(properties.reduce((sum, p) => sum + p.purchase_price, 0)),
            icon: <MapPin size={14} />,
            tone: "var(--rms-accent)",
          },
        ]}
      />

      <div className="rms-tabs" role="tablist" style={{ margin: "12px 0 10px" }}>
        {module.tabs?.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={active?.id === t.id}
            className={`rms-tab ${active?.id === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/property/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "properties" && <PropertiesTable onSelect={setSelected} />}
      {tab === "units" && <UnitsTable onSelect={setSelected} />}
      {tab === "lease" && <LeaseTable onSelect={setSelected} />}
      {tab === "sales" && <SalesTable onSelect={setSelected} />}
      {tab === "buyers" && <PartyTable kind="buyers" onSelect={setSelected} />}
      {tab === "sellers" && <PartyTable kind="sellers" onSelect={setSelected} />}

      <DetailDrawer
        open={Boolean(selected)}
        title={String(
          selected?.["name"] ??
            selected?.["unit_number"] ??
            selected?.["lease_id"] ??
            selected?.["sale_id"] ??
            selected?.["party_id"] ??
            "Record",
        )}
        subtitle={`${active?.label ?? "Properties"} record`}
        onClose={() => setSelected(null)}
        fields={Object.entries(selected ?? {})
          .filter(([key]) => !["id"].includes(key))
          .map(([key, value]) => ({
            label: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
            value:
              typeof value === "number" && /rent|price|budget|deposit|value|amount/i.test(key)
                ? money(value)
                : /(date|created_at)/.test(key)
                  ? date(String(value))
                  : value == null
                    ? "—"
                    : String(value),
          }))}
      />
    </>
  );
}

function PropertiesTable({ onSelect }: { onSelect: (row: Record<string, unknown>) => void }) {
  const columns: Column<(typeof properties)[number]>[] = [
    {
      key: "property_id",
      label: "Property ID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.property_id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Property",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.name}</strong>
      ),
    },
    { key: "town", label: "Town" },
    { key: "type", label: "Type" },
    { key: "units", label: "Units", align: "right" },
    { key: "occupied_units", label: "Occupied", align: "right" },
    { key: "vacant_units", label: "Vacant", align: "right" },
    {
      key: "monthly_rent",
      label: "Monthly Rent",
      align: "right",
      render: (r) => money(r.monthly_rent),
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <DataTable
      data={properties}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      searchPlaceholder="Search properties..."
      filters={[
        {
          key: "town",
          label: "Towns",
          options: [...new Set(properties.map((p) => p.town))].map((v) => ({ value: v, label: v })),
        },
        {
          key: "type",
          label: "Types",
          options: [...new Set(properties.map((p) => p.type))].map((v) => ({ value: v, label: v })),
        },
        {
          key: "status",
          label: "Statuses",
          options: ["Active", "Under Construction"].map((v) => ({ value: v, label: v })),
        },
      ]}
      onRowClick={onSelect}
    />
  );
}

function UnitsTable({ onSelect }: { onSelect: (row: Record<string, unknown>) => void }) {
  const columns: Column<(typeof units)[number]>[] = [
    {
      key: "unit_id",
      label: "Unit ID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.unit_id}
        </span>
      ),
    },
    {
      key: "unit_number",
      label: "Unit",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.unit_number}</strong>
      ),
    },
    { key: "property_name", label: "Property" },
    { key: "floor", label: "Floor", align: "right" },
    { key: "type", label: "Type" },
    { key: "bedrooms", label: "Beds", align: "right" },
    { key: "bathrooms", label: "Baths", align: "right" },
    { key: "area_sqft", label: "Area (sqft)", align: "right" },
    { key: "rent", label: "Rent", align: "right", render: (r) => money(r.rent) },
    {
      key: "tenant_name",
      label: "Tenant",
      render: (r) => r.tenant_name ?? <span className="rms-muted">—</span>,
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <DataTable
      data={units}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      searchPlaceholder="Search units..."
      filters={[
        {
          key: "status",
          label: "Statuses",
          options: ["Occupied", "Vacant"].map((v) => ({ value: v, label: v })),
        },
        {
          key: "property_name",
          label: "Properties",
          options: [...new Set(units.map((u) => u.property_name))].map((v) => ({
            value: v,
            label: v,
          })),
        },
      ]}
      onRowClick={onSelect}
    />
  );
}

function LeaseTable({ onSelect }: { onSelect: (row: Record<string, unknown>) => void }) {
  const columns: Column<(typeof leases)[number]>[] = [
    {
      key: "lease_id",
      label: "Lease ID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.lease_id}
        </span>
      ),
    },
    {
      key: "tenant_name",
      label: "Tenant",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.tenant_name}</strong>
      ),
    },
    { key: "unit_number", label: "Unit" },
    { key: "property_name", label: "Property" },
    { key: "start_date", label: "Start", render: (r) => fmtDate(r.start_date) },
    { key: "end_date", label: "End", render: (r) => fmtDate(r.end_date) },
    { key: "monthly_rent", label: "Rent", align: "right", render: (r) => money(r.monthly_rent) },
    {
      key: "security_deposit",
      label: "Deposit",
      align: "right",
      render: (r) => money(r.security_deposit),
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <DataTable
      data={leases}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      searchPlaceholder="Search leases..."
      filters={[
        {
          key: "status",
          label: "Statuses",
          options: ["Active", "Expiring"].map((v) => ({ value: v, label: v })),
        },
      ]}
      onRowClick={onSelect}
    />
  );
}

function SalesTable({ onSelect }: { onSelect: (row: Record<string, unknown>) => void }) {
  const columns: Column<(typeof sales)[number]>[] = [
    {
      key: "sale_id",
      label: "Sale ID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.sale_id}
        </span>
      ),
    },
    { key: "property_name", label: "Property" },
    { key: "unit_number", label: "Unit" },
    {
      key: "buyer_name",
      label: "Buyer",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.buyer_name}</strong>
      ),
    },
    { key: "sale_price", label: "Sale Price", align: "right", render: (r) => money(r.sale_price) },
    { key: "paid_amount", label: "Paid", align: "right", render: (r) => money(r.paid_amount) },
    { key: "sale_date", label: "Sale Date", render: (r) => fmtDate(r.sale_date) },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <DataTable
      data={sales}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      searchPlaceholder="Search sales..."
      filters={[
        {
          key: "status",
          label: "Statuses",
          options: ["Completed", "In Progress", "Pending"].map((v) => ({ value: v, label: v })),
        },
      ]}
      onRowClick={onSelect}
    />
  );
}

function PartyTable({
  kind,
  onSelect,
}: {
  kind: "buyers" | "sellers";
  onSelect: (row: Record<string, unknown>) => void;
}) {
  const data = kind === "buyers" ? buyers : sellers;
  const columns: Column<(typeof buyers)[number]>[] = [
    {
      key: "party_id",
      label: kind === "buyers" ? "Buyer ID" : "Seller ID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.party_id}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.name}</strong>
      ),
    },
    { key: "phone", label: "Phone" },
    { key: "email", label: "Email" },
    { key: "city", label: "City" },
    { key: "interest", label: "Interest" },
    {
      key: "budget",
      label: kind === "buyers" ? "Budget" : "Asking Price",
      align: "right",
      render: (r) => money(r.budget),
    },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <DataTable
      data={data}
      columns={columns as unknown as Column<Record<string, unknown>>[]}
      searchPlaceholder={`Search ${kind}...`}
      filters={[
        {
          key: "status",
          label: "Statuses",
          options: [...new Set(data.map((p) => p.status))].map((v) => ({ value: v, label: v })),
        },
      ]}
      onRowClick={onSelect}
    />
  );
}

export function TownsModule({
  module,
  detailId,
  subTab,
  onNavigate,
}: {
  module: NavModule;
  detailId?: string | undefined;
  subTab?: string | undefined;
  onNavigate: (path: string) => void;
}) {
  if (detailId) {
    return <TownDetail id={detailId} tab={subTab ?? "overview"} onNavigate={onNavigate} />;
  }
  const columns: Column<(typeof towns)[number]>[] = [
    {
      key: "tid",
      label: "TID",
      render: (r) => (
        <span className="rms-mono" style={{ color: "#60a5fa" }}>
          {r.tid}
        </span>
      ),
    },
    {
      key: "name",
      label: "Name",
      render: (r) => (
        <strong style={{ color: "var(--rms-text)", fontWeight: 500 }}>{r.name}</strong>
      ),
    },
    {
      key: "location",
      label: "Location",
      render: (r) => (
        <span style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
          <MapPin size={11} />
          {r.location}
        </span>
      ),
    },
    { key: "block_count", label: "Blocks", align: "right" },
    { key: "plot_count", label: "Plots", align: "right" },
    { key: "property_count", label: "Properties", align: "right" },
    { key: "status", label: "Status", render: (r) => <StatusBadge status={r.status} /> },
  ];
  return (
    <>
      <PageHeader title="Town Management" subtitle="Towns, blocks and plot inventory">
        <PrimaryButton>Add Town</PrimaryButton>
      </PageHeader>
      <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
        <StatCard label="Towns" value={towns.length} icon={<MapPin size={15} />} />
        <StatCard
          label="Blocks / Sectors"
          value={towns.reduce((s, t) => s + t.block_count, 0)}
          icon={<Store size={15} />}
          tone="blue"
        />
        <StatCard
          label="Total Plots"
          value={towns.reduce((s, t) => s + t.plot_count, 0)}
          icon={<Building2 size={15} />}
          tone="violet"
        />
        <StatCard
          label="Linked Properties"
          value={towns.reduce((s, t) => s + t.property_count, 0)}
          icon={<Users size={15} />}
          tone="green"
        />
      </div>
      <DataTable
        data={towns}
        columns={columns as unknown as Column<Record<string, unknown>>[]}
        searchPlaceholder="Search towns..."
        onRowClick={(row) => onNavigate(`/towns/${String(row["tid"])}`)}
      />
      <div style={{ display: "none" }}>{module.label}</div>
    </>
  );
}

function TownDetail({
  id,
  tab,
  onNavigate,
}: {
  id: string;
  tab: string;
  onNavigate: (path: string) => void;
}) {
  const town = towns.find((t) => t.tid === id || t.name === id) ?? towns[0]!;
  const activeTab = ["overview", "blocks", "units"].includes(tab) ? tab : "overview";
  const blocks = townBlocks(town);
  const totalPlots = blocks.reduce((s, b) => s + b.plots, 0);
  const sold = blocks.reduce((s, b) => s + b.sold, 0);
  const available = blocks.reduce((s, b) => s + b.available, 0);

  return (
    <>
      <PageHeader title={town.name} subtitle={`${town.location} · ${town.tid}`}>
        <button type="button" className="rms-btn is-secondary" onClick={() => onNavigate("/towns")}>
          ← Back to Towns
        </button>
        <PrimaryButton>Add Unit</PrimaryButton>
      </PageHeader>
      <div className="rms-tabs" role="tablist" style={{ marginBottom: 10 }}>
        {[
          { id: "overview", label: "Overview" },
          { id: "blocks", label: "Blocks & Sectors" },
          { id: "units", label: "Units & Plots Directory" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={activeTab === t.id}
            className={`rms-tab ${activeTab === t.id ? "is-active" : ""}`}
            onClick={() => onNavigate(`/towns/${town.tid}/${t.id}`)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <>
          <div className="rms-grid cols-4" style={{ marginBottom: 10 }}>
            <StatCard label="Sectors / Blocks" value={blocks.length} />
            <StatCard label="Total Plots" value={totalPlots} tone="blue" />
            <StatCard label="Available Inventory" value={available} tone="green" />
            <StatCard label="Sold Out" value={sold} tone="red" />
          </div>
          <div className="rms-split">
            <Card title="Town Information">
              <dl className="rms-kv">
                <div>
                  <dt>Town ID</dt>
                  <dd>{town.tid}</dd>
                </div>
                <div>
                  <dt>Town name</dt>
                  <dd>{town.name}</dd>
                </div>
                <div>
                  <dt>Location</dt>
                  <dd>{town.location}</dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <StatusBadge status={town.status} />
                  </dd>
                </div>
                <div>
                  <dt>Blocks</dt>
                  <dd>{town.block_count}</dd>
                </div>
                <div>
                  <dt>Plots</dt>
                  <dd>{town.plot_count}</dd>
                </div>
                <div>
                  <dt>Linked properties</dt>
                  <dd>{town.property_count}</dd>
                </div>
                <div>
                  <dt>Units</dt>
                  <dd>{town.units}</dd>
                </div>
              </dl>
            </Card>
            <Card title="Block Summary">
              <ul className="rms-list">
                {blocks.map((b) => (
                  <li key={b.id}>
                    <div className="rms-list-main">
                      <strong>{b.block}</strong>
                      <span>
                        {b.plots} plots · {b.available} available
                      </span>
                    </div>
                    <StatusBadge status={b.status} />
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </>
      )}

      {activeTab === "blocks" && (
        <Card title="Blocks & Sectors" subtitle={`${blocks.length} blocks in ${town.name}`}>
          <div className="rms-grid cols-3">
            {blocks.map((b) => (
              <div key={b.id} className="rms-project-card">
                <h3>{b.block}</h3>
                <p>
                  {b.plots} plots · {b.sold} sold · {b.available} available
                </p>
                <StatusBadge status={b.status} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "units" && (
        <DataTable
          data={blocks.flatMap((b, bi) =>
            Array.from({ length: 4 }, (_, ui) => ({
              id: `${bi}-${ui}`,
              unit_number: `${b.block.replace("Block ", "")}-${ui + 1}0${bi + 1}`,
              size_label: `${5 + ui * 2} Marla`,
              unit_type: ["Residential", "Commercial", "Plot"][ui % 3],
              status: ["Available", "Sold", "Reserved", "Available"][ui],
              total_price: 4_500_000 + ui * 1_800_000 + bi * 250_000,
              owner_name: ui === 1 ? "Fictional Owner A" : null,
            })),
          )}
          searchPlaceholder="Search plots..."
          filters={[
            {
              key: "unit_type",
              label: "Types",
              options: ["Residential", "Commercial", "Plot"].map((v) => ({ value: v, label: v })),
            },
            {
              key: "status",
              label: "Statuses",
              options: ["Available", "Sold", "Reserved"].map((v) => ({ value: v, label: v })),
            },
          ]}
          columns={[
            {
              key: "unit_number",
              label: "Plot #",
              render: (r) => (
                <strong style={{ color: "var(--rms-text)" }}>{String(r.unit_number)}</strong>
              ),
            },
            { key: "size_label", label: "Size" },
            { key: "unit_type", label: "Type" },
            {
              key: "status",
              label: "Status",
              render: (r) => <StatusBadge status={String(r.status)} />,
            },
            {
              key: "total_price",
              label: "Price",
              align: "right",
              render: (r) => money(Number(r.total_price)),
            },
            {
              key: "owner_name",
              label: "Owner",
              render: (r) =>
                r.owner_name ? String(r.owner_name) : <span className="rms-muted">—</span>,
            },
          ]}
        />
      )}
    </>
  );
}
