import { CircleCheck, CircleAlert, CircleHelp, CloudCheck, Clock, TriangleAlert, type LucideIcon } from "lucide-react";

export type BadgeVariant = "healthy" | "possible" | "flagged" | "unsure" | "pending" | "synced";

const variants: Record<BadgeVariant, { Icon: LucideIcon; className: string; label: string }> = {
  healthy: { Icon: CircleCheck, className: "bg-brand-soft text-healthy", label: "Healthy" },
  possible: { Icon: CircleAlert, className: "bg-caution/10 text-caution", label: "Possible" },
  flagged: { Icon: TriangleAlert, className: "bg-alert/10 text-alert", label: "Flagged" },
  unsure: { Icon: CircleHelp, className: "bg-caution/10 text-caution", label: "Unsure" },
  pending: { Icon: Clock, className: "bg-info/10 text-info", label: "Pending" },
  synced: { Icon: CloudCheck, className: "bg-info/10 text-info", label: "Synced" },
};

export function StatusBadge({ variant, label }: { variant: BadgeVariant; label?: string }) {
  const { Icon, className, label: fallback } = variants[variant];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${className}`}>
      <Icon aria-hidden size={16} />
      {label ?? fallback}
    </span>
  );
}
