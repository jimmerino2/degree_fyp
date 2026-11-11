import { useState } from "react";
import { Package, Shovel } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { IconTile } from "../components/IconTile";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { copy } from "../data/copy";
import { mockFarm } from "../data/mockFarm";
import type { Farm } from "../types/domain";
import type { ScreenProps } from "../navigation";

const inputClass = "min-h-12 rounded-btn border border-line bg-surface px-3";

export function FarmSetupScreen({ go }: ScreenProps) {
  const [name, setName] = useState(mockFarm.name);
  const [variety, setVariety] = useState(mockFarm.variety);
  const [spacing, setSpacing] = useState(mockFarm.spacingCm);
  const [medium, setMedium] = useState<Farm["growingMedium"]>(mockFarm.growingMedium);
  const [rows, setRows] = useState(mockFarm.rows.length);
  const plantsPerRow = mockFarm.rows[0].plants.length;

  return (
    <Screen top={<TopBar title={copy.farmSetup.title} />} footer={<BottomNav active="farm-setup" go={go} />}>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink-muted">{copy.farmSetup.name}</span>
        <input value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink-muted">{copy.farmSetup.variety}</span>
        <input value={variety} onChange={(e) => setVariety(e.target.value)} className={inputClass} />
      </label>
      <div className="grid grid-cols-2 gap-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm text-ink-muted">{copy.farmSetup.spacing}</span>
          <input type="number" value={spacing} onChange={(e) => setSpacing(+e.target.value)} className={inputClass} />
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-sm text-ink-muted">{copy.farmSetup.rows}</span>
          <input type="number" min={1} value={rows} onChange={(e) => setRows(+e.target.value)} className={inputClass} />
        </label>
      </div>

      <fieldset className="flex flex-col gap-1">
        <legend className="mb-1 text-sm text-ink-muted">{copy.farmSetup.medium}</legend>
        <div className="grid grid-cols-2 gap-4">
          <IconTile icon={Shovel} label={copy.farmSetup.soil} selected={medium === "soil"} onClick={() => setMedium("soil")} />
          <IconTile
            icon={Package}
            label={copy.farmSetup.polybag}
            selected={medium === "polybag"}
            onClick={() => setMedium("polybag")}
          />
        </div>
      </fieldset>

      <p className="rounded-card border border-line bg-surface p-4">
        <span className="text-sm text-ink-muted">{copy.farmSetup.tags}: </span>
        <span className="font-semibold">{rows * plantsPerRow}</span>
      </p>

      <Button onClick={() => go("home")}>{copy.farmSetup.save}</Button>
    </Screen>
  );
}
