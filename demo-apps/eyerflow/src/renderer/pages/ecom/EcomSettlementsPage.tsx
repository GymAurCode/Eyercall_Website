/**
 * Settlements: payouts, fees and reconciliation.
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
import { Badge } from "../../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomPayout, EcomPayoutStatus, EcomPlatform } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

export function EcomSettlementsPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [status, setStatus] = useState("");
  const [dialog, setDialog] = useState(false);
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const mayEdit = can("ecommerce", "edit");
  const mayExport = can("ecommerce", "export");

  const payouts = useQuery({
    queryKey: ["ecom", "payouts", channelId, status],
    queryFn: () =>
      call("ecom.payouts.list", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        ...(status === "" ? {} : { status: status as EcomPayoutStatus }),
      }),
    enabled: can("ecommerce", "view"),
  });

  const summary = useQuery({
    queryKey: ["ecom", "payoutSummary"],
    queryFn: () => call("ecom.payouts.summary", {}),
    enabled: can("ecommerce", "view"),
  });

  const fees = useQuery({
    queryKey: ["ecom", "fees"],
    queryFn: () => call("ecom.payouts.fees", {}),
    enabled: can("ecommerce", "view"),
  });

  const discrepancies = useQuery({
    queryKey: ["ecom", "discrepancies"],
    queryFn: () => call("ecom.payouts.discrepancies", {}),
    enabled: can("ecommerce", "view"),
  });

  const importPayout = useMutation({
    mutationFn: (input: {
      channelId: number;
      payoutId: string;
      periodStart: string;
      periodEnd: string;
      currency: string;
      grossFils: number;
      commissionFils?: number;
      otherFeesFils?: number;
      taxFils?: number;
      remittedFils?: number;
      remittedAt?: string | null;
      reference?: string | null;
    }) => call("ecom.payouts.import", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "payouts"] });
      await client.invalidateQueries({ queryKey: ["ecom", "fees"] });
      await client.invalidateQueries({ queryKey: ["ecom", "discrepancies"] });
      toast.success("Payout statement imported.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = payouts.data ?? [];
  const summaryData = summary.data;
  const feeRows = fees.data ?? [];
  const discrepancyRows = discrepancies.data ?? [];

  const columns: readonly Column<EcomPayout>[] = [
    { id: "payoutId", header: "Payout", cell: (row) => row.payoutId },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "periodStart", header: "Period", cell: (row) => `${row.periodStart} → ${row.periodEnd}` },
    { id: "grossFils", header: "Gross", cell: (row) => formatMoney(row.grossFils), align: "end" },
    { id: "commissionFils", header: "Commission", cell: (row) => formatMoney(row.commissionFils), align: "end" },
    { id: "otherFeesFils", header: "Other fees", cell: (row) => formatMoney(row.otherFeesFils), align: "end" },
    { id: "taxFils", header: "Tax", cell: (row) => formatMoney(row.taxFils), align: "end" },
    { id: "netPayoutFils", header: "Net payable", cell: (row) => formatMoney(row.netPayoutFils), align: "end" },
    { id: "remittedFils", header: "Remitted", cell: (row) => formatMoney(row.remittedFils), align: "end" },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <Badge tone={row.status === "reconciled" ? "success" : row.status === "discrepancy" ? "danger" : "warning"}>
          {row.status}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settlements"
        description="Payouts reported by the marketplace, the fees they withheld, and reconciliation against bank remittances"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void payouts.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {mayEdit && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setDialog(true)}>
                Import payout
              </Button>
            )}
            {mayExport && (
              <Button variant="secondary" size="sm" onClick={() => void fees.refetch()}>
                Export
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
        <Card flush>
          <CardBody>
            <p className="text-xs text-[var(--text-3)]">Pending payouts</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)] tabular">{formatMoney(summaryData?.pendingFils ?? 0)}</p>
          </CardBody>
        </Card>
        <Card flush>
          <CardBody>
            <p className="text-xs text-[var(--text-3)]">Remitted</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)] tabular">{formatMoney(summaryData?.remittedFils ?? 0)}</p>
          </CardBody>
        </Card>
        <Card flush>
          <CardBody>
            <p className="text-xs text-[var(--text-3)]">Fees withheld</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)] tabular">{formatMoney(summaryData?.feeFils ?? 0)}</p>
          </CardBody>
        </Card>
        <Card flush>
          <CardBody>
            <p className="text-xs text-[var(--text-3)]">Discrepancies</p>
            <p className="mt-1 text-2xl font-semibold text-[var(--text)] tabular">{String(summaryData?.discrepancyCount ?? 0)}</p>
          </CardBody>
        </Card>
      </div>

      <Card flush>
        <CardHeader
          title="Payouts"
          description="Bank payout statements per store"
          actions={
            <div className="flex flex-wrap items-end gap-2">
              <Field label="">
                {(id) => (
                  <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(list)} className="w-[200px]" />
                )}
              </Field>
              <Field label="">
                {(id) => (
                  <Select
                    id={id}
                    value={status}
                    onChange={setStatus}
                    className="w-[160px]"
                    options={[
                      { value: "", label: "All statuses" },
                      { value: "unreconciled", label: "Unreconciled" },
                      { value: "matched", label: "Matched" },
                      { value: "discrepancy", label: "Discrepancy" },
                      { value: "remitted", label: "Remitted" },
                      { value: "reconciled", label: "Reconciled" },
                    ]}
                  />
                )}
              </Field>
            </div>
          }
        />
        <CardBody>
          {payouts.isPending ? (
            <p className="text-sm text-[var(--text-3)]">Loading…</p>
          ) : (
            <Table rows={rows} rowKey={(row) => row.id} columns={columns} loading={false} error={payouts.error} onRetry={() => void payouts.refetch()} />
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card flush>
          <CardHeader title="Fee lines" description="Committed marketplace fees per order" />
          <CardBody>
            {fees.isPending ? (
              <p className="text-sm text-[var(--text-3)]">Loading…</p>
            ) : (
              <Table
                rows={feeRows}
                rowKey={(row) => String(r3(row))}
                columns={[
                  { id: "feeType", header: "Fee", cell: (row) => row.feeType },
                  { id: "sourceReference", header: "Reference", cell: (row) => row.sourceReference },
                  { id: "amountFils", header: "Amount", cell: (row) => formatMoney(row.amountFils), align: "end" },
                  { id: "occurredAt", header: "Occurred", cell: (row) => row.occurredAt.slice(0, 10) },
                  { id: "externalOrderId", header: "Order", cell: (row) => (row.externalOrderId === null ? "—" : String(row.externalOrderId)) },
                ]}
                loading={false}
              />
            )}
          </CardBody>
        </Card>

        <Card flush>
          <CardHeader title="Reconciliation discrepancies" description="Reported but not bank-reconciled" />
          <CardBody>
            {discrepancies.isPending ? (
              <p className="text-sm text-[var(--text-3)]">Loading…</p>
            ) : (
              <Table
                rows={discrepancyRows}
                rowKey={(row) => String(r4(row))}
                columns={[
                  { id: "payout_id", header: "Payout", cell: (row) => String(r4(row)) },
                  { id: "status", header: "Status", cell: (row) => String(r5(row)) },
                  { id: "difference_fils", header: "Difference", cell: (row) => formatMoney(Number(r6(row) ?? 0)), align: "end" },
                  { id: "note", header: "Note", cell: (row) => String(r7(row) ?? "") },
                ]}
                loading={false}
              />
            )}
          </CardBody>
        </Card>
      </div>

      <PayoutDialog open={dialog} onClose={() => setDialog(false)} onImport={(input) => void importPayout.mutate(input)} channels={list} />
    </div>
  );
}

function r3(row: { readonly id: number }): string {
  return String(row.id);
}
function r4(row: Readonly<Record<string, string | number | null>>): string {
  return String(row["payout_id"] ?? "");
}
function r5(row: Readonly<Record<string, string | number | null>>): string {
  return String(row["status"] ?? "");
}
function r6(row: Readonly<Record<string, string | number | null>>): string | number | null {
  return row["difference_fils"] ?? null;
}
function r7(row: Readonly<Record<string, string | number | null>>): string | null {
  return (row["note"] as string | null) ?? null;
}

function PayoutDialog({
  open,
  onClose,
  onImport,
  channels,
}: {
  readonly open: boolean;
  readonly onClose: () => void;
  readonly onImport: (input: {
    channelId: number;
    payoutId: string;
    periodStart: string;
    periodEnd: string;
    currency: string;
    grossFils: number;
    commissionFils?: number;
    otherFeesFils?: number;
    taxFils?: number;
    remittedFils?: number;
    remittedAt?: string | null;
    reference?: string | null;
  }) => void;
  readonly channels: readonly { readonly id: number; readonly name: string; readonly platform: EcomPlatform }[];
}): React.JSX.Element {
  const [channelId, setChannelId] = useState("");
  const [payoutId, setPayoutId] = useState("");
  const [periodStart, setPeriodStart] = useState("");
  const [periodEnd, setPeriodEnd] = useState("");
  const [gross, setGross] = useState("0");
  const [commission, setCommission] = useState("0");
  const [otherFees, setOtherFees] = useState("0");
  const [tax, setTax] = useState("0");
  const [remitted, setRemitted] = useState("0");
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (payoutId.trim() === "" || periodStart === "" || periodEnd === "") {
      setError("Payout id and both period dates are required.");
      return;
    }
    setError("");
    onImport({
      channelId: Number(channelId),
      payoutId,
      periodStart,
      periodEnd,
      currency: "PKR",
      grossFils: Number(gross),
      commissionFils: Number(commission),
      otherFeesFils: Number(otherFees),
      taxFils: Number(tax),
      remittedFils: Number(remitted),
      reference: reference.trim() === "" ? null : reference.trim(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }} title="Import payout statement">
      <form className="space-y-4" onSubmit={submit}>
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <Field label="Store">
          {(id) => <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(channels)} />}
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Payout id">
            {(id) => <Input id={id} value={payoutId} onChange={(event) => setPayoutId(event.target.value)} />}
          </Field>
          <Field label="Bank reference">
            {(id) => <Input id={id} value={reference} onChange={(event) => setReference(event.target.value)} />}
          </Field>
          <Field label="Period start">
            {(id) => <Input id={id} type="date" value={periodStart} onChange={(event) => setPeriodStart(event.target.value)} />}
          </Field>
          <Field label="Period end">
            {(id) => <Input id={id} type="date" value={periodEnd} onChange={(event) => setPeriodEnd(event.target.value)} />}
          </Field>
          <Field label="Gross">
            {(id) => <MoneyInput id={id} value={gross} onChange={(event) => setGross(event.target.value)} />}
          </Field>
          <Field label="Commission">
            {(id) => <MoneyInput id={id} value={commission} onChange={(event) => setCommission(event.target.value)} />}
          </Field>
          <Field label="Other fees">
            {(id) => <MoneyInput id={id} value={otherFees} onChange={(event) => setOtherFees(event.target.value)} />}
          </Field>
          <Field label="Tax">
            {(id) => <MoneyInput id={id} value={tax} onChange={(event) => setTax(event.target.value)} />}
          </Field>
          <Field label="Remitted">
            {(id) => <MoneyInput id={id} value={remitted} onChange={(event) => setRemitted(event.target.value)} />}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled>
            Import payout
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
