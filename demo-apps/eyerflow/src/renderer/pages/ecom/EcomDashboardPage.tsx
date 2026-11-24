/**
 * E-commerce Operations dashboard.
 *
 * Every figure is read from stored evidence: imported channel orders, stock
 * snapshots, queued jobs and payout rows. A brand-new shop reads zero, which is
 * the honest answer; nothing here is seeded for appearance.
 */

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpRight,
  Boxes,
  Link2,
  Megaphone,
  RefreshCw,
  ShoppingCart,
  Store,
  Truck,
  WalletCards,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatMoney } from "../../lib/format";
import { ECOM_PATH } from "../../lib/ims-nav";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { ChartCard } from "../../components/ui/ChartCard";
import { EmptyState, PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { StatCard } from "../../components/ui/StatCard";
import { Badge } from "../../components/ui/Badge";
import { VerificationBadge } from "./EcomShared";

export function EcomDashboardPage(): React.JSX.Element {
  const { can } = useApp();
  const navigate = useNavigate();

  const dashboard = useQuery({
    queryKey: ["ecom", "dashboard"],
    queryFn: () => call("ecom.dashboard", {}),
    enabled: can("ecommerce", "view"),
  });
  const providers = useQuery({
    queryKey: ["ecom", "providers"],
    queryFn: () => call("ecom.providers.list", {}),
    enabled: can("ecommerce", "view"),
  });

  if (dashboard.isPending) {
    return (
      <div className="space-y-5">
        <PageHeader title="Commerce Operations" description="Loading channel evidence…" />
        <TableSkeleton columns={4} />
      </div>
    );
  }

  if (dashboard.isError || dashboard.data === undefined) {
    return (
      <Card>
        <EmptyState
          title="The commerce dashboard could not load"
          description={errorMessage(dashboard.error)}
          icon={<AlertTriangle className="h-5 w-5" />}
          actionLabel="Try again"
          onAction={() => void dashboard.refetch()}
        />
      </Card>
    );
  }

  const data = dashboard.data;
  const kpi = data.kpi;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Commerce Operations"
        description={`Channel sales, stock, fulfilment and settlements · generated ${data.generatedAt.slice(0, 19).replace("T", " ")}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void dashboard.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button size="sm" onClick={() => navigate(ECOM_PATH.sync)}>
              Open sync centre
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Connected stores"
          value={String(kpi.connectedStores)}
          hint="Authenticated connections"
          icon={<Store className="h-5 w-5" />}
          tone="brand"
          onClick={() => navigate(ECOM_PATH.channels)}
        />
        <StatCard
          label="Imported channel orders"
          value={String(kpi.totalImportedOrders)}
          hint={`${String(kpi.awaitingProcessing)} awaiting processing`}
          icon={<ShoppingCart className="h-5 w-5" />}
          tone="info"
          onClick={() => navigate(ECOM_PATH.orders)}
        />
        <StatCard
          label="Gross channel sales"
          value={formatMoney(kpi.grossChannelSalesFils)}
          hint={`Net ${formatMoney(kpi.netChannelSalesFils)} after refunds`}
          icon={<ArrowUpRight className="h-5 w-5" />}
          tone="success"
        />
        <StatCard
          label="Marketplace fees"
          value={formatMoney(kpi.marketplaceFeesFils)}
          hint={`${formatMoney(kpi.pendingPayoutsFils)} pending payout`}
          icon={<WalletCards className="h-5 w-5" />}
          tone="violet"
          onClick={() => navigate(ECOM_PATH.payouts)}
        />
        <StatCard
          label="Listings published"
          value={String(kpi.listingsPublished)}
          hint={`${String(kpi.outOfStockListings)} published but out of stock`}
          icon={<Boxes className="h-5 w-5" />}
          tone="neutral"
          onClick={() => navigate(ECOM_PATH.listings)}
        />
        <StatCard
          label="Awaiting fulfilment"
          value={String(kpi.awaitingFulfillment)}
          hint="Shipment links pending"
          icon={<Truck className="h-5 w-5" />}
          tone="warning"
          onClick={() => navigate(ECOM_PATH.shipments)}
        />
        <StatCard
          label="Sync failures"
          value={String(kpi.syncFailures)}
          hint={`${String(kpi.stockSyncDelays)} stock jobs delayed`}
          icon={<RefreshCw className="h-5 w-5" />}
          tone={kpi.syncFailures > 0 ? "danger" : "success"}
          onClick={() => navigate(ECOM_PATH.sync)}
        />
        <StatCard
          label="Open exceptions"
          value={String(data.uncaughtExceptions)}
          hint={`${String(kpi.pendingMappings)} unmapped lines · ${String(data.pendingReturns)} returns open`}
          icon={<Link2 className="h-5 w-5" />}
          tone={data.uncaughtExceptions > 0 ? "danger" : "neutral"}
          onClick={() => navigate(ECOM_PATH.exceptions)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <ChartCard
          title="Channel sales over time"
          subtitle="Imported orders by day"
          className="xl:col-span-2"
          empty={data.salesOverTime.length === 0}
          height={220}
          emptyMessage="No channel orders have been imported yet."
        >
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={data.salesOverTime.map((point) => ({ day: point.label, value: point.value / 100 }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} width={60} />
              <Tooltip formatter={(value: unknown) => formatMoney(Math.round(Number(value) * 100))} />
              <Bar dataKey="value" fill="var(--brand)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <Card flush>
          <CardHeader
            title="Store revenue"
            description="Gross value of imported orders"
            actions={
              <Button size="sm" variant="ghost" onClick={() => navigate(ECOM_PATH.channels)}>
                Stores
              </Button>
            }
          />
          <CardBody>
            {data.revenueByStore.length === 0 ? (
              <p className="text-sm text-[var(--text-3)]">No stores configured.</p>
            ) : (
              <ul className="space-y-3">
                {data.revenueByStore.map((row) => (
                  <li key={row.name} className="flex items-center justify-between gap-3">
                    <span className="truncate text-[13px] text-[var(--text)]">{row.name}</span>
                    <span className="tabular text-[13px] font-medium text-[var(--text)]">
                      {formatMoney(row.value)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card flush className="xl:col-span-2">
          <CardHeader
            title="Recent sync activity"
            description={`Success rate ${data.syncSuccessRate === null ? "not measurable yet" : `${String(data.syncSuccessRate)}%`}`}
            actions={
              <Button size="sm" variant="ghost" onClick={() => navigate(ECOM_PATH.sync)}>
                Sync centre
              </Button>
            }
          />
          <CardBody>
            {data.recentJobs.length === 0 ? (
              <p className="text-sm text-[var(--text-3)]">No sync jobs have run yet.</p>
            ) : (
              <ul className="divide-y divide-[var(--divider)]">
                {data.recentJobs.map((job) => (
                  <li key={job.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[var(--text)]">
                        {job.kind} · {job.channelName}
                      </p>
                      <p className="truncate text-xs text-[var(--text-3)]">
                        {job.lastError ?? `attempt ${String(job.attempts)} of ${String(job.maxAttempts)}`}
                      </p>
                    </div>
                    <Badge
                      tone={
                        job.status === "succeeded"
                          ? "success"
                          : job.status === "dead_letter" || job.status === "failed"
                            ? "danger"
                            : "warning"
                      }
                    >
                      {job.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>

        <Card flush>
          <CardHeader title="Provider readiness" description="What is actually verified" />
          <CardBody>
            <ul className="space-y-3">
              {(providers.data ?? []).map((provider) => (
                <li key={provider.platform} className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[13px] font-medium text-[var(--text)]">{provider.label}</span>
                    <VerificationBadge value={provider.readiness} />
                  </div>
                  <p className="text-xs text-[var(--text-3)]">{provider.readinessNote}</p>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      {(data.disconnectedStores.length > 0 || !data.costDataComplete) && (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          {data.disconnectedStores.length > 0 && (
            <Card flush>
              <CardHeader title="Stores needing attention" description="Not connected, paused or degraded" />
              <CardBody>
                <ul className="divide-y divide-[var(--divider)]">
                  {data.disconnectedStores.map((channel) => (
                    <li key={channel.id} className="flex items-center justify-between gap-3 py-2 first:pt-0 last:pb-0">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-medium text-[var(--text)]">{channel.name}</p>
                        <p className="truncate text-xs text-[var(--text-3)]">
                          {channel.lastError ?? `${channel.connectionState} · ${channel.verification}`}
                        </p>
                      </div>
                      <Button size="sm" variant="secondary" onClick={() => navigate(ECOM_PATH.channels)}>
                        Review
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}
          {!data.costDataComplete && (
            <Card flush>
              <CardHeader title="Cost data is incomplete" description="Margin figures are withheld rather than guessed" />
              <CardBody>
                <p className="text-sm text-[var(--text-2)]">
                  Some active products have no average cost. Channel profit is not shown until every product a
                  channel sells has a cost basis, because a margin built on missing costs is a made-up number.
                </p>
              </CardBody>
            </Card>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card flush>
          <CardHeader title="Top products" description="By channel order value" />
          <CardBody>
            {data.topProducts.length === 0 ? (
              <p className="text-sm text-[var(--text-3)]">No imported order lines yet.</p>
            ) : (
              <ul className="space-y-2">
                {data.topProducts.map((row) => (
                  <li key={row.name} className="flex justify-between gap-3 text-[13px]">
                    <span className="truncate text-[var(--text)]">{row.name}</span>
                    <span className="tabular text-[var(--text-2)]">{formatMoney(row.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card flush>
          <CardHeader title="Listing health" description="By publish status" />
          <CardBody>
            {data.listingHealth.length === 0 ? (
              <p className="text-sm text-[var(--text-3)]">No listings yet.</p>
            ) : (
              <ul className="space-y-2">
                {data.listingHealth.map((row) => (
                  <li key={row.name} className="flex justify-between gap-3 text-[13px]">
                    <span className="text-[var(--text)]">{row.name}</span>
                    <span className="tabular text-[var(--text-2)]">{String(row.value)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card flush>
          <CardHeader
            title="Marketing"
            description="Spend and attributed revenue"
            actions={
              <Button size="sm" variant="ghost" onClick={() => navigate(ECOM_PATH.marketing)}>
                <Megaphone className="h-4 w-4" />
                Campaigns
              </Button>
            }
          />
          <CardBody>
            <p className="text-sm text-[var(--text-2)]">
              Campaign spend is recorded per store and reconciled against attributed revenue. A report with no
              campaigns reads as unmeasured, not as zero return.
            </p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
