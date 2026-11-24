/**
 * Channel orders, import exceptions and manual order import.
 *
 * Orders read from a channel are mapped onto the canonical IMS sales order
 * through the same OMS lifecycle the native screens use, so confirming a
 * channel order reserves stock exactly like a customer order typed in the app
 * does. Nothing here creates a second order engine.
 */

import { useState, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, RefreshCw } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { formatMoney, parseAmount, parseQuantity } from "../../lib/format";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { Field, Input, MoneyInput, Select } from "../../components/ui/Input";
import { Badge } from "../../components/ui/Badge";
import { Card, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomChannel, EcomOrderException, EcomExternalOrder, EcomImportStatus } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

type OrderDialogState = EcomExternalOrder | "new";

export function EcomOrdersPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const [importStatus, setImportStatus] = useState("");
  const [exceptionStatus, setExceptionStatus] = useState<"" | "open" | "resolved" | "skipped" | "escalated">("");
  const [openOrder, setOpenOrder] = useState<OrderDialogState | null>(null);
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const mayEdit = can("ecommerce", "edit");

  const orders = useQuery({
    queryKey: ["ecom", "orders", channelId, importStatus],
    queryFn: () =>
      call("ecom.orders.list", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        ...(importStatus === "" ? {} : { importStatus: importStatus as EcomImportStatus }),
      }),
    enabled: can("ecommerce", "view"),
  });

  const stats = useQuery({
    queryKey: ["ecom", "ordersStats"],
    queryFn: () => call("ecom.orders.stats", {}),
    enabled: can("ecommerce", "view"),
  });

  const exceptions = useQuery({
    queryKey: ["ecom", "exceptions", channelId, exceptionStatus],
    queryFn: () =>
      call("ecom.orders.exceptions", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
        ...(exceptionStatus === "" ? {} : { status: exceptionStatus }),
      }),
    enabled: can("ecommerce", "view"),
  });

  const poll = useMutation({
    mutationFn: (id: number) => call("ecom.sync.poll", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "orders"] });
      await client.invalidateQueries({ queryKey: ["ecom", "exceptions"] });
      toast.success("Store polled. New orders are being evaluated for import.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const resolve = useMutation({
    mutationFn: (input: { id: number; action: "reprocess" | "skip" | "escalate" | "resolve"; reason?: string }) =>
      call("ecom.orders.resolveException", input),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "exceptions"] });
      await client.invalidateQueries({ queryKey: ["ecom", "orders"] });
      toast.success("Exception resolution recorded.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = orders.data ?? [];
  const statsData = stats.data;

  const columns: readonly Column<EcomExternalOrder>[] = [
    { id: "externalNumber", header: "Channel order", cell: (row) => row.externalNumber },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "orderedAt", header: "Ordered", cell: (row) => row.orderedAt.slice(0, 10) },
    { id: "customerName", header: "Customer", cell: (row) => row.customerName ?? "—" },
    { id: "totalFils", header: "Total", cell: (row) => formatMoney(row.totalFils), align: "end" },
    { id: "paymentStatus", header: "Payment", cell: (row) => row.paymentStatus },
    { id: "fulfillmentStatus", header: "Fulfillment", cell: (row) => row.fulfillmentStatus },
    { id: "importStatus", header: "Import", cell: (row) => row.importStatus },
    { id: "canonicalOrder", header: "Local order", cell: (row) => row.canonicalOrderNumber ?? "—" },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" onClick={() => setOpenOrder(row)}>
            Open
          </Button>
          {mayEdit && (row.importStatus === "exception" || row.importStatus === "skipped") && (
            <Button size="sm" variant="secondary" onClick={() => setOpenOrder(row)}>
              Resolve
            </Button>
          )}
          {mayEdit && channelId !== "" && (
            <Button size="sm" variant="ghost" disabled={poll.isPending} onClick={() => poll.mutate(Number(channelId))}>
              Poll store
            </Button>
          )}
        </div>
      ),
    },
  ];

  const exceptionColumns: readonly Column<EcomOrderException>[] = [
    { id: "externalOrderNumber", header: "Channel order", cell: (row) => row.externalOrderNumber },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "code", header: "Code", cell: (row) => row.code },
    { id: "message", header: "Message", cell: (row) => <span className="max-w-[320px] truncate">{row.message}</span> },
    { id: "status", header: "Status", cell: (row) => row.status },
    { id: "createdAt", header: "Raised", cell: (row) => row.createdAt.slice(0, 10) },
    {
      id: "actions",
      header: "Actions",
      cell: (row) =>
        mayEdit ? (
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() =>
                resolve.mutate({ id: row.id, action: row.status === "open" ? "reprocess" : "resolve", reason: "" })
              }
            >
              {row.status === "open" ? "Reprocess" : "Resolve"}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => resolve.mutate({ id: row.id, action: "escalate", reason: "" })}>
              Escalate
            </Button>
          </div>
        ) : null,
    },
  ];

  return (
    <div className="space-y-5">
      <PageHeader
        title="Channel orders"
        description="Orders imported from connected stores, linked to the canonical local sales order"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void orders.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {mayEdit && (
              <Button size="sm" iconLeft={<Plus className="h-4 w-4" />} onClick={() => setOpenOrder("new")}>
                Import order
              </Button>
            )}
          </div>
        }
      />

      <div className="flex flex-wrap items-end gap-3">
        <Field label="Store">
          {(id) => (
            <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(list)} className="w-[240px]" />
          )}
        </Field>
        <Field label="Import status">
          {(id) => (
            <Select
              id={id}
              value={importStatus}
              onChange={setImportStatus}
              className="w-[180px]"
              options={[
                { value: "", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "imported", label: "Imported" },
                { value: "exception", label: "Exception" },
                { value: "skipped", label: "Skipped" },
                { value: "duplicate", label: "Duplicate" },
              ]}
            />
          )}
        </Field>
        <div className="pb-0.5">
          <Badge tone="info">imported {String(statsData?.imported ?? 0)}</Badge>
          <Badge tone="warning">exceptions {String(statsData?.exceptions ?? 0)}</Badge>
          <Badge tone="brand">canonical {String(statsData?.canonical ?? 0)}</Badge>
        </div>
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        loading={orders.isPending}
        error={orders.error}
        onRetry={() => void orders.refetch()}
        emptyState="No channel order has been imported yet. It appears here when a store reports one."
      />

      <Card flush>
        <CardHeader
          title="Import exceptions"
          description="Orders that could not be mapped cleanly"
          actions={
            <Field label="">
              {(id) => (
                <Select
                  id={id}
                  value={exceptionStatus}
                  onChange={(value) => setExceptionStatus(value as typeof exceptionStatus)}
                  className="w-[160px]"
                  options={[
                    { value: "", label: "All" },
                    { value: "open", label: "Open" },
                    { value: "resolved", label: "Resolved" },
                    { value: "skipped", label: "Skipped" },
                    { value: "escalated", label: "Escalated" },
                  ]}
                />
              )}
            </Field>
          }
        />
        <Table
          rows={exceptions.data ?? []}
          rowKey={(row) => row.id}
          columns={exceptionColumns}
          loading={exceptions.isPending}
          error={exceptions.error}
          onRetry={() => void exceptions.refetch()}
          emptyState="No open exceptions."
        />
      </Card>

      {openOrder !== null && (
        <OrderDialog
          state={openOrder}
          channels={list}
          defaultChannelId={channelId}
          editable={mayEdit}
          onClose={() => setOpenOrder(null)}
        />
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* order dialog                                                                */
/* -------------------------------------------------------------------------- */

function OrderDialog({
  state,
  channels,
  defaultChannelId,
  editable,
  onClose,
}: {
  readonly state: OrderDialogState;
  readonly channels: readonly EcomChannel[];
  readonly defaultChannelId: string;
  readonly editable: boolean;
  readonly onClose: () => void;
}): React.JSX.Element {
  const [error, setError] = useState("");

  const get = useQuery({
    queryKey: ["ecom", "order", state],
    queryFn: () => call("ecom.orders.get", { id: state === "new" ? 0 : state.id }),
    enabled: state !== "new",
  });

  const close = (): void => {
    setError("");
    onClose();
  };

  if (state === "new") {
    return (
      <ManualImportDialog
        channels={channels}
        defaultChannelId={defaultChannelId}
        editable={editable}
        onClose={close}
      />
    );
  }

  const order = get.data;

  return (
    <Dialog open onOpenChange={onClose} title={`Channel order ${state.externalNumber}`} description={order?.channelName ?? undefined} busy={get.isPending}>
      {order === undefined ? (
        <p className="text-sm text-[var(--text-2)]">The order could not be read.</p>
      ) : (
        <div className="space-y-4">
          {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <Detail label="Status" value={order.importStatus} />
            <Detail label="Payment" value={order.paymentStatus} />
            <Detail label="Fulfillment" value={order.fulfillmentStatus} />
            <Detail label="Ordered at" value={order.orderedAt.slice(0, 19).replace("T", " ")} />
            <Detail label="Total" value={formatMoney(order.totalFils)} />
            <Detail label="Currency" value={order.currency} />
            <Detail label="Shipping city" value={order.shippingCity ?? "—"} />
            <Detail label="Customer" value={order.customerName ?? "—"} />
          </dl>
          <div>
            <p className="mb-2 text-sm font-medium text-[var(--text)]">Lines</p>
            <ul className="space-y-2">
              {order.lines.map((line) => (
                <li key={line.id} className="flex justify-between gap-3 rounded-lg border border-[var(--border)] p-2 text-sm">
                  <span className="text-[var(--text)]">
                    {line.title}
                    <span className="ms-2 text-[var(--text-3)]">{line.sku ?? line.remoteLineId}</span>
                  </span>
                  <span className="tabular text-[var(--text-2)]">
                    {formatQuantity(line.quantityMilli)} · {formatMoney(line.totalFils)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          {editable && (
            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}

function Detail({ label, value }: { readonly label: string; readonly value: string | null }): React.JSX.Element {
  return (
    <div className="rounded-lg border border-[var(--border)] p-2">
      <p className="text-xs text-[var(--text-3)]">{label}</p>
      <p className="mt-0.5 text-[var(--text)]">{value ?? "—"}</p>
    </div>
  );
}

function formatQuantity(milli: number): string {
  const units = milli / 1000;
  return new Intl.NumberFormat("en-PK", { maximumFractionDigits: 3 }).format(units);
}

function ManualImportDialog({
  channels,
  defaultChannelId,
  editable,
  onClose,
}: {
  readonly channels: readonly EcomChannel[];
  readonly defaultChannelId: string;
  readonly editable: boolean;
  readonly onClose: () => void;
}): React.JSX.Element {
  const client = useQueryClient();
  const [channelId, setChannelId] = useState(defaultChannelId);
  const [externalOrderId, setExternalOrderId] = useState("");
  const [externalNumber, setExternalNumber] = useState("");
  const [orderedAt, setOrderedAt] = useState(() => new Date().toISOString().slice(0, 10));
  const [currency, setCurrency] = useState("PKR");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [price, setPrice] = useState("0");
  const [shipping, setShipping] = useState("0");
  const [discount, setDiscount] = useState("0");
  const [tax, setTax] = useState("0");
  const [error, setError] = useState("");

  const submit = useMutation({
    mutationFn: () => {
      const unitPriceFils = parseAmount(price) ?? 0;
      const quantityMilli = (parseQuantity(quantity) ?? Number(quantity)) * 1000;
      const shippingFils = parseAmount(shipping) ?? 0;
      const discountFils = parseAmount(discount) ?? 0;
      const taxFils = parseAmount(tax) ?? 0;
      const subtotalFils = unitPriceFils * quantityMilli + shippingFils - discountFils;
      const totalFils = subtotalFils + taxFils;
      return call("ecom.orders.import", {
        channelId: Number(channelId),
        eventId: `manual-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, "-")}-${Math.random().toString(36).slice(2, 8)}`,
        externalOrderId,
        externalNumber,
        orderedAt,
        currency,
        customer: { name: customerName, email: customerEmail || null, city: null },
        lines: [
          {
            remoteLineId: externalOrderId,
            remoteVariantId: null,
            sku: null,
            title: externalNumber,
            quantityMilli,
            unitPriceFils,
            discountFils,
            taxFils,
          },
        ],
        shippingFils,
        discountFils,
        taxFils,
        subtotalFils,
        totalFils,
        paymentStatus: "unknown",
        fulfillmentStatus: "unfulfilled",
      });
    },
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "orders"] });
      await client.invalidateQueries({ queryKey: ["ecom", "exceptions"] });
      toast.success("Order imported as a channel order.");
      onClose();
    },
    onError: (e: unknown) => {
      setError(errorMessage(e));
      toast.error(errorMessage(e));
    },
  });

  if (!editable) {
    return (
      <Dialog open onOpenChange={onClose} title="Manual order import" description="No permission to import.">
        <div className="flex justify-end">
          <Button size="sm" variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title="Import a channel order manually"
      description="Records a provider order that already happened and links it to the canonical order. It is idempotent per external order id."
      busy={submit.isPending}
    >
      <form
        className="space-y-4"
        onSubmit={(event: FormEvent) => {
          event.preventDefault();
          setError("");
          submit.mutate();
        }}
      >
        {error !== "" && <p className="text-sm text-[var(--danger)]">{error}</p>}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Store" required>
            {(id) => (
              <Select
                id={id}
                value={channelId}
                onChange={setChannelId}
                options={channels.map((c) => ({ value: String(c.id), label: `${c.name} (${c.platform})` }))}
              />
            )}
          </Field>
          <Field label="External order id" required>
            {(id) => <Input id={id} value={externalOrderId} onChange={(e) => setExternalOrderId(e.target.value)} />}
          </Field>
          <Field label="External order number" required>
            {(id) => <Input id={id} value={externalNumber} onChange={(e) => setExternalNumber(e.target.value)} />}
          </Field>
          <Field label="Ordered at" required>
            {(id) => <Input id={id} type="date" value={orderedAt} onChange={(e) => setOrderedAt(e.target.value)} />}
          </Field>
          <Field label="Currency" required>
            {(id) => <Input id={id} maxLength={3} value={currency} onChange={(e) => setCurrency(e.target.value)} />}
          </Field>
          <Field label="Customer name" required>
            {(id) => <Input id={id} value={customerName} onChange={(e) => setCustomerName(e.target.value)} />}
          </Field>
          <Field label="Customer email">
            {(id) => <Input id={id} type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />}
          </Field>
          <Field label="Quantity" required>
            {(id) => <Input id={id} type="number" min={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} />}
          </Field>
          <Field label="Unit price" required>
            {(id) => <MoneyInput id={id} value={price} onChange={(e) => setPrice(e.target.value)} />}
          </Field>
          <Field label="Shipping">
            {(id) => <MoneyInput id={id} value={shipping} onChange={(e) => setShipping(e.target.value)} />}
          </Field>
          <Field label="Discount">
            {(id) => <MoneyInput id={id} value={discount} onChange={(e) => setDiscount(e.target.value)} />}
          </Field>
          <Field label="Tax">
            {(id) => <MoneyInput id={id} value={tax} onChange={(e) => setTax(e.target.value)} />}
          </Field>
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={submit.isPending || externalOrderId.trim() === "" || externalNumber.trim() === "" || customerName.trim() === ""}>
            Import order
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

