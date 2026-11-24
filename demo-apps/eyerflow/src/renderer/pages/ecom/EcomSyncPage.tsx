/**
 * Sync center: durable queue, checkpoints and provider polling.
 */

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { RefreshCw, RotateCcw, Send, XCircle } from "lucide-react";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Field, Select } from "../../components/ui/Input";
import { MmsTable as Table } from "../mms/MmsTable";
import type { Column } from "../../components/ui/DataTable";
import type { EcomJobStatus, EcomSyncJob } from "../../../shared/ecom";
import { channelOptions, useEcomChannels } from "./EcomShared";

export function EcomSyncPage(): React.JSX.Element {
  const { can } = useApp();
  const client = useQueryClient();
  const [channelId, setChannelId] = useState("");
  const channels = useEcomChannels();
  const list = channels.data ?? [];
  const editable = can("ecommerce", "edit");

  const summary = useQuery({
    queryKey: ["ecom", "syncSummary"],
    queryFn: () => call("ecom.sync.summary", {}),
    enabled: can("ecommerce", "view"),
  });

  const jobs = useQuery({
    queryKey: ["ecom", "syncJobs", channelId],
    queryFn: () =>
      call("ecom.sync.jobs", {
        ...(channelId === "" ? {} : { channelId: Number(channelId) }),
      }),
    enabled: can("ecommerce", "view"),
  });

  const run = useMutation({
    mutationFn: (maxJobs?: number) => call("ecom.sync.run", maxJobs === undefined ? {} : { maxJobs }),
    onSuccess: async (result) => {
      await client.invalidateQueries({ queryKey: ["ecom", "syncJobs"] });
      toast.success(
        `Sync batch done: ${String(result.succeeded)} succeeded, ${String(result.failed)} failed, ${String(result.deadLetters)} dead-lettered.`,
      );
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const retry = useMutation({
    mutationFn: (id: number) => call("ecom.sync.retry", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "syncJobs"] });
      toast.success("Job re-queued with backoff.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const retryDead = useMutation({
    mutationFn: (request: { channelId?: number }) => call("ecom.sync.retryDeadLetter", request),
    onSuccess: async (count) => {
      await client.invalidateQueries({ queryKey: ["ecom", "syncJobs"] });
      toast.success(`Re-queued ${String(count)} dead-lettered jobs.`);
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const cancel = useMutation({
    mutationFn: (id: number) => call("ecom.sync.cancel", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "syncJobs"] });
      toast.success("Job cancelled.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const poll = useMutation({
    mutationFn: (id: number) => call("ecom.sync.poll", { id }),
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: ["ecom", "syncJobs"] });
      await client.invalidateQueries({ queryKey: ["ecom", "orders"] });
      toast.success("Manual poll finished. Review the sync log.");
    },
    onError: (e: unknown) => toast.error(errorMessage(e)),
  });

  const rows = jobs.data ?? [];
  const summaryData = summary.data;

  const columns: readonly Column<EcomSyncJob>[] = [
    { id: "kind", header: "Job", cell: (row) => row.kind },
    { id: "channelName", header: "Store", cell: (row) => row.channelName },
    { id: "status", header: "Status", cell: (row) => row.status },
    { id: "attempts", header: "Attempts", cell: (row) => `${String(row.attempts)}/${String(row.maxAttempts)}`, align: "end" },
    { id: "lastError", header: "Last error", cell: (row) => row.lastError ?? "—" },
    { id: "createdAt", header: "Created", cell: (row) => row.createdAt.slice(0, 10) },
    {
      id: "actions",
      header: "Actions",
      cell: (row) => (
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate(row.id)}>
            <XCircle className="h-4 w-4" />
            Cancel
          </Button>
          {(row.status === "retry" || row.status === "failed" || row.status === "dead_letter") && (
            <Button size="sm" variant="secondary" disabled={retry.isPending} onClick={() => retry.mutate(row.id)}>
              <RotateCcw className="h-4 w-4" />
              Retry
            </Button>
          )}
        </div>
      ),
    },
  ];

  const statusTone = (status: EcomJobStatus): "success" | "warning" | "danger" | "info" | "neutral" => {
    switch (status) {
      case "succeeded":
        return "success";
      case "dead_letter":
      case "failed":
        return "danger";
      case "retry":
        return "warning";
      case "pending":
      case "running":
        return "info";
      default:
        return "neutral";
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Sync center"
        description="Durable queue of provider writes, imports and tracking updates with retry and dead-letter handling"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" onClick={() => void jobs.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            {editable && (
              <Button size="sm" disabled={run.isPending} onClick={() => run.mutate(25)}>
                <Send className="h-4 w-4" />
                Run sync batch
              </Button>
            )}
            {editable && (
              <Button size="sm" variant="secondary" disabled={retryDead.isPending} onClick={() => void retryDead.mutateAsync({}).catch(() => undefined)}>
                Retry dead letters
              </Button>
            )}
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          ["Pending", summaryData?.pending ?? 0],
          ["Retry", summaryData?.retry ?? 0],
          ["Failed", summaryData?.failed ?? 0],
          ["Dead letters", summaryData?.deadLetters ?? 0],
        ].map(([label, value]) => (
          <Card key={String(label)} flush>
            <CardBody>
              <p className="text-xs text-[var(--text-3)]">{String(label)}</p>
              <p className="mt-1 text-2xl font-semibold text-[var(--text)] tabular">{String(value)}</p>
            </CardBody>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-[240px]">
          <Field label="Store">
            {(id) => (
              <Select id={id} value={channelId} onChange={setChannelId} options={channelOptions(list)} className="w-full" />
            )}
          </Field>
        </div>
        {editable && (
          <Button size="sm" variant="secondary" onClick={() => void jobs.refetch()}>
            Filter
          </Button>
        )}
      </div>

      <Table
        rows={rows}
        rowKey={(row) => row.id}
        columns={columns}
        loading={jobs.isPending}
        error={jobs.error}
        onRetry={() => void jobs.refetch()}
        emptyState="The queue is empty. Runs appear here when a provider write, import or tracking update is queued."
      />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card flush>
          <CardHeader title="Channel health" description="Pending, failed and dead-lettered work per store" />
          <CardBody>
            {jobs.isPending ? (
              <TableSkeleton columns={3} />
            ) : (
              <ul className="space-y-2">
                {(jobs.data ?? []).map((job) => (
                  <li key={job.id} className="flex items-center justify-between gap-3 text-[13px]">
                    <span className="text-[var(--text)]">
                      {job.kind} · {job.channelName}
                    </span>
                    <Badge tone={statusTone(job.status)}>{job.status}</Badge>
                  </li>
                ))}
                {(jobs.data ?? []).length === 0 && <p className="text-sm text-[var(--text-3)]">No queued work.</p>}
              </ul>
            )}
          </CardBody>
        </Card>
        <Card flush>
          <CardHeader title="Manual poll" description="Ask one store for orders it may have created since its checkpoint" />
          <CardBody>
            <p className="mb-3 text-sm text-[var(--text-2)]">
              Checkpoints are stored per store and only advance after every fetched order has been evaluated.
            </p>
            {editable && (
              <Button size="sm" disabled={poll.isPending} onClick={() => channelId !== "" && poll.mutate(Number(channelId))}>
                <Send className="h-4 w-4" />
                Poll store
              </Button>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
