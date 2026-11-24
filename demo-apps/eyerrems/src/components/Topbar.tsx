import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUIStore } from "../store/ui";
import { useAuthStore } from "../store/auth";
import NotificationBell from "./notifications/NotificationBell";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function IconBtn({ onClick, label, title, children, className }: {
  onClick?: () => void;
  label: string;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={title ?? label}
      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150 relative ${className || ""}`}
      style={{ color: "var(--text-secondary)", flexShrink: 0 }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "var(--hover-bg)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {children}
    </button>
  );
}

export default function Topbar({ title }: { title?: string }) {
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const openMobileDrawer = useUIStore((s) => s.openMobileDrawer);
  const theme = useUIStore((s) => s.theme);
  const toggleTheme = useUIStore((s) => s.toggleTheme);
  const user = useAuthStore((s) => s.user);
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <header
        className="mobile-header"
        style={{
          background: "var(--bg-surface)",
          borderColor: "var(--border)",
        }}
      >
        <IconBtn onClick={openMobileDrawer} label="Open menu">
          <i className="ti ti-menu-2 text-lg" />
        </IconBtn>

        {title && (
          <span className="mobile-header-title">{title}</span>
        )}

        <div className="flex items-center gap-1">
          <IconBtn onClick={toggleTheme} label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
            <i className={`ti ti-${theme === "dark" ? "sun" : "moon"} text-base`} />
          </IconBtn>
          <NotificationBell />
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 cursor-pointer"
            style={{
              background: "rgba(246,206,58,0.12)",
              border: "1px solid rgba(246,206,58,0.25)",
              color: "#f6ce3a",
            }}
            onClick={() => navigate("/settings")}
          >
            {user?.full_name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header
      className="h-14 flex items-center justify-between px-4 border-b shrink-0"
      style={{
        background: "var(--bg-surface)",
        borderColor: "var(--border)",
      }}
    >
      <div className="flex items-center gap-3">
        <IconBtn onClick={toggleSidebar} label="Toggle sidebar">
          <i className="ti ti-menu-2 text-base" />
        </IconBtn>
        {title && (
          <h1
            className="text-[18px] font-medium leading-none"
            style={{ color: "var(--text-primary)" }}
          >
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border"
          style={{
            background: "var(--bg-surface)",
            borderColor: "var(--border)",
          }}
        >
          <i className="ti ti-search text-sm" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Search..."
            className="text-xs bg-transparent outline-none border-none w-[140px]"
            style={{ color: "var(--text-primary)" }}
          />
        </div>

        <IconBtn onClick={() => navigate("/advance-options")} label="Advance Options">
          <i className="ti ti-adjustments-horizontal text-base" />
        </IconBtn>

        <IconBtn onClick={() => navigate("/docs")} label="Documentation" title="Documentation">
          <i className="ti ti-book-2 text-base" />
        </IconBtn>

        <IconBtn onClick={toggleTheme} label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}>
          <i className={`ti ti-${theme === "dark" ? "sun" : "moon"} text-base`} />
        </IconBtn>

        <NotificationBell />
      </div>
    </header>
  );
}
