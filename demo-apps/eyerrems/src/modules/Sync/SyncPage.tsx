import { useEffect, useState, useCallback, useRef } from "react";
import {
  Smartphone,
  QrCode,
  RefreshCw,
  Trash2,
  Clock,
  Check,
  AlertCircle,
  Wifi,
  WifiOff,
  Monitor,
  Apple,
  Copy,
  CheckCircle2,
} from "lucide-react";
import {
  createPairingToken,
  getPairingStatus,
  listMyDevices,
  revokeDevice,
  type PairingToken,
  type ConnectedDevice,
} from "./api";

function formatTimeLeft(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const mins = Math.floor(diff / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "Never";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function platformIcon(platform: string) {
  const p = platform?.toLowerCase() || "";
  if (p.includes("ios") || p.includes("iphone") || p.includes("ipad"))
    return <Apple size={14} />;
  if (p.includes("android")) return <Smartphone size={14} />;
  return <Monitor size={14} />;
}

export default function SyncPage() {
  const [pairing, setPairing] = useState<PairingToken | null>(null);
  const [paired, setPaired] = useState(false);
  const [devices, setDevices] = useState<ConnectedDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadDevices = useCallback(async () => {
    try {
      const list = await listMyDevices();
      setDevices(list);
    } catch {
      /* silently fail */
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        await loadDevices();
      } finally {
        setLoading(false);
      }
    })();
  }, [loadDevices]);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const startCountdown = (expiresAt: string) => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    const tick = () => {
      const left = formatTimeLeft(expiresAt);
      setTimeLeft(left);
      if (left === "Expired") {
        clearInterval(countdownRef.current!);
        setPairing(null);
      }
    };
    tick();
    countdownRef.current = setInterval(tick, 1000);
  };

  const startPolling = (token: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const status = await getPairingStatus(token);
        if (status.paired) {
          clearInterval(pollRef.current!);
          clearInterval(countdownRef.current!);
          setPaired(true);
          setPairing(null);
          setSuccess(`Paired with ${status.device_name || "mobile device"}!`);
          setTimeout(() => setSuccess(""), 4000);
          await loadDevices();
        }
      } catch {
        /* keep polling */
      }
    }, 2000);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setError("");
    setPaired(false);
    try {
      const token = await createPairingToken();
      setPairing(token);
      startCountdown(token.expires_at);
      startPolling(token.token);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Failed to generate pairing token");
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyCode = () => {
    if (!pairing) return;
    navigator.clipboard.writeText(pairing.pairing_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRevoke = async (device: ConnectedDevice) => {
    if (!confirm(`Unpair "${device.device_name}"?`)) return;
    setError("");
    try {
      await revokeDevice(device.id);
      setDevices((prev) => prev.filter((d) => d.id !== device.id));
      setSuccess(`"${device.device_name}" unpaired`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e: any) {
      setError(e?.response?.data?.detail ?? "Failed to unpair device");
    }
  };

  const handleRefresh = async () => {
    await loadDevices();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 animate-slide-up max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-primary">Mobile & Desktop Sync</h1>
          <p className="text-xs text-muted mt-0.5">
            Pair your mobile device to sync data in real-time
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors"
          style={{
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
        >
          <RefreshCw size={12} />
          Refresh
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div
          className="flex items-center gap-2 text-xs text-red-400 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
          }}
        >
          <AlertCircle size={12} /> {error}
        </div>
      )}
      {success && (
        <div
          className="flex items-center gap-2 text-xs text-emerald-400 px-3 py-2 rounded-lg"
          style={{
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)",
          }}
        >
          <Check size={12} /> {success}
        </div>
      )}

      {/* Section 1: Connect New Mobile Device */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(16,185,129,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(16,185,129,0.25)",
              boxShadow: "0 0 12px rgba(16,185,129,0.1)",
            }}
          >
            <QrCode size={15} style={{ color: "#10b981" }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">
              Connect New Mobile Device
            </h2>
            <p className="text-[11px] text-muted mt-0.5">
              Generate a QR code or pairing code to link your phone
            </p>
          </div>
        </div>

        <div className="p-5">
          {!pairing && !paired && (
            <div className="flex flex-col items-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(16,185,129,0.08)",
                  border: "1px solid rgba(16,185,129,0.15)",
                }}
              >
                <Smartphone size={28} style={{ color: "#10b981" }} />
              </div>
              <p className="text-sm text-secondary mb-1">
                No active pairing session
              </p>
              <p className="text-xs text-muted mb-5">
                Click below to generate a QR code for your mobile device
              </p>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, #10b981, #059669)",
                  color: "#fff",
                }}
              >
                {generating ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <QrCode size={16} />
                )}
                {generating ? "Generating..." : "Generate QR Code"}
              </button>
            </div>
          )}

          {paired && (
            <div className="flex flex-col items-center py-8">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: "rgba(16,185,129,0.12)",
                  border: "1px solid rgba(16,185,129,0.3)",
                }}
              >
                <CheckCircle2 size={28} style={{ color: "#10b981" }} />
              </div>
              <p className="text-sm font-semibold text-primary mb-1">
                Device Paired Successfully!
              </p>
              <p className="text-xs text-muted mb-4">
                Your mobile device is now connected
              </p>
              <button
                onClick={() => {
                  setPaired(false);
                  handleGenerate();
                }}
                className="text-xs font-medium text-emerald-400 hover:underline"
              >
                Pair Another Device
              </button>
            </div>
          )}

          {pairing && (
            <div className="flex flex-col items-center">
              {/* QR Code */}
              <div
                className="rounded-xl p-4 mb-4"
                style={{
                  background: "#fff",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pairing.token)}`}
                  alt="Pairing QR Code"
                  width={200}
                  height={200}
                  style={{ display: "block", borderRadius: 4 }}
                />
              </div>

              {/* Pairing Code */}
              <p className="text-xs text-muted mb-2">
                Or enter this pairing code on your mobile device:
              </p>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="px-4 py-2 rounded-lg font-mono text-lg font-bold tracking-widest"
                  style={{
                    background: "rgba(16,185,129,0.08)",
                    border: "1px solid rgba(16,185,129,0.2)",
                    color: "#10b981",
                    letterSpacing: "0.15em",
                  }}
                >
                  {pairing.pairing_code}
                </div>
                <button
                  onClick={handleCopyCode}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    border: "1px solid var(--border)",
                    color: copied ? "#10b981" : "var(--text-secondary)",
                  }}
                  title="Copy code"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>

              {/* Timer + Status */}
              <div className="flex items-center gap-4 mb-4">
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{ color: timeLeft === "Expired" ? "#ef4444" : "var(--text-secondary)" }}
                >
                  <Clock size={12} />
                  Expires in {timeLeft}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <span
                    className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"
                  />
                  Waiting for mobile device...
                </div>
              </div>

              <button
                onClick={() => {
                  if (pollRef.current) clearInterval(pollRef.current);
                  if (countdownRef.current) clearInterval(countdownRef.current);
                  setPairing(null);
                }}
                className="text-xs font-medium text-muted hover:text-primary transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: Connected Devices */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="px-5 py-3 flex items-center gap-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "rgba(59,130,246,0.12)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(59,130,246,0.25)",
              boxShadow: "0 0 12px rgba(59,130,246,0.1)",
            }}
          >
            <Wifi size={15} style={{ color: "#3b82f6" }} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-primary">
              Connected Devices
            </h2>
            <p className="text-[11px] text-muted mt-0.5">
              {devices.length} device{devices.length !== 1 ? "s" : ""} paired
            </p>
          </div>
        </div>

        <div>
          {devices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted">
              <WifiOff size={32} className="mb-2 opacity-30" />
              <p className="text-xs">No devices connected</p>
              <p className="text-[11px] mt-1">
                Generate a QR code above to pair your first device
              </p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: "var(--border)" }}>
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="px-5 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: device.is_active
                          ? "rgba(16,185,129,0.08)"
                          : "rgba(239,68,68,0.08)",
                        border: device.is_active
                          ? "1px solid rgba(16,185,129,0.15)"
                          : "1px solid rgba(239,68,68,0.15)",
                        color: device.is_active ? "#10b981" : "#ef4444",
                      }}
                    >
                      {platformIcon(device.platform)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-primary">
                          {device.device_name}
                        </p>
                        <span
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium"
                          style={{
                            background: device.is_active
                              ? "rgba(16,185,129,0.08)"
                              : "rgba(239,68,68,0.08)",
                            color: device.is_active ? "#10b981" : "#ef4444",
                            border: device.is_active
                              ? "1px solid rgba(16,185,129,0.15)"
                              : "1px solid rgba(239,68,68,0.15)",
                          }}
                        >
                          {device.is_active ? "Online" : "Offline"}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[11px] text-muted">
                          {device.platform}
                          {device.os_version ? ` ${device.os_version}` : ""}
                        </span>
                        {device.app_version && (
                          <span className="text-[11px] text-muted">
                            v{device.app_version}
                          </span>
                        )}
                        <span className="text-[11px] text-muted">
                          Last synced {timeAgo(device.last_synced_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRevoke(device)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-medium rounded-lg transition-colors"
                    style={{
                      background: "rgba(239,68,68,0.06)",
                      color: "#ef4444",
                      border: "1px solid rgba(239,68,68,0.15)",
                    }}
                  >
                    <Trash2 size={11} />
                    Unpair
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
