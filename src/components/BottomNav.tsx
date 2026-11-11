import { Home, NotebookPen, Rows3, Tractor } from "lucide-react";
import { copy } from "../data/copy";
import { useDevice } from "../device";
import type { ScreenId } from "../navigation";

export const navItems = [
  { id: "home", label: copy.nav.home, Icon: Home },
  { id: "event-log", label: copy.nav.log, Icon: NotebookPen },
  { id: "row-history", label: copy.nav.rows, Icon: Rows3 },
  { id: "farm-setup", label: copy.nav.farm, Icon: Tractor },
] as const;

export function BottomNav({ active, go }: { active: ScreenId; go: (s: ScreenId) => void }) {
  // Desktop uses SideNav instead.
  if (useDevice() === "desktop") return null;

  return (
    <nav className="grid grid-cols-4 border-t border-line bg-surface">
      {navItems.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-16 flex-col items-center justify-center gap-1 text-sm ${
              isActive ? "font-semibold text-brand" : "text-ink-muted"
            }`}
          >
            <Icon aria-hidden size={24} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
