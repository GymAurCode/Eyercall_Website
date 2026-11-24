import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { call, errorMessage } from "../../lib/api";
import { useApp } from "../../lib/app-context";
import { PageHeader, TableSkeleton } from "../../components/ui/Feedback";
import { Button } from "../../components/ui/Button";
import { Dialog } from "../../components/ui/Dialog";
import { MmsTable as Table } from "../mms/MmsTable";
type Grant = {
  id: number;
  name: string;
  role: string;
  active: boolean;
  allBranches: boolean;
  branches: string[];
};
export function AccessPage(): React.JSX.Element {
  const { refreshSession } = useApp(),
    client = useQueryClient();
  const query = useQuery({ queryKey: ["wms-access"], queryFn: () => call("wms.access.list", {}) });
  const [edit, setEdit] = useState<Grant | null>(null),
    [error, setError] = useState("");
  const save = useMutation({
    mutationFn: () => {
      if (!edit) throw Error("Select a user.");
      return call("wms.access.save", {
        userId: edit.id,
        allBranches: edit.allBranches,
        branches: edit.branches,
      });
    },
    onSuccess: async () => {
      setEdit(null);
      await refreshSession();
      await client.invalidateQueries();
      toast.success("Warehouse branch permissions updated.");
    },
    onError: (e: unknown) => {
      console.error(e);
      setError(errorMessage(e));
    },
  });
  return (
    <div className="space-y-5">
      <PageHeader
        title="Warehouse Access"
        description="Branch grants restrict warehouse operations and exports. User role permissions and signed suite licenses are also required."
      />
      {query.isPending ? (
        <TableSkeleton />
      ) : query.isError ? (
        <div role="alert" className="card p-5">
          <p className="text-danger">{errorMessage(query.error)}</p>
          <Button
            onClick={() => {
              void query.refetch();
            }}
          >
            Retry
          </Button>
        </div>
      ) : (
        query.data && (
          <>
            <p className="text-sm text-ink-secondary">
              Restricted users cannot change these grants. No branches means no warehouse access.
              Warehouses without a branch appear as “Unassigned site”.
            </p>
            <Table<Grant>
              rows={query.data.users}
              rowKey={(u) => u.id}
              columns={[
                { id: "name", header: "User", cell: (u) => u.name },
                { id: "role", header: "Role", cell: (u) => u.role },
                {
                  id: "status",
                  header: "Account",
                  cell: (u) => (u.active ? "Active" : "Inactive"),
                },
                {
                  id: "scope",
                  header: "Warehouse branches",
                  cell: (u) =>
                    u.allBranches
                      ? "All branches"
                      : u.branches.map((b) => b || "Unassigned site").join(", ") || "No access",
                },
                {
                  id: "actions",
                  header: "Actions",
                  cell: (u) =>
                    u.active && (
                      <Button
                        onClick={() => {
                          setError("");
                          setEdit({ ...u, branches: [...u.branches] });
                        }}
                      >
                        Edit access
                      </Button>
                    ),
                },
              ]}
            />
          </>
        )
      )}
      <Dialog
        open={edit !== null}
        onOpenChange={(v) => {
          if (!v && !save.isPending) setEdit(null);
        }}
        title={`Warehouse access: ${edit?.name ?? ""}`}
        busy={save.isPending}
      >
        {edit && (
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              if (!save.isPending) save.mutate();
            }}
          >
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={edit.allBranches}
                onChange={(e) => setEdit({ ...edit, allBranches: e.target.checked })}
              />
              All warehouse branches
            </label>
            {!edit.allBranches && (
              <fieldset className="space-y-3">
                <legend className="mb-3 text-sm">Allowed branches</legend>
                {query.data?.branches.map((branch) => (
                  <label className="flex items-center gap-3" key={branch}>
                    <input
                      type="checkbox"
                      checked={edit.branches.includes(branch)}
                      onChange={(e) =>
                        setEdit({
                          ...edit,
                          branches: e.target.checked
                            ? [...edit.branches, branch]
                            : edit.branches.filter((b) => b !== branch),
                        })
                      }
                    />
                    {branch || "Unassigned site"}
                  </label>
                ))}
              </fieldset>
            )}
            {error && (
              <p role="alert" className="text-danger">
                {error}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                type="button"
                disabled={save.isPending}
                onClick={() => setEdit(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={save.isPending}>
                {save.isPending ? "Saving…" : "Save access"}
              </Button>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
