/**
 * E-commerce reports: generated from stored channel evidence.
 */

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Download } from "lucide-react";
import { call } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { downloadText } from "./EcomShared";
import { PageHeader } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { MmsTable as Table } from "../mms/MmsTable";

export function EcomReportsPage(): React.JSX.Element {
  const { can } = useApp();
  const [report, setReport] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const mayExport = can("ecommerce", "export");

  const kinds = useQuery({
    queryKey: ["ecom", "reports"],
    queryFn: () => call("ecom.reports.list", {}),
    enabled: can("ecommerce", "view"),
  });

  const runReport = useQuery({
    queryKey: ["ecom", "report", report, fromDate, toDate],
    queryFn: () =>
      call("ecom.reports.run", {
        report,
        ...(fromDate === "" ? {} : { fromDate }),
        ...(toDate === "" ? {} : { toDate }),
      }),
    enabled: report !== "",
  });

  const exportReport = useMutation({
    mutationFn: () =>
      call("ecom.reports.export", {
        report,
        ...(fromDate === "" ? {} : { fromDate }),
        ...(toDate === "" ? {} : { toDate }),
      }),
    onSuccess: (csv: string) => {
      downloadText(`ecom-report-${report}.csv`, csv, "text/csv");
    },
  });

  const lastResult = runReport.data ?? null;

  return (
    <div className="space-y-5">
      <PageHeader title="Reports" description="Evidence-derived reports over imported orders, listings, stock, fees and payouts" />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card flush>
            <CardHeader title="Report catalog" description="What this build can generate" />
            <CardBody>
              {kinds.isPending ? (
                <p className="text-sm text-[var(--text-3)]">Loading…</p>
              ) : (
                <ul className="space-y-2">
                  {(kinds.data ?? []).map((kind) => (
                    <li key={kind} className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border)] p-2">
                      <span className="text-[13px] text-[var(--text)]">{kind}</span>
                      <Button size="sm" variant="ghost" onClick={() => setReport(kind)}>
                        Generate
                      </Button>
                    </li>
                  ))}
                  {(kinds.data ?? []).length === 0 && (
                    <p className="text-sm text-[var(--text-3)]">No report is available in this build.</p>
                  )}
                </ul>
              )}
            </CardBody>
          </Card>
        </div>
        <Card flush>
          <CardHeader title="Generate" description="Pick a report and a window" />
          <CardBody>
            <div className="space-y-3">
              <label className="space-y-1 text-sm">
                <span className="text-[var(--text)]">Report</span>
                <select
                  className="glass-input h-10 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[13.5px] text-[var(--text)]"
                  value={report}
                  onChange={(event) => setReport(event.target.value)}
                >
                  <option value="">Choose a report</option>
                  {(kinds.data ?? []).map((kind) => (
                    <option key={kind} value={kind}>
                      {kind}
                    </option>
                  ))}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="space-y-1 text-sm">
                  <span className="text-[var(--text)]">From</span>
                  <input
                    className="glass-input h-10 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[13.5px] text-[var(--text)]"
                    type="date"
                    value={fromDate}
                    onChange={(event) => setFromDate(event.target.value)}
                  />
                </label>
                <label className="space-y-1 text-sm">
                  <span className="text-[var(--text)]">To</span>
                  <input
                    className="glass-input h-10 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] px-3 text-[13.5px] text-[var(--text)]"
                    type="date"
                    value={toDate}
                    onChange={(event) => setToDate(event.target.value)}
                  />
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button size="sm" disabled={report === "" || runReport.isPending} onClick={() => void runReport.refetch()}>
                  Generate
                </Button>
                {mayExport && report !== "" && (
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={exportReport.isPending}
                    onClick={() => exportReport.mutate()}
                  >
                    <Download className="h-4 w-4" />
                    Export CSV
                  </Button>
                )}
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      <Card flush>
        <CardHeader title="Last generated" description="Rendered from stored evidence" />
        <CardBody>
          {runReport.isPending ? (
            <p className="text-sm text-[var(--text-3)]">Generating…</p>
          ) : lastResult === null ? (
            <p className="text-sm text-[var(--text-3)]">Generate a report to see it here.</p>
          ) : (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-semibold text-[var(--text)]">{lastResult.title}</span>
                <span className="text-xs text-[var(--text-3)]">{lastResult.generatedAt.slice(0, 19).replace("T", " ")}</span>
                {lastResult.incomplete && <span className="text-xs text-[var(--warning)]">incomplete</span>}
              </div>
              {lastResult.note !== null && <p className="text-sm text-[var(--text-2)]">{lastResult.note}</p>}
              {lastResult.rows.length > 0 && (
                <Table
                  rows={lastResult.rows}
                  rowKey={(row) => `${String(row["store"] ?? "")}-${String(row["day"] ?? "")}-${String(row["orders"] ?? "")}`}
                  columns={[
                    { id: "store", header: "Store", cell: (row) => String(row["store"] ?? "") },
                    { id: "day", header: "Day", cell: (row) => String(row["day"] ?? "") },
                    { id: "orders", header: "Orders", cell: (row) => String(row["orders"] ?? ""), align: "end" },
                    { id: "gross_fils", header: "Gross", cell: (row) => String(row["gross_fils"] ?? ""), align: "end" },
                  ]}
                  loading={false}
                />
              )}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
