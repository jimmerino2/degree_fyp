import { useState } from "react";
import { Apple, Leaf, Rows3, Sprout, TreeDeciduous } from "lucide-react";
import { Button } from "../components/Button";
import { IconTile } from "../components/IconTile";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { copy } from "../data/copy";
import type { ScreenProps } from "../navigation";

const parts = [
  { id: "leaf", label: copy.picker.parts.leaf, icon: Leaf },
  { id: "fruit", label: copy.picker.parts.fruit, icon: Apple },
  { id: "stem", label: copy.picker.parts.stem, icon: TreeDeciduous },
  { id: "whole", label: copy.picker.parts.whole, icon: Sprout },
  { id: "row", label: copy.picker.parts.row, icon: Rows3 },
] as const;

export function ProblemPickerScreen({ go }: ScreenProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Screen
      top={<TopBar title={copy.picker.title} onBack={() => go("home")} />}
      footer={
        <div className="px-4 pb-4">
          <Button disabled={!selected} onClick={() => go("capture")}>
            {copy.picker.next}
          </Button>
        </div>
      }
    >
      <p className="text-ink-muted">{copy.picker.hint}</p>
      <div className="grid grid-cols-2 gap-4">
        {parts.map((p) => (
          <IconTile
            key={p.id}
            icon={p.icon}
            label={p.label}
            selected={selected === p.id}
            onClick={() => setSelected(p.id)}
          />
        ))}
      </div>
    </Screen>
  );
}
