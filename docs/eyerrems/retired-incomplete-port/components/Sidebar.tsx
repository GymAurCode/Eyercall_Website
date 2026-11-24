import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Mocking dependencies for the website demo
const useAuthStore = () => ({ user: { full_name: "Demo User", role_name: "Admin" }, logout: () => {} });
const useUIStore = () => ({ sidebarOpen: true, mobileDrawerOpen: false, closeMobileDrawer: () => {} });
const usePermissions = () => ({ can: () => true, isSuperAdmin: true });

const YELLOW = "#f6ce3a";
const SIDEBAR_BG = "#041515"; // Adjusted for website context if needed, but original uses var(--bg-sidebar)

type NavItem = { path: string; label: string; icon: string; requiredPermission: string };
type NavSection = { label: string; items: NavItem[] };

const ALL_NAV_ITEMS: NavItem[] = [
  { path: "/software/eyerrems/demo", label: "Dashboard", icon: "ti-layout-dashboard", requiredPermission: "dashboard.view" },
  { path: "/software/eyerrems/demo/construction", label: "Construction", icon: "ti-building-skyscraper", requiredPermission: "construction.view" },
  // Add other items here as they are ported
];

function NavItemComponent({ path, label, icon }: { path: string; label: string; icon?: string; badge?: boolean; onClick?: () => void }) {
  const location = useLocation();
  const isActive = path === "/software/eyerrems/demo"
    ? location.pathname === "/software/eyerrems/demo"
    : location.pathname.startsWith(path);

  return (
    <Link
      to={path}
      className="flex items-center gap-2 px-3 py-[3px] rounded-lg no-underline transition-all duration-150 group"
      style={{
        background: isActive ? "rgba(246,206,58,0.1)" : "transparent",
        color: isActive ? YELLOW : "#8ababa",
      }}
    >
      <i
        className={`ti ${icon} text-sm`}
        style={{
          color: isActive ? YELLOW : "#5a9999",
          fontSize: "12px",
          width: "16px",
          textAlign: "center",
          flexShrink: 0,
        }}
      />
      <span
        className="text-[10px] font-medium flex-1"
        style={{
          color: "inherit",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {label}
      </span>
    </Link>
  );
}

export default function Sidebar() {
  const { user } = useAuthStore();
  const { sidebarOpen } = useUIStore();

  return (
    <aside
      className="flex flex-col shrink-0 rounded-xl my-4 ml-4"
      style={{
        width: sidebarOpen ? "185px" : "56px",
        height: "calc(100vh - 2rem)",
        background: SIDEBAR_BG,
        border: "1px solid #1a3333",
        boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
      }}
    >
      <div className="flex items-center gap-2 px-4 py-1.5 border-b shrink-0" style={{ borderColor: "#1a3333" }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: YELLOW }}>
          <i className="ti ti-eye text-sm" style={{ color: "#001a1a" }} />
        </div>
        {sidebarOpen && (
          <div className="overflow-hidden">
            <p className="text-[11px] font-semibold leading-none" style={{ color: "#e0f0f0" }}>EyerRems</p>
            <p className="text-[8px] font-medium uppercase tracking-wider mt-[1px]" style={{ color: "#5a9999" }}>Real Estate</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-1 px-2 space-y-1">
        {ALL_NAV_ITEMS.map((item) => (
          <NavItemComponent key={item.path} {...item} />
        ))}
      </nav>
    </aside>
  );
}
