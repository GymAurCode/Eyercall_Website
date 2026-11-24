import { useAuthStore } from "../store/auth";
import { AlertTriangle } from "lucide-react";

export default function DemoModeBanner() {
  const isDemoReadonly = useAuthStore((s) => s.isDemoReadonly);
  const companyMode = useAuthStore((s) => s.companyMode);
  const isSuperAdmin = useAuthStore((s) => s.isSuperAdmin);

  if (isSuperAdmin || companyMode !== "demo_readonly") return null;

  return (
    <div
      className="flex items-center gap-2 px-4 py-2 text-xs font-medium"
      style={{
        background: "rgba(245,158,11,0.1)",
        borderBottom: "1px solid rgba(245,158,11,0.2)",
        color: "#f59e0b",
      }}
    >
      <AlertTriangle size={14} />
      <span>Demo Mode — Read Only</span>
      <span className="opacity-60">|</span>
      <span className="opacity-70">Write operations are restricted</span>
    </div>
  );
}
