/**
 * E-commerce operations settings.
 *
 * One screen over `ecom_settings`: defaults, sync behaviour, authority for
 * price decisions and notification flags. Server stays the source of truth; the
 * screen only edits values through the signed RPC.
 */

import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field, Input, Select, Switch, Textarea } from "../../components/ui/Input";

interface FormState {
  defaultCurrency: string;
  defaultTimeZone: string;
  defaultBranch: string;
  productSync: string;
  priceSync: string;
  stockSync: string;
  orderImport: string;
  dataAuthority: string;
  autoConfirmOrders: string;
  unmappedSkuPolicy: string;
  fulfillmentRouting: string;
  trackingSync: string;
  carrierMapping: string;
  statusMapping: string;
  feeCategories: string;
  reconciliationToleranceFils: string;
  notificationFailedSync: string;
  notificationTokenExpiry: string;
  notificationStockConflict: string;
  notificationPayoutDiscrepancy: string;
}

const EMPTY_FORM: FormState = {
  defaultCurrency: "PKR",
  defaultTimeZone: "Asia/Karachi",
  defaultBranch: "",
  productSync: "webhook",
  priceSync: "webhook",
  stockSync: "webhook",
  orderImport: "webhook",
  dataAuthority: "eyerflow",
  autoConfirmOrders: "0",
  unmappedSkuPolicy: "exception",
  fulfillmentRouting: "manual",
  trackingSync: "webhook",
  carrierMapping: "",
  statusMapping: "",
  feeCategories: "commission,payment,shipping",
  reconciliationToleranceFils: "100",
  notificationFailedSync: "1",
  notificationTokenExpiry: "300",
  notificationStockConflict: "1",
  notificationPayoutDiscrepancy: "1",
};

