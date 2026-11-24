import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Eye, Edit2, BookOpen, Folder, FolderOpen, Users, Loader2 } from "lucide-react";
import { crmApi, Dealer } from "../../lib/crmApi";

/* ── Types ──────────────────────────────────────────────────────────────── */

interface TreeNode {
  id: number;
  dealer_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  is_active: boolean;
  parent_dealer_id: number | null;
  level: number | null;
  children_count: number;
  children: TreeNode[];
}

interface DealerHierarchyViewProps {
  onEdit: (dealer: Dealer) => void;
  onRefresh: () => void;
}

/* ── Main Component ─────────────────────────────────────────────────────── */

export default function DealerHierarchyView({ onEdit, onRefresh }: DealerHierarchyViewProps) {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTree = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await crmApi.getDealerTree();
      setTree(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load hierarchy");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchTree(); }, [fetchTree]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin" style={{ color: "var(--text-muted)" }} />
        <span className="ml-2 text-sm" style={{ color: "var(--text-muted)" }}>Loading hierarchy...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <p className="text-sm text-red-400">{error}</p>
        <button onClick={fetchTree} className="text-xs px-3 py-1.5 rounded-lg"
          style={{ border: "1px solid var(--border)", color: "var(--text-secondary)" }}>
          Retry
        </button>
      </div>
    );
  }

  if (tree.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
          style={{ background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.15)" }}>
          <Users size={20} style={{ color: "#3b82f6" }} />
        </div>
        <p className="text-sm font-medium text-primary">No dealers yet</p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Create your first dealer to see the hierarchy
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2 mb-2">
        <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>
          Hierarchy View
        </span>
        <span className="text-[10px] px-1.5 py-0.5 rounded-full"
          style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
          {tree.length} Main Dealer{tree.length !== 1 ? "s" : ""}
        </span>
      </div>
      {tree.map(node => (
        <TreeNodeItem
          key={node.id}
          node={node}
          depth={0}
          onEdit={onEdit}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  );
}

/* ── Tree Node Item ─────────────────────────────────────────────────────── */

function TreeNodeItem({
  node,
  depth,
  onEdit,
  onRefresh,
}: {
  node: TreeNode;
  depth: number;
  onEdit: (d: Dealer) => void;
  onRefresh: () => void;
}) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(depth < 1);
  const [actionOpen, setActionOpen] = useState(false);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [children, setChildren] = useState<TreeNode[]>(node.children);
  const actionRef = useRef<HTMLDivElement>(null);

  // Close action popup on outside click
  useEffect(() => {
    if (!actionOpen) return;
    const handler = (e: MouseEvent) => {
      if (actionRef.current && !actionRef.current.contains(e.target as Node)) {
        setActionOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [actionOpen]);

  const handleExpand = async () => {
    if (!expanded && children.length === 0 && node.children_count > 0) {
      // Lazy-load children
      setLoadingChildren(true);
      try {
        const data = await crmApi.getDealerTree();
        // Find this node in the fresh tree and get its children
        const findNode = (nodes: TreeNode[]): TreeNode | null => {
          for (const n of nodes) {
            if (n.id === node.id) return n;
            const found = findNode(n.children);
            if (found) return found;
          }
          return null;
        };
        const freshNode = findNode(data);
        if (freshNode) setChildren(freshNode.children);
      } catch {
        // fallback: use existing children
      } finally {
        setLoadingChildren(false);
      }
    }
    setExpanded(o => !o);
  };

  const handleNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActionOpen(o => !o);
  };

  const handleAction = (action: string) => {
    setActionOpen(false);
    switch (action) {
      case "view":
        navigate(`/crm/dealers/${node.id}`);
        break;
      case "edit":
        onEdit({ id: node.id, dealer_id: node.dealer_id, name: node.name } as Dealer);
        break;
      case "ledger":
        navigate(`/crm/dealers/${node.id}?tab=ledger`);
        break;
    }
  };

  const hasChildren = children.length > 0 || node.children_count > 0;
  const levelColors: Record<number, string> = { 1: "#3b82f6", 2: "#10b981", 3: "#f59e0b", 4: "#8b5cf6" };
  const levelColor = node.level ? levelColors[node.level] ?? "#6b7280" : "#6b7280";

  return (
    <div>
      <div
        className="flex items-center gap-2 py-2 px-3 rounded-lg group transition-colors cursor-default"
        style={{
          marginLeft: `${depth * 24}px`,
          background: actionOpen ? "rgba(59,130,246,0.05)" : undefined,
        }}
        onMouseEnter={(e) => { if (!actionOpen) e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
        onMouseLeave={(e) => { if (!actionOpen) e.currentTarget.style.background = undefined; }}
      >
        {/* Expand/collapse arrow */}
        <button
          className="w-5 h-5 flex items-center justify-center shrink-0 rounded transition-transform"
          style={{ color: "var(--text-muted)" }}
          onClick={handleExpand}
          disabled={!hasChildren || loadingChildren}
        >
          {loadingChildren ? (
            <Loader2 size={12} className="animate-spin" />
          ) : hasChildren ? (
            <ChevronRight
              size={14}
              style={{ transform: expanded ? "rotate(90deg)" : undefined, transition: "transform 0.15s" }}
            />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--text-muted)", opacity: 0.3 }} />
          )}
        </button>

        {/* Folder icon */}
        <span className="shrink-0" style={{ color: levelColor }}>
          {expanded && hasChildren ? <FolderOpen size={15} /> : <Folder size={15} />}
        </span>

        {/* Dealer name (clickable for action popup) */}
        <span
          className="text-sm font-medium cursor-pointer relative"
          style={{ color: "var(--text-primary)" }}
          onClick={handleNameClick}
          ref={actionRef}
        >
          {node.name}
          {!node.is_active && (
            <span className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full"
              style={{ background: "rgba(148,163,184,0.1)", color: "#94a3b8" }}>
              Inactive
            </span>
          )}

          {/* ── Action Popup ── */}
          {actionOpen && (
            <div
              className="absolute left-0 top-full mt-1 z-50 rounded-lg shadow-xl py-1 min-w-[140px]"
              style={{ background: "var(--bg-surface2)", border: "1px solid var(--border)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionMenuItem icon={Eye} label="View" onClick={() => handleAction("view")} />
              <ActionMenuItem icon={Edit2} label="Edit" onClick={() => handleAction("edit")} />
              <ActionMenuItem icon={BookOpen} label="Ledger" onClick={() => handleAction("ledger")} />
            </div>
          )}
        </span>

        {/* Dealer ID */}
        <span className="font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
          {node.dealer_id}
        </span>

        {/* Level badge */}
        {node.level != null && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
            style={{ background: `${levelColor}18`, color: levelColor }}>
            L{node.level}
          </span>
        )}

        {/* Children count badge */}
        {node.children_count > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full"
            style={{ background: "rgba(59,130,246,0.12)", color: "#3b82f6" }}>
            {node.children_count} sub
          </span>
        )}

        {/* Phone */}
        {node.phone && (
          <span className="text-[10px] ml-auto shrink-0" style={{ color: "var(--text-muted)" }}>
            {node.phone}
          </span>
        )}
      </div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {loadingChildren ? (
            <div className="flex items-center gap-2 py-2 px-3" style={{ marginLeft: `${(depth + 1) * 24}px` }}>
              <Loader2 size={12} className="animate-spin" style={{ color: "var(--text-muted)" }} />
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>Loading sub-dealers...</span>
            </div>
          ) : (
            children.map(child => (
              <TreeNodeItem
                key={child.id}
                node={child}
                depth={depth + 1}
                onEdit={onEdit}
                onRefresh={onRefresh}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ── Action Menu Item ───────────────────────────────────────────────────── */

function ActionMenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: any;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs transition-colors"
      style={{ color: "var(--text-secondary)" }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text-primary)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = undefined; e.currentTarget.style.color = "var(--text-secondary)"; }}
      onClick={onClick}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}
