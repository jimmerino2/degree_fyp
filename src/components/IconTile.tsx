import type { LucideIcon } from "lucide-react";

interface IconTileProps {
  icon: LucideIcon;
  label: string;
  selected?: boolean;
  onClick?: () => void;
}

/** Icon-first option tile. 96 px minimum, 32 px icon, label below. */
export function IconTile({ icon: Icon, label, selected = false, onClick }: IconTileProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-card border-2 p-3 text-center text-sm font-medium ${
        selected ? "border-brand bg-brand-soft text-brand" : "border-line bg-surface text-ink"
      }`}
    >
      <Icon aria-hidden size={32} />
      {label}
    </button>
  );
}
