/**
 * Marketing campaigns across connected stores.
 */

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatMoney } from "../../lib/format";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, MoneyInput, Select } from "../../components/ui/Input";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomCampaign, EcomCampaignInput, EcomPlatform } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

export function EcomMarketingPage(): React.JSX.Element {
  const { can } = useApp();
  const [channelId] = useState("");
  const [dialog, setDialog] = useState<EcomCampaign | "new" | null>(null);
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const editable = can("ecommerce", "edit");

  const campaigns = useQuery({
    queryKey: ["ecom", "marketing", channelId],
    queryFn: () =>
      call("ecom.marketing.list", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        fromDate: "2000-01-01",
        toDate: "2099-12-31",
      }),
    enabled: can("ecommerce", "view"),
  });

  const summary = useQuery({
    queryKey: ["ecom", "marketingSummary"],
    queryFn: () => call("ecom.marketing.summary", {}),
    enabled: can("ecommerce", "view"),
  });

  const rows = campaigns.data ?? [];
  const summaryData = summary.data;

  const columns: readonly Column<EcomCampaign>[] = [
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "name", header: "Campaign", cell: (row) => row.name },
    { id: "startsOn", header: "From", cell: (row) => row.startsOn },
    { id: "endsOn", header: "To", cell: (row) => row.endsOn },
    { id: "spendFils", header: "Spend", cell: (row) => formatMoney(row.spendFils), align: "end" },
    { id: "attributedOrders", header: "Attributed orders", cell: (row) => String(row.attributedOrders), align: "end" },
    { id: "attributedRevenueFils", header: "Attributed revenue", cell: (row) => formatMoney(row.attributedRevenueFils), align: "end" },
    { id: "roas", header: "ROAS", cell: (row) => (row.spendFils > 0 ? (row.attributedRevenueFils / row.spendFils).toFixed(2) : "—") },
  ];

  const summaryColumns: readonly Column<{ readonly channelName: string; readonly spendFils: number; readonly attributedOrders: number; readonly attributedRevenueFils: number; readonly roas: number | null }>[] =
    [
      { id: "channelName", header: "Store", cell: (row) => row.channelName },
      { id: "spendFils", header: "Spend", cell: (row) => formatMoney(row.spendFils), align: "end" },
      { id: "attributedOrders", header: "Attributed orders", cell: (row) => String(row.attributedOrders), align: "end" },
      { id: "attributedRevenueFils", header: "Attributed revenue", cell: (row) => formatMoney(row.attributedRevenueFils), align: "end" },
      { id: "roas", header: "ROAS", cell: (row) => (row.roas === null ? "—" : row.roas.toFixed(2)) },
    ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Marketing"
        description="Campaigns recorded against a store, with spend and attributed revenue"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void campaigns.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setDialog("new")}>
                New campaign
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card flush>
            <CardHeader title="Campaigns" />
            <CardBody>
              {campaigns.isPending ? (
                <p className="text-sm text-[var(--text-3)]">Loading…</p>
              ) : (
                <Table rows={rows} rowKey={(row) => String(row.id)} columns={columns} loading={false} />
              )}
            </CardBody>
          </Card>
        </div>
        <Card flush>
          <CardHeader title="Totals" description="All recorded campaigns" />
          <CardBody>
            {summary.isPending ? (
              <p className="text-sm text-[var(--text-3)]">Loading…</p>
            ) : (
              <Table rows={summaryData ?? []} rowKey={(row) => String(row.channelId)} columns={summaryColumns} loading={false} />
            )}
          </CardBody>
        </Card>
      </div>

      <CampaignDialog
        state={dialog}
        channels={list}
        defaultChannelId={channelId}
        onClose={() => setDialog(null)}
      />
    </div>
  );
}

function CampaignDialog({
  state,
  channels,
  defaultChannelId,
  onClose,
}: {
  readonly state: EcomCampaign | "new" | null;
  readonly channels: readonly { readonly id: number; readonly name: string; readonly platform: EcomPlatform }[];
  readonly defaultChannelId: string;
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const [channelId, setChannelId] = useState(defaultChannelId);
  const [name, setName] = useState("");
  const [startsOn, setStartsOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [endsOn, setEndsOn] = useState(() => new Date().toISOString().slice(0, 10));
  const [spend, setSpend] = useState("0");
  const [attributedOrders, setAttributedOrders] = useState("0");
  const [attributedRevenue, setAttributedRevenue] = useState("0");
  const [error, setError] = useState("");

  const saveCampaign = useMutation({
    mutationFn: (input: EcomCampaignInput) => call("ecom.marketing.save", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "marketing"] });
      toast.success("Campaign recorded.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  const deleteCampaign = useMutation({
    mutationFn: (id: number) => call("ecom.marketing.delete", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "marketing"] });
      toast.success("Campaign deleted.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const campaign = state !== "new" ? state : null;

  if (state === null) {
    return <div />;
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={state === "new" ? "New campaign" : "Delete campaign"}
      description={state === "new" ? "Spend and attributed revenue are recorded figures, never estimated." : "The campaign stop is deleted."}
    >
      {state === "new" ? (
        <form
          className="space-y-4"
          onSubmit={(event: FormEvent) => {
            event.preventDefault();
            saveCampaign.mutate({
              channelId: Number(channelId),
              name,
              startsOn,
              endsOn,
              spendFils: Number(spend),
              attributedOrders: Number(attributedOrders),
              attributedRevenueFils: Number(attributedRevenue),
              source: "manual",
            });
          }}
        >
          {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <Field label="Store">
            {(id) => (
              <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(channels)} className="w-full" />
            )}
          </Field>
          <Field label="Campaign name">
            {(id) => (
              <Input id={id} value={name} onChange={(event) => setName(event.target.value)} />
            )}
          </Field>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Starts on">
              {(id) => (
                <Input id={id} type="date" value={startsOn} onChange={(event) => setStartsOn(event.target.value)} />
              )}
            </Field>
            <Field label="Ends on">
              {(id) => (
                <Input id={id} type="date" value={endsOn} onChange={(event) => setEndsOn(event.target.value)} />
              )}
            </Field>
            <Field label="Spend">
              {(id) => (
                <MoneyInput id={id} value={spend} onChange={(event) => setSpend(event.target.value)} />
              )}
            </Field>
            <Field label="Attributed orders">
              {(id) => (
                <Input id={id} type="number" min={0} value={attributedOrders} onChange={(event) => setAttributedOrders(event.target.value)} />
              )}
            </Field>
            <Field label="Attributed revenue">
              {(id) => (
                <MoneyInput id={id} value={attributedRevenue} onChange={(event) => setAttributedRevenue(event.target.value)} />
              )}
            </Field>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveCampaign.isPending}>
              Save campaign
            </Button>
          </div>
        </form>
      ) : (
        campaign !== null && (
          <div className="space-y-4">
            <p className="text-sm text-[var(--text-2)]">
              Deleting the campaign stop removes the recorded attribution evidence for it.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={() => { deleteCampaign.mutate(campaign.id); onClose(); }}>
                Delete campaign
              </Button>
            </div>
          </div>
        )
      )}
    </Dialog>
  );
}
