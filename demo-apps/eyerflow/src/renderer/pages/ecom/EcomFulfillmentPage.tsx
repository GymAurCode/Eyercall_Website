/**
 * Shipments, returns and refunds.
 *
 * ECOM records the channel's shipment identity and asks the channel for the
 * tracking update. It does not restock, it does not inspect goods and it does not
 * approve a refund: the OMS RMA/WMS receipt and the OMS refund remain the single
 * place those decisions happen, so a return can never post a second movement.
 */

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw, Send } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatMoney } from "../../lib/format";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, Select } from "../../components/ui/Input";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomExternalOrder, EcomReturnLink, EcomShipmentLink } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

export function EcomFulfillmentPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [shipmentFor, setShipmentFor] = useState<EcomExternalOrder | null>(null);
  const [returnFor, setReturnFor] = useState<EcomReturnLink | null>(null);
  const [refundFor, setRefundFor] = useState<EcomExternalOrder | null>(null);
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const editable = can("ecommerce", "edit");

  const shipments = useQuery({
    queryKey: ["ecom", "shipments", channelId],
    queryFn: () =>
      call("ecom.shipments.list", channelId === "" ? {} : { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view"),
  });

  const returns = useQuery({
    queryKey: ["ecom", "returns", channelId],
    queryFn: () =>
      call("ecom.returns.list", channelId === "" ? {} : { channelId: Number(channelId) }),
    enabled: can("ecommerce", "view"),
  });

  const refunds = useQuery({
    queryKey: ["ecom", "refunds", channelId],
    queryFn: () =>
      call("ecom.refunds.list", channelId === "" ? { limit: 1000 } : { channelId: Number(channelId), limit: 1000 }),
    enabled: can("ecommerce", "view"),
  });

  const createShipment = useMutation({
    mutationFn: (input: { externalOrderId: number; carrier: string; trackingNumber: string }) =>
      call("ecom.shipments.create", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "shipments"] });
      toast.success("Shipment queued. The provider will be told when the job succeeds.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const syncShipment = useMutation({
    mutationFn: (linkId: number) => call("ecom.shipments.sync", { linkId }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "shipments"] });
      toast.success("Tracking update queued.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const linkReturn = useMutation({
    mutationFn: (input: {
      channelId: number;
      externalReturnId: string;
      externalOrderId?: number | null;
      reason: string;
      quantityMilli: number;
      status: string;
      refundStatus: string;
    }) => call("ecom.returns.link", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "returns"] });
      toast.success("Return linked to the provider.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const recordRefund = useMutation({
    mutationFn: (input: {
      channelId: number;
      externalOrderId: number;
      remoteRefundId: string;
      amountFils: number;
      currency: string;
      status: string;
      idempotencyKey: string;
    }) => call("ecom.refunds.record", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "refunds"] });
      toast.success("Refund recorded against the channel.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const shipmentsRows = shipments.data ?? [];
  const returnsRows = returns.data ?? [];
  const refundsRows = refunds.data ?? [];

  const shipmentColumns: readonly Column<EcomShipmentLink>[] = [
    { id: "externalOrderNumber", header: "Channel order", cell: (row) => row.externalOrderNumber },
    { id: "carrier", header: "Carrier", cell: (row) => row.carrier ?? "—" },
    { id: "trackingNumber", header: "Tracking", cell: (row) => row.trackingNumber ?? "—" },
    { id: "status", header: "Status", cell: (row) => row.status },
    { id: "lastSyncedAt", header: "Last synced", cell: (row) => row.lastSyncedAt?.slice(0, 19).replace("T", " ") ?? "—" },
    { id: "error", header: "Error", cell: (row) => row.error ?? "—" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) =>
        editable ? (
          <Button size="sm" variant="secondary" onClick={() => syncShipment.mutate(row.id)}>
            <Send className="h-4 w-4" />
            Sync tracking
          </Button>
        ) : null,
    },
  ];

  const returnColumns: readonly Column<EcomReturnLink>[] = [
    { id: "externalReturnId", header: "Channel return", cell: (row) => row.externalReturnId },
    { id: "externalOrderNumber", header: "Channel order", cell: (row) => row.externalOrderNumber ?? "—" },
    { id: "reason", header: "Reason", cell: (row) => row.reason },
    { id: "quantityMilli", header: "Qty", cell: (row) => row.quantityMilli, align: "end" },
    { id: "status", header: "Status", cell: (row) => row.status },
    { id: "refundStatus", header: "Refund", cell: (row) => row.refundStatus },
    { id: "createdAt", header: "Raised", cell: (row) => row.createdAt.slice(0, 10) },
  ];

  const refundColumns: readonly Column<Readonly<Record<string, string | number | null>>>[] = [
    { id: "external_order_id", header: "Order", cell: (row) => String(row["external_order_id"] ?? "") },
    { id: "remote_refund_id", header: "Provider refund", cell: (row) => String(row["remote_refund_id"] ?? "") },
    { id: "amount_fils", header: "Amount", cell: (row) => formatMoney(Number(row["amount_fils"] ?? 0)), align: "end" },
    { id: "status", header: "Status", cell: (row) => String(row["status"] ?? "") },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Fulfilment"
        description="Provider shipment links, channel returns and recorded refunds"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void shipments.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Store">
          {(id) => (
            <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(list)} className="w-[240px]" />
          )}
        </Field>
      </div>

      <Card flush>
        <CardHeader title="Shipment links" description="Pending links first" />
        <CardBody>
          <Table
            rows={shipmentsRows}
            rowKey={(row) => row.id}
            columns={shipmentColumns}
            loading={shipments.isPending}
            error={shipments.error}
            onRetry={() => void shipments.refetch()}
            emptyState="No shipment link has been created for this store yet."
          />
        </CardBody>
      </Card>

      <Card flush>
        <CardHeader
          title="Returns"
          actions={
            editable ? (
              <Button size="sm" variant="secondary" onClick={() => setReturnFor({} as EcomReturnLink)}>
                <Plus className="h-4 w-4" />
                Link return
              </Button>
            ) : undefined
          }
        />
        <CardBody>
          <Table
            rows={returnsRows}
            rowKey={(row) => row.id}
            columns={returnColumns}
            loading={returns.isPending}
            error={returns.error}
            onRetry={() => void returns.refetch()}
            emptyState="No return has been reported by this store."
          />
        </CardBody>
      </Card>

      <Card flush>
        <CardHeader title="Refunds" description="Provider refunds recorded against an imported order" />
        <CardBody>
          <Table
            rows={refundsRows}
            rowKey={(row) => r(row)}
            columns={refundColumns}
            loading={refunds.isPending}
            error={refunds.error}
            onRetry={() => void refunds.refetch()}
            emptyState="No refund has been recorded against a channel order."
          />
        </CardBody>
      </Card>

      {shipmentFor !== null && (
        <ShipmentDialog
          state={shipmentFor}
          editable={editable}
          onClose={() => setShipmentFor(null)}
          onCreate={(input) => createShipment.mutate(input)}
          busy={createShipment.isPending}
        />
      )}

      {returnFor !== null && (
        <ReturnDialog
          state={returnFor}
          defaultChannelId={channelId}
          editable={editable}
          onClose={() => setReturnFor(null)}
          onLink={(input) => linkReturn.mutate(input)}
          busy={linkReturn.isPending}
        />
      )}

      {refundFor !== null && (
        <RefundDialog
          state={refundFor}
          defaultChannelId={channelId}
          editable={editable}
          onClose={() => setRefundFor(null)}
          onRecord={(input) => recordRefund.mutate(input)}
          busy={recordRefund.isPending}
        />
      )}
    </div>
  );
}

