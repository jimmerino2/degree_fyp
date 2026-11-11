import { ClipboardCheck, Clock } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { CauseIcon } from "../components/CauseIcon";
import { Screen } from "../components/Screen";
import { StatusBadge, type BadgeVariant } from "../components/StatusBadge";
import { TopBar } from "../components/TopBar";
import { causeLabel, copy, mockResults } from "../data/copy";
import { mockProducts } from "../data/mockProducts";
import type { ScreenProps } from "../navigation";

export function ResultScreen({ go, mockResult }: ScreenProps) {
  const result = mockResults[mockResult];
  const badge: BadgeVariant =
    mockResult === "healthy" ? "healthy" : result.confidence === "Unsure" ? "unsure" : result.confidence === "Likely" ? "flagged" : "possible";
  // Products are only shown for disease, never for a supply fault.
  const products = mockResult === "disease" ? mockProducts.filter((p) => p.targets.includes("disease")) : [];

  return (
    <Screen top={<TopBar title={copy.result.title} onBack={() => go("capture-check")} />}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">Row 4 · Plant 3</p>
        <StatusBadge variant={badge} label={mockResult === "healthy" ? undefined : result.confidence} />
      </div>

      <Card tone={mockResult === "healthy" ? "healthy" : "default"}>
        <p className="text-sm text-ink-muted">{copy.result.likelyCause}</p>
        <p className="flex items-center gap-2 text-lg font-semibold">
          <CauseIcon cause={mockResult} />
          {causeLabel[mockResult]}
        </p>
        <p>{result.summary}</p>
      </Card>

      <Card title={copy.result.firstCheck}>
        <p className="flex gap-2">
          <ClipboardCheck aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
          {result.firstCheck}
        </p>
      </Card>

      {products.length > 0 && (
        <Card title={copy.result.products}>
          <ul className="flex flex-col gap-3">
            {products.map((p) => (
              <li key={p.id} className="border-t border-line pt-3 first:border-0 first:pt-0">
                <p>{p.name}</p>
                <p className="flex items-center gap-1 text-sm text-ink-muted">
                  <Clock aria-hidden size={14} />
                  {copy.result.phi(p.preHarvestDays)}
                </p>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="mt-auto flex flex-col gap-3">
        {mockResult !== "healthy" && (
          <Button variant={mockResult === "unsure" ? "primary" : "secondary"} onClick={() => go("follow-up")}>
            {copy.result.askQuestions}
          </Button>
        )}
        {mockResult !== "unsure" && <Button onClick={() => go("home")}>{copy.result.done}</Button>}
      </div>
    </Screen>
  );
}
