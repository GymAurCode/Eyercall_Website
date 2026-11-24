/**
 * Connected stores.
 *
 * A store is only shown as "live verified" when the main process recorded a
 * real authenticated call. The verification column is the truth; the
 * connection state says whether we may talk to the store right now, and neither
 * is inferred from a configured URL.
 */

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { KeyRound, PlugZap, Plus, RefreshCw, ShieldOff } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatQuantity, parseQuantity } from "../../lib/format";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type {
  EcomChannel,
  EcomChannelInput,
  EcomPlatform,
  EcomStockPolicy,
  EcomSyncMode,
} from "../../../shared/ecom";
import { ConnectionBadge, VerificationBadge, useEcomChannels } from "./EcomShared";

interface ChannelForm {
  id: number | null;
  platform: EcomPlatform;
  name: string;
  storeUrl: string;
  region: string;
  currency: string;
  timeZone: string;
  branch: string;
  syncMode: EcomSyncMode;
  externalStoreId: string;
  accessToken: string;
  refreshToken: string;
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  tokenExpiresAt: string;
}

const EMPTY_FORM: ChannelForm = {
  id: null,
  platform: "shopify",
  name: "",
  storeUrl: "",
  region: "",
  currency: "PKR",
  timeZone: "Asia/Karachi",
  branch: "Main",
  syncMode: "webhook",
  externalStoreId: "",
  accessToken: "",
  refreshToken: "",
  apiKey: "",
  apiSecret: "",
  webhookSecret: "",
  tokenExpiresAt: "",
};

const PLATFORM_OPTIONS = [
  { value: "shopify", label: "Shopify" },
  { value: "woocommerce", label: "WooCommerce" },
  { value: "daraz", label: "Daraz" },
  { value: "amazon", label: "Amazon" },
  { value: "tiktok", label: "TikTok Shop" },
  { value: "generic", label: "Generic webhook" },
];

const SYNC_OPTIONS = [
  { value: "webhook", label: "Webhooks with polling fallback" },
  { value: "polling", label: "Polling only" },
  { value: "manual", label: "Manual only" },
];

function formFrom(channel: EcomChannel): ChannelForm {
  return {
    id: channel.id,
    platform: channel.platform,
    name: channel.name,
    storeUrl: channel.storeUrl,
    region: channel.region,
    currency: channel.currency,
    timeZone: channel.timeZone,
    branch: channel.branch,
    syncMode: channel.syncMode,
    externalStoreId: channel.externalStoreId ?? "",
    accessToken: "",
    refreshToken: "",
    apiKey: "",
    apiSecret: "",
    webhookSecret: "",
    tokenExpiresAt: channel.tokenExpiresAt ?? "",
  };
}

function inputFrom(form: ChannelForm): EcomChannelInput {
  const blankToNull = (value: string): string | null => (value.trim() === "" ? null : value.trim());
  return {
    ...(form.id === null ? {} : { id: form.id }),
    platform: form.platform,
    name: form.name.trim(),
    storeUrl: form.storeUrl.trim(),
    region: form.region.trim(),
    currency: form.currency.trim().toUpperCase(),
    timeZone: form.timeZone.trim(),
    branch: form.branch.trim(),
    syncMode: form.syncMode,
    externalStoreId: blankToNull(form.externalStoreId),
    accessToken: blankToNull(form.accessToken),
    refreshToken: blankToNull(form.refreshToken),
    apiKey: blankToNull(form.apiKey),
    apiSecret: blankToNull(form.apiSecret),
    webhookSecret: blankToNull(form.webhookSecret),
    tokenExpiresAt: blankToNull(form.tokenExpiresAt),
  };
}

