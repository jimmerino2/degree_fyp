import { CloudUpload } from "lucide-react";
import { APP_NAME } from "../config";
import { copy } from "../data/copy";
import type { ScreenId } from "../navigation";
import { navItems } from "./BottomNav";

const items = [...navItems, { id: "sync", label: copy.sync.title, Icon: CloudUpload }] as const;

/** Desktop replacement for BottomNav. */
export function SideNav({ active, go }: { active: ScreenId; go: (s: ScreenId) => void }) {
  return (
    <nav className="flex w-56 shrink-0 flex-col gap-1 border-r border-line bg-surface p-3">
      <p className="px-3 py-4 text-lg font-semibold text-brand">{APP_NAME}</p>
      {items.map(({ id, label, Icon }) => {
        const isActive = id === active;
        return (
          <button
            key={id}
            type="button"
            onClick={() => go(id)}
            aria-current={isActive ? "page" : undefined}
            className={`flex min-h-12 items-center gap-3 rounded-btn px-3 text-left ${
              isActive ? "bg-brand-soft font-semibold text-brand" : "text-ink-muted hover:bg-canvas"
            }`}
          >
            <Icon aria-hidden size={22} />
            {label}
          </button>
        );
      })}
    </nav>
  );
}
