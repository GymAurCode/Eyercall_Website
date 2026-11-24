import { useCallback, useEffect, useState } from "react";
import { superAdminApi, type SALicense, type SACompany } from "../../../lib/superAdminApi";
import {
  KeyRound,
  Search,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

export default function LicensesPage() {
  const [companies, setCompanies] = useState<SACompany[]>([]);
  const [allLicenses, setAllLicenses] = useState<(SALicense & { company_name?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const comps = await superAdminApi.listCompanies();
      setCompanies(comps);

      const results = await Promise.allSettled(
        comps.map(async (c) => {
          const licenses = await superAdminApi.listLicenses(c.id);
          return licenses.map((l) => ({ ...l, company_name: c.name }));
        })
      );

      const merged = results
        .filter((r) => r.status === "fulfilled")
        .flatMap((r) => r.value);

      setAllLicenses(merged);
    } catch (e: any) {
      setError(e?.response?.data?.detail || "Failed to load licenses");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = allLicenses.filter(
    (l) =>
      l.key.toLowerCase().includes(search.toLowerCase()) ||
      l.type.toLowerCase().includes(search.toLowerCase()) ||
      l.company_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5 animate-slide-up">
      <div>
        <h2 className="text-lg font-bold sa-text-primary">All Licenses</h2>
        <p className="text-xs sa-text-muted mt-0.5">Licenses across all companies</p>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 sa-text-muted" />
          <input
            type="text"
            placeholder="Search licenses..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sa-input pl-9 py-2 text-sm"
          />
        </div>
        <button onClick={load} className="sa-btn-ghost px-3 py-2 flex items-center gap-1.5">
          <RefreshCw size={14} /> Refresh
        </button>
        <span className="text-xs sa-text-muted">{filtered.length} license(s)</span>
      </div>

      {error && <div className="sa-error flex items-center gap-2"><AlertTriangle size={16} />{error}</div>}

      <div className="sa-table-wrap overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="sa-table-head">
              <th className="px-4 py-3 text-left">License Key</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Devices</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Expires</th>
              <th className="px-4 py-3 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="sa-table-row">
                  <td colSpan={7} className="px-4 py-4">
                    <div className="sa-skeleton h-4 w-48" />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center sa-text-muted">
                  No licenses found
                </td>
              </tr>
            ) : (
              filtered.map((l) => (
                <tr key={`${l.company_id}-${l.id}`} className="sa-table-row">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <KeyRound size={14} className="sa-text-muted" style={{ flexShrink: 0 }} />
                      <span className="font-mono text-xs sa-text-primary">{l.key}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="sa-badge">{l.type}</span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">{l.company_name || `#${l.company_id}`}</td>
                  <td className="px-4 py-3 text-xs sa-text-secondary">
                    {l.used_devices}/{l.max_devices}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full"
                      style={{
                        background: l.status === "active" ? "rgba(16,185,129,0.12)" : "rgba(239,68,68,0.12)",
                        color: l.status === "active" ? "#34d399" : "#f87171",
                      }}
                    >
                      {l.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-muted">
                    {l.expires_at ? new Date(l.expires_at).toLocaleDateString() : "Never"}
                  </td>
                  <td className="px-4 py-3 text-xs sa-text-muted">
                    {new Date(l.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