export function EcomChannelsPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const query = useEcomChannels();
  const [form, setForm] = useState<ChannelForm | null>(null);
  const [policyFor, setPolicyFor] = useState<EcomChannel | null>(null);
  const [error, setError] = useState("");

  const providers = useQuery({
    queryKey: ["ecom", "providers"],
    queryFn: () => call("ecom.providers.list", {}),
    enabled: can("ecommerce", "view"),
  });

  const save = useMutation({
    mutationFn: (input: EcomChannelInput) => call("ecom.channels.save", input),
    onSuccess: async (channel) => {
      setForm(null);
      setError("");
      await client.invalidateQueries({ queryKey: ["ecom", "channels"] });
      toast.success(`Store "${channel.name}" saved. Test the connection before relying on it.`);
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  const test = useMutation({
    mutationFn: (id: number) => call("ecom.channels.test", { id }),
    onSuccess: async (channel) => {
      await client.invalidateQueries({ queryKey: ["ecom", "channels"] });
      if (channel.verification === "live_verified") {
        toast.success(`${channel.name} answered a real authenticated call.`);
      } else {
        toast.warning(`${channel.name}: ${channel.verification}. ${channel.lastError ?? ""}`);
      }
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const state = useMutation({
    mutationFn: (input: { id: number; state: "paused" | "connected" | "revoked" }) =>
      call("ecom.channels.state", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "channels"] });
      toast.success("Store state updated.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const disconnect = useMutation({
    mutationFn: (id: number) => call("ecom.channels.disconnect", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "channels"] });
      toast.success("Credentials removed and the store disconnected.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const channels = query.data ?? [];
  const editable = can("ecommerce", "edit");

  const columns: readonly Column<EcomChannel>[] = [
    {
      id: "name",
      header: "Store",
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[var(--text)]">{row.name}</p>
          <p className="truncate text-xs text-[var(--text-3)]">{row.storeUrl || "No URL recorded"}</p>
        </div>
      ),
    },
    { id: "platform", header: "Platform", cell: (row) => row.platform },
    {
      id: "connection",
      header: "Connection",
      cell: (row) => <ConnectionBadge value={row.connectionState} />,
      sortValue: (row) => row.connectionState,
    },
    {
      id: "verification",
      header: "Verification",
      cell: (row) => <VerificationBadge value={row.verification} />,
      sortValue: (row) => row.verification,
    },
    {
      id: "token",
      header: "Credentials",
      cell: (row) => (
        <div className="space-y-1">
          <Badge tone={row.credentialConfigured ? "success" : "neutral"}>
            {row.credentialConfigured ? "configured" : "none"}
          </Badge>
          <p className="text-xs text-[var(--text-3)]">{row.tokenStatus}</p>
        </div>
      ),
    },
    { id: "syncMode", header: "Sync", cell: (row) => row.syncMode },
    {
      id: "lastSuccessSyncAt",
      header: "Last success",
      cell: (row) => row.lastSuccessSyncAt?.slice(0, 19).replace("T", " ") ?? "Never",
    },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          {editable && (
            <Button size="sm" variant="secondary" onClick={() => { setForm(formFrom(row)); setError(""); }}>
              Edit
            </Button>
          )}
          {editable && (
            <Button
              size="sm"
              variant="secondary"
              disabled={test.isPending}
              onClick={() => test.mutate(row.id)}
            >
              <PlugZap className="h-4 w-4" />
              Test
            </Button>
          )}
          {editable && (
            <Button size="sm" variant="secondary" onClick={() => setPolicyFor(row)}>
              Stock policy
            </Button>
          )}
          {editable && (
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                state.mutate({
                  id: row.id,
                  state: (row.connectionState === "paused" ? "connected" : "paused") as
                    | "paused"
                    | "connected",
                })
              }
            >
              {row.connectionState === "paused" ? "Resume" : "Pause"}
            </Button>
          )}
          {editable && row.credentialConfigured && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                if (window.confirm(`Remove the stored credentials for ${row.name}?`)) {
                  disconnect.mutate(row.id);
                }
              }}
            >
              <ShieldOff className="h-4 w-4" />
              Disconnect
            </Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Connected stores"
        description="Channel connections, credential state and the evidence behind each status"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => { setForm(EMPTY_FORM); setError(""); }}>
                Connect store
              </Button>
            )}
          </div>
        }
      />

      <Card flush>
        <CardHeader
          title="Provider readiness"
          description="Documented API contract status for each platform this build implements"
        />
        <CardBody>
          {providers.isPending ? (
            <TableSkeleton columns={2} />
          ) : (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {(providers.data ?? []).map((provider) => (
                <div key={provider.platform} className="rounded-lg border border-[var(--border)] p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[var(--text)]">{provider.label}</p>
                      <p className="text-xs text-[var(--text-3)]">
                        {provider.authModel} · {provider.apiVersion}
                      </p>
                    </div>
                    <VerificationBadge value={provider.readiness} />
                  </div>
                  <p className="mt-2 text-xs text-[var(--text-2)]">{provider.readinessNote}</p>
                  <a
                    className="mt-1 inline-block text-xs text-[var(--brand)] underline"
                    href={provider.docsUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Provider documentation
                  </a>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {query.isPending ? (
        <TableSkeleton columns={columns.length} />
      ) : (
        <Table
          rows={channels}
          rowKey={(row) => row.id}
          columns={columns}
          loading={false}
          error={query.error}
          onRetry={() => void query.refetch()}
          emptyState="No store has been connected yet. Connect a store to import its orders and publish stock."
        />
      )}

      <Dialog
        open={form !== null}
        onOpenChange={(open) => {
          if (!open) setForm(null);
        }}
        title={form?.id === null ? "Connect a store" : "Edit store"}
        description="Credentials are encrypted on this computer and are never returned to the screen."
        busy={save.isPending}
        size="lg"
      >
        {form === null ? null : (
          <form
            className="space-y-4"
            onSubmit={(event: FormEvent) => {
              event.preventDefault();
              save.mutate(inputFrom(form));
            }}
          >
            {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Platform" required>
                {(id) => (
                  <Select
                    id={id}
                    value={form.platform}
                    onChange={(value) => setForm({ ...form, platform: value as EcomPlatform })}
                    options={PLATFORM_OPTIONS}
                  />
                )}
              </Field>
              <Field label="Display name" required>
                {(id) => (
                  <Input
                    id={id}
                    value={form.name}
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="e.g. Lahore flagship"
                  />
                )}
              </Field>
              <Field label="Store URL" hint="The storefront or admin base URL recorded for operators.">
                {(id) => (
                  <Input
                    id={id}
                    value={form.storeUrl}
                    onChange={(event) => setForm({ ...form, storeUrl: event.target.value })}
                    placeholder="https://store.example.com"
                  />
                )}
              </Field>
              <Field label="External store id" hint="Shop domain, WooCommerce site id or Daraz seller id.">
                {(id) => (
                  <Input
                    id={id}
                    value={form.externalStoreId}
                    onChange={(event) => setForm({ ...form, externalStoreId: event.target.value })}
                  />
                )}
              </Field>
              <Field label="Region">
                {(id) => (
                  <Input id={id} value={form.region} onChange={(event) => setForm({ ...form, region: event.target.value })} />
                )}
              </Field>
              <Field label="Currency" required>
                {(id) => (
                  <Input
                    id={id}
                    value={form.currency}
                    maxLength={3}
                    onChange={(event) => setForm({ ...form, currency: event.target.value })}
                  />
                )}
              </Field>
              <Field label="Time zone">
                {(id) => (
                  <Input id={id} value={form.timeZone} onChange={(event) => setForm({ ...form, timeZone: event.target.value })} />
                )}
              </Field>
              <Field label="Branch">
                {(id) => (
                  <Input id={id} value={form.branch} onChange={(event) => setForm({ ...form, branch: event.target.value })} />
                )}
              </Field>
              <Field label="Sync mode" required>
                {(id) => (
                  <Select
                    id={id}
                    value={form.syncMode}
                    onChange={(value) => setForm({ ...form, syncMode: value as EcomSyncMode })}
                    options={SYNC_OPTIONS}
                  />
                )}
              </Field>
            </div>

            <div className="rounded-lg border border-[var(--border)] p-3">
              <p className="mb-3 flex items-center gap-2 text-[13px] font-medium text-[var(--text)]">
                <KeyRound className="h-4 w-4" />
                Credentials
              </p>
              <p className="mb-3 text-xs text-[var(--text-3)]">
                Leave a secret blank to keep the stored value. Nothing typed here is ever sent back to the
                renderer after saving.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Access token">
                  {(id) => (
                    <Input
                      id={id}
                      type="password"
                      autoComplete="off"
                      value={form.accessToken}
                      onChange={(event) => setForm({ ...form, accessToken: event.target.value })}
                    />
                  )}
                </Field>
                <Field label="Refresh token">
                  {(id) => (
                    <Input
                      id={id}
                      type="password"
                      autoComplete="off"
                      value={form.refreshToken}
                      onChange={(event) => setForm({ ...form, refreshToken: event.target.value })}
                    />
                  )}
                </Field>
                <Field label="API key / consumer key">
                  {(id) => (
                    <Input
                      id={id}
                      type="password"
                      autoComplete="off"
                      value={form.apiKey}
                      onChange={(event) => setForm({ ...form, apiKey: event.target.value })}
                    />
                  )}
                </Field>
                <Field label="API secret / consumer secret">
                  {(id) => (
                    <Input
                      id={id}
                      type="password"
                      autoComplete="off"
                      value={form.apiSecret}
                      onChange={(event) => setForm({ ...form, apiSecret: event.target.value })}
                    />
                  )}
                </Field>
                <Field label="Webhook secret" hint="Used to verify inbound webhook signatures.">
                  {(id) => (
                    <Input
                      id={id}
                      type="password"
                      autoComplete="off"
                      value={form.webhookSecret}
                      onChange={(event) => setForm({ ...form, webhookSecret: event.target.value })}
                    />
                  )}
                </Field>
                <Field label="Token expires at">
                  {(id) => (
                    <Input
                      id={id}
                      type="datetime-local"
                      value={form.tokenExpiresAt}
                      onChange={(event) => setForm({ ...form, tokenExpiresAt: event.target.value })}
                    />
                  )}
                </Field>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={() => setForm(null)}>
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                Save store
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      <StockPolicyDialog
        channel={policyFor}
        onClose={() => setPolicyFor(null)}
        readOnly={!editable}
      />
    </div>
  );
}

function StockPolicyDialog({
  channel,
  onClose,
  readOnly,
}: {
  readonly channel: EcomChannel | null;
  readonly onClose: () => void;
  readonly readOnly: boolean;
}): React.JSX.Element {
  const client = useQueryClient();
  const [buffer, setBuffer] = useState("0");
  const [min, setMin] = useState("0");
  const [max, setMax] = useState("");
  const [frequency, setFrequency] = useState("15");
  const [oosPolicy, setOosPolicy] = useState<EcomStockPolicy["oosPolicy"]>("publish_zero");
  const [allowBackorders, setAllowBackorders] = useState(false);
  const [error, setError] = useState("");

  const policy = useQuery({
    queryKey: ["ecom", "stockPolicy", channel?.id],
    queryFn: () => call("ecom.channels.stockPolicy.get", { id: channel?.id ?? 0 }),
    enabled: channel !== null,
  });

  const loaded = policy.data;
  const [hydratedFor, setHydratedFor] = useState<number | null>(null);
  if (loaded !== undefined && channel !== null && hydratedFor !== channel.id) {
    setHydratedFor(channel.id);
    setBuffer(formatQuantity(loaded.safetyBufferMilli));
    setMin(formatQuantity(loaded.minExportMilli));
    setMax(loaded.maxExportMilli === null ? "" : formatQuantity(loaded.maxExportMilli));
    setFrequency(String(loaded.syncFrequencyMinutes));
    setOosPolicy(loaded.oosPolicy);
    setAllowBackorders(loaded.allowBackorders);
  }

  const save = useMutation({
    mutationFn: () => {
      if (channel === null) throw new Error("No store selected.");
      const safetyBufferMilli = parseQuantity(buffer) ?? 0;
      const minExportMilli = parseQuantity(min) ?? 0;
      const maxExportMilli = max.trim() === "" ? null : parseQuantity(max);
      return call("ecom.channels.stockPolicy.save", {
        channelId: channel.id,
        safetyBufferMilli,
        minExportMilli,
        maxExportMilli,
        syncFrequencyMinutes: Number(frequency),
        allowBackorders,
        oosPolicy,
      });
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "stockPolicy"] });
      toast.success("Stock policy saved.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  return (
    <Dialog
      open={channel !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={channel === null ? "Stock policy" : `Stock policy · ${channel.name}`}
      description="How the available IMS quantity becomes the quantity this store is allowed to sell."
      busy={save.isPending}
    >
      <form
        className="space-y-4"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          save.mutate();
        }}
      >
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Safety buffer" hint="Held back from every export to absorb race conditions.">
            {(id) => <Input id={id} value={buffer} disabled={readOnly} onChange={(e) => setBuffer(e.target.value)} />}
          </Field>
          <Field label="Minimum export" hint="Below this the store is treated as out of stock.">
            {(id) => <Input id={id} value={min} disabled={readOnly} onChange={(e) => setMin(e.target.value)} />}
          </Field>
          <Field label="Maximum export" hint="Blank means no cap.">
            {(id) => <Input id={id} value={max} disabled={readOnly} onChange={(e) => setMax(e.target.value)} />}
          </Field>
          <Field label="Sync frequency (minutes)">
            {(id) => (
              <Input
                id={id}
                type="number"
                min={1}
                value={frequency}
                disabled={readOnly}
                onChange={(e) => setFrequency(e.target.value)}
              />
            )}
          </Field>
          <Field label="Out-of-stock policy">
            {(id) => (
              <Select
                id={id}
                value={oosPolicy}
                disabled={readOnly}
                onChange={(value) => setOosPolicy(value as EcomStockPolicy["oosPolicy"])}
                options={[
                  { value: "publish_zero", label: "Publish zero" },
                  { value: "hide_listing", label: "Hide listing" },
                  { value: "keep_last", label: "Keep last quantity" },
                ]}
              />
            )}
          </Field>
          <Field label="Backorders">
            {(id) => (
              <Select
                id={id}
                value={allowBackorders ? "yes" : "no"}
                disabled={readOnly}
                onChange={(value) => setAllowBackorders(value === "yes")}
                options={[
                  { value: "no", label: "Not allowed" },
                  { value: "yes", label: "Allowed" },
                ]}
              />
            )}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          {!readOnly && (
            <Button type="submit" disabled={save.isPending || policy.isPending}>
              Save policy
            </Button>
          )}
        </div>
      </form>
    </Dialog>
  );
}