function r(key: Readonly<Record<string, string | number | null>>): string {
  return String(key["id"] ?? key["remote_refund_id"] ?? "");
}

function ShipmentDialog({
  state,
  editable,
  onClose,
  onCreate,
  busy,
}: {
  readonly state: EcomExternalOrder;
  readonly editable: boolean;
  readonly onClose: () => void;
  readonly onCreate: (input: { externalOrderId: number; carrier: string; trackingNumber: string }) => void;
  readonly busy: boolean;
}): React.JSX.Element {
  const [carrier, setCarrier] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (!editable) return;
    onCreate({ externalOrderId: state.id, carrier, trackingNumber });
  };

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Create shipment link"
      description={`Provider shipment for channel order ${state.externalNumber}`}
    >
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Carrier">
          {(id) => (
            <Input id={id} value={carrier} onChange={(event) => setCarrier(event.target.value)} />
          )}
        </Field>
        <Field label="Tracking number" required={false}>
          {(id) => (
            <Input id={id} value={trackingNumber} onChange={(event) => setTrackingNumber(event.target.value)} />
          )}
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={busy || trackingNumber.trim() === "" || !editable}>
            Create and sync
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function ReturnDialog({
  state,
  defaultChannelId,
  editable,
  onClose,
  onLink,
  busy,
}: {
  readonly state: EcomReturnLink;
  readonly defaultChannelId: string;
  readonly editable: boolean;
  readonly onClose: () => void;
  readonly onLink: (input: {
    channelId: number;
    externalReturnId: string;
    externalOrderId?: number | null;
    reason: string;
    quantityMilli: number;
    status: string;
    refundStatus: string;
  }) => void;
  readonly busy: boolean;
}): React.JSX.Element {
  const [externalOrderId, setExternalOrderId] = useState("");
  const [reason, setReason] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [status, setStatus] = useState("requested");
  const [refundStatus, setRefundStatus] = useState("pending");

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (!editable) return;
    onLink({
      channelId: Number(defaultChannelId) || Number(state.channelId),
      externalReturnId: state.externalReturnId,
      externalOrderId: externalOrderId === "" ? null : Number(externalOrderId),
      reason,
      quantityMilli: Number(quantity) * 1000,
      status,
      refundStatus,
    });
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }} title="Link channel return" description={`Return ${state.externalReturnId}`}>
      <form className="space-y-4" onSubmit={submit}>
        <Field label="External order id">
          {(id) => (
            <Input id={id} value={externalOrderId} onChange={(event) => setExternalOrderId(event.target.value)} />
          )}
        </Field>
        <Field label="Reason">
          {(id) => (
            <Input id={id} value={reason} onChange={(event) => setReason(event.target.value)} />
          )}
        </Field>
        <Field label="Quantity">
          {(id) => (
            <Input id={id} type="number" min={1} value={quantity} onChange={(event) => setQuantity(event.target.value)} />
          )}
        </Field>
        <Field label="Return status">
          {(id) => (
            <Input id={id} value={status} onChange={(event) => setStatus(event.target.value)} />
          )}
        </Field>
        <Field label="Refund status">
          {(id) => (
            <Input id={id} value={refundStatus} onChange={(event) => setRefundStatus(event.target.value)} />
          )}
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={busy || !editable || reason.trim() === ""}>
            Link return
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function RefundDialog({
  state,
  defaultChannelId,
  editable,
  onClose,
  onRecord,
  busy,
}: {
  readonly state: EcomExternalOrder;
  readonly defaultChannelId: string;
  readonly editable: boolean;
  readonly onClose: () => void;
  readonly onRecord: (input: {
    channelId: number;
    externalOrderId: number;
    remoteRefundId: string;
    amountFils: number;
    currency: string;
    status: string;
    idempotencyKey: string;
  }) => void;
  readonly busy: boolean;
}): React.JSX.Element {
  const [remoteRefundId, setRemoteRefundId] = useState("");
  const [amountFils, setAmountFils] = useState("0");
  const [status, setStatus] = useState("refunded");

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (!editable) return;
    onRecord({
      channelId: Number(defaultChannelId) || Number(state.channelId),
      externalOrderId: state.id,
      remoteRefundId,
      amountFils: Number(amountFils),
      currency: state.currency,
      status,
      idempotencyKey: `refund:${state.externalOrderId}:${remoteRefundId}`,
    });
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }} title="Record provider refund" description={`Refund for ${state.externalNumber}`}>
      <form className="space-y-4" onSubmit={submit}>
        <Field label="Provider refund id">
          {(id) => (
            <Input id={id} value={remoteRefundId} onChange={(event) => setRemoteRefundId(event.target.value)} />
          )}
        </Field>
        <Field label="Refund amount">
          {(id) => (
            <Input id={id} type="number" min={0} value={amountFils} onChange={(event) => setAmountFils(event.target.value)} />
          )}
        </Field>
        <Field label="Status">
          {(id) => (
            <Input id={id} value={status} onChange={(event) => setStatus(event.target.value)} />
          )}
        </Field>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={busy || remoteRefundId.trim() === "" || !editable}>
            Record refund
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
