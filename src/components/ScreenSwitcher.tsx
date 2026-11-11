import { Monitor, Smartphone, type LucideIcon } from "lucide-react";
import { APP_NAME } from "../config";
import type { Device } from "../device";
import type { ScreenId } from "../navigation";
import { screens } from "../screens";
import type { MockResult } from "../types/domain";

const mockResults: MockResult[] = ["healthy", "disease", "nutrient", "water", "supply", "unsure"];

const devices: { id: Device; label: string; Icon: LucideIcon }[] = [
  { id: "mobile", label: "Mobile", Icon: Smartphone },
  { id: "desktop", label: "Desktop", Icon: Monitor },
];

interface ScreenSwitcherProps {
  current: ScreenId;
  onSelect: (id: ScreenId) => void;
  mockResult: MockResult;
  onMockResult: (r: MockResult) => void;
  device: Device;
  onDevice: (d: Device) => void;
}

/** Reviewer-only panel. Not part of the app itself. */
export function ScreenSwitcher({ current, onSelect, mockResult, onMockResult, device, onDevice }: ScreenSwitcherProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 bg-white p-4 text-sm sm:w-64 sm:rounded-card sm:border sm:border-line">
      <div>
        <p className="font-semibold">{APP_NAME} prototype</p>
        <p className="text-ink-muted">Pick a screen to preview</p>
      </div>

      <div className="grid grid-cols-2 gap-1 rounded-btn bg-canvas p-1" role="radiogroup" aria-label="View">
        {devices.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={device === id}
            onClick={() => onDevice(id)}
            className={`flex min-h-10 items-center justify-center gap-2 rounded-lg ${
              device === id ? "bg-white font-semibold text-brand shadow-sm" : "text-ink-muted"
            }`}
          >
            <Icon aria-hidden size={16} />
            {label}
          </button>
        ))}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-ink-muted">Mock result</span>
        <select
          value={mockResult}
          onChange={(e) => onMockResult(e.target.value as MockResult)}
          className="min-h-10 rounded-btn border border-line bg-white px-2"
        >
          {mockResults.map((r) => (
            <option key={r} value={r}>
              {r[0].toUpperCase() + r.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <ol className="flex flex-col gap-1">
        {screens.map((s, i) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => onSelect(s.id)}
              aria-current={s.id === current ? "page" : undefined}
              className={`w-full rounded-btn px-3 py-2 text-left ${
                s.id === current ? "bg-brand font-semibold text-white" : "hover:bg-brand-soft"
              }`}
            >
              {i + 1}. {s.label}
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
