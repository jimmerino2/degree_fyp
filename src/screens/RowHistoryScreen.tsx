import { useState } from "react";
import { BottomNav } from "../components/BottomNav";
import { Card } from "../components/Card";
import { CauseIcon } from "../components/CauseIcon";
import { Screen } from "../components/Screen";
import { StatusBadge, type BadgeVariant } from "../components/StatusBadge";
import { TopBar } from "../components/TopBar";
import { causeLabel, copy, formatDate } from "../data/copy";
import { mockChecks } from "../data/mockChecks";
import { mockFarm } from "../data/mockFarm";
import { mockFlags } from "../data/mockFlags";
import type { FlagStatus } from "../types/domain";
import type { ScreenProps } from "../navigation";

const flagBadge: Record<FlagStatus, BadgeVariant> = {
  unconfirmed: "possible",
  confirmed: "flagged",
  dismissed: "synced",
};

export function RowHistoryScreen({ go }: ScreenProps) {
  const [rowId, setRowId] = useState("r4");
  const plantIds = new Set(mockFarm.rows.find((r) => r.id === rowId)!.plants.map((p) => p.id));
  const checks = mockChecks.filter((c) => plantIds.has(c.plantId)).reverse();
  const checkIds = new Set(checks.map((c) => c.id));
  const flags = mockFlags.filter((f) => f.checkIds.some((id) => checkIds.has(id)));

  return (
    <Screen top={<TopBar title={copy.rowHistory.title} />} footer={<BottomNav active="row-history" go={go} />}>
      <div className="flex gap-2 overflow-x-auto" role="tablist">
        {mockFarm.rows.map((r) => (
          <button
            key={r.id}
            type="button"
            role="tab"
            aria-selected={r.id === rowId}
            onClick={() => setRowId(r.id)}
            className={`min-h-12 shrink-0 rounded-full border px-4 text-sm font-semibold ${
              r.id === rowId ? "border-brand bg-brand text-white" : "border-line bg-surface"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      {flags.length > 0 && (
        <Card title={copy.rowHistory.flags}>
          {flags.map((f) => (
            <div key={f.id} className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <CauseIcon cause={f.cause} size={20} />
                {causeLabel[f.cause]} ({f.checkIds.length})
              </span>
              <StatusBadge variant={flagBadge[f.status]} label={f.status[0].toUpperCase() + f.status.slice(1)} />
            </div>
          ))}
        </Card>
      )}

      <Card title={copy.rowHistory.checks}>
        <ol className="flex flex-col">
          {checks.map((c) => (
            <li key={c.id} className="flex gap-3 border-l-2 border-line pb-4 pl-4 last:pb-0">
              <span className="w-14 shrink-0 text-sm text-ink-muted">{formatDate(c.date)}</span>
              <div className="flex-1">
                <p className="flex items-center gap-2 font-medium">
                  <CauseIcon cause={c.cause} size={18} />
                  {causeLabel[c.cause]}
                </p>
                <p className="text-sm text-ink-muted">
                  Plant {c.plantId.split("p")[1]}
                  {c.note ? ` · ${c.note}` : ""}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </Screen>
  );
}