export function EcomSettingsPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const mayEdit = can("ecommerce", "edit");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const settings = useQuery({
    queryKey: ["ecom", "settings"],
    queryFn: () => call("ecom.settings.list", {}),
    enabled: can("ecommerce", "view"),
  });

  useEffect(() => {
    if (settings.data !== undefined) {
      const next: FormState = { ...EMPTY_FORM };
      for (const row of settings.data) {
        if (row.key in next) next[row.key as keyof FormState] = row.value;
      }
      setForm(next);
    }
  }, [settings.data]);

  const save = useMutation({
    mutationFn: (patch: Record<string, string>) => call("ecom.settings.save", { patch }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "settings"] });
      toast.success("E-commerce settings saved.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const textField = (
    label: string,
    key: keyof FormState,
    multiline = false,
  ): React.ReactElement => {
    const value = form[key];
    const onChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      setForm((previous) => ({ ...previous, [key]: event.target.value }));
    };
    return (
      <Field label={label} required={false}>
        {(id) =>
          multiline ? (
            <Textarea id={id} value={value} onChange={onChange} />
          ) : (
            <Input id={id} value={value} onChange={onChange} />
          )
        }
      </Field>
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="E-commerce settings"
        description="Defaults and behaviour for the multi-channel layer. The main process owns every write."
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void settings.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {mayEdit && (
              <Button
                size="sm"
                disabled={save.isPending}
                onClick={() =>
                  save.mutate({
                    defaultCurrency: form.defaultCurrency,
                    defaultTimeZone: form.defaultTimeZone,
                    defaultBranch: form.defaultBranch,
                    productSync: form.productSync,
                    priceSync: form.priceSync,
                    stockSync: form.stockSync,
                    orderImport: form.orderImport,
                    dataAuthority: form.dataAuthority,
                    autoConfirmOrders: form.autoConfirmOrders,
                    unmappedSkuPolicy: form.unmappedSkuPolicy,
                    fulfillmentRouting: form.fulfillmentRouting,
                    trackingSync: form.trackingSync,
                    carrierMapping: form.carrierMapping,
                    statusMapping: form.statusMapping,
                    feeCategories: form.feeCategories,
                    reconciliationToleranceFils: form.reconciliationToleranceFils,
                    notificationFailedSync: form.notificationFailedSync,
                    notificationTokenExpiry: form.notificationTokenExpiry,
                    notificationStockConflict: form.notificationStockConflict,
                    notificationPayoutDiscrepancy: form.notificationPayoutDiscrepancy,
                  })
                }
              >
                Save settings
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card flush>
          <CardHeader title="Defaults" description="Company-wide fallback values" />
          <CardBody className="space-y-4">
            {textField("Currency", "defaultCurrency")}
            {textField("Time zone", "defaultTimeZone")}
            {textField("Default branch", "defaultBranch")}
            {textField("Fee categories (comma separated)", "feeCategories")}
            {textField("Reconciliation tolerance (fils)", "reconciliationToleranceFils")}
          </CardBody>
        </Card>
        <Card flush>
          <CardHeader title="Sync behaviour" description="What is pushed, what is pulled, when" />
          <CardBody className="space-y-4">
            <Field label="Product sync" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.productSync}
                  onChange={(value) => setForm((previous) => ({ ...previous, productSync: value }))}
                  options={[
                    { value: "webhook", label: "Webhooks" },
                    { value: "polling", label: "Polling" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              )}
            </Field>
            <Field label="Price sync" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.priceSync}
                  onChange={(value) => setForm((previous) => ({ ...previous, priceSync: value }))}
                  options={[
                    { value: "webhook", label: "Webhooks" },
                    { value: "polling", label: "Polling" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              )}
            </Field>
            <Field label="Stock sync" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.stockSync}
                  onChange={(value) => setForm((previous) => ({ ...previous, stockSync: value }))}
                  options={[
                    { value: "webhook", label: "Webhooks" },
                    { value: "polling", label: "Polling" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              )}
            </Field>
            <Field label="Order import" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.orderImport}
                  onChange={(value) => setForm((previous) => ({ ...previous, orderImport: value }))}
                  options={[
                    { value: "webhook", label: "Webhooks" },
                    { value: "polling", label: "Polling" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              )}
            </Field>
            <Field label="Tracking sync" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.trackingSync}
                  onChange={(value) => setForm((previous) => ({ ...previous, trackingSync: value }))}
                  options={[
                    { value: "webhook", label: "Webhooks" },
                    { value: "polling", label: "Polling" },
                    { value: "manual", label: "Manual" },
                  ]}
                />
              )}
            </Field>
          </CardBody>
        </Card>

        <Card flush>
          <CardHeader title="Authority and policy" description="Who decides what a channel may sell and price" />
          <CardBody className="space-y-4">
            <Field label="Data authority" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.dataAuthority}
                  onChange={(value) => setForm((previous) => ({ ...previous, dataAuthority: value }))}
                  options={[
                    { value: "eyerflow", label: "EyerFlow decides" },
                    { value: "channel", label: "Channel decides" },
                    { value: "manual", label: "Manual override" },
                  ]}
                />
              )}
            </Field>
            <Field label="Auto confirm orders" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.autoConfirmOrders}
                  onChange={(value) => setForm((previous) => ({ ...previous, autoConfirmOrders: value }))}
                  options={[
                    { value: "0", label: "Never" },
                    { value: "1", label: "When mapping and stock allow" },
                  ]}
                />
              )}
            </Field>
            <Field label="Unmapped SKU policy" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.unmappedSkuPolicy}
                  onChange={(value) => setForm((previous) => ({ ...previous, unmappedSkuPolicy: value }))}
                  options={[
                    { value: "exception", label: "Raise an exception" },
                    { value: "skip", label: "Skip the line" },
                    { value: "hold", label: "Hold the order" },
                  ]}
                />
              )}
            </Field>
            <Field label="Fulfilment routing" required>
              {(id) => (
                <Select
                  id={id}
                  value={form.fulfillmentRouting}
                  onChange={(value) => setForm((previous) => ({ ...previous, fulfillmentRouting: value }))}
                  options={[
                    { value: "manual", label: "Manual shipment link" },
                    { value: "auto", label: "Automatic after OMS fulfilment" },
                  ]}
                />
              )}
            </Field>
          </CardBody>
        </Card>

        <Card flush>
          <CardHeader title="Notifications" description="Operator alerts, written when evidence contradicts expectations" />
          <CardBody className="space-y-4">
            <SettingSwitch
              label="Failed sync notifications"
              description="Notify when a queued job exhausts its retries."
              value={form.notificationFailedSync}
              onChange={(value) => setForm((previous) => ({ ...previous, notificationFailedSync: value }))}
              enabled={mayEdit}
            />
            <SettingSwitch
              label="Token expiry notifications"
              description="Notify when a stored credential is nearing expiry."
              value={form.notificationTokenExpiry}
              onChange={(value) => setForm((previous) => ({ ...previous, notificationTokenExpiry: value }))}
              enabled={mayEdit}
            />
            <SettingSwitch
              label="Stock conflict notifications"
              description="Notify when the store disagrees with the IMS stock ledger."
              value={form.notificationStockConflict}
              onChange={(value) => setForm((previous) => ({ ...previous, notificationStockConflict: value }))}
              enabled={mayEdit}
            />
            <SettingSwitch
              label="Payout discrepancy notifications"
              description="Notify when a reported payout differs from the computed net payable."
              value={form.notificationPayoutDiscrepancy}
              onChange={(value) => setForm((previous) => ({ ...previous, notificationPayoutDiscrepancy: value }))}
              enabled={mayEdit}
            />
          </CardBody>
        </Card>
      </div>

      <Card flush>
        <CardHeader title="Current values" description="Raw stored values, read-only" />
        <CardBody>
          <ul className="space-y-2 text-sm">
            {(settings.data ?? []).map((row) => (
              <li key={row.key} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] p-2">
                <span className="font-medium text-[var(--text)]">{row.key}</span>
                <span className="tabular text-[var(--text-2)]">{row.value}</span>
              </li>
            ))}
          </ul>
        </CardBody>
      </Card>
    </div>
  );
}

function SettingSwitch({
  label,
  description,
  value,
  enabled,
  onChange,
}: {
  readonly label: string;
  readonly description: string;
  readonly value: string;
  readonly enabled: boolean;
  readonly onChange: (value: string) => void;
}): React.JSX.Element {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[13.5px] font-medium text-[var(--text)]">{label}</p>
        <p className="text-xs text-[var(--text-3)]">{description}</p>
      </div>
      <Switch checked={value === "1"} disabled={!enabled} onChange={(next) => onChange(next ? "1" : "0")} />
    </div>
  );
}
