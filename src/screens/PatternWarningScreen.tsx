import { useState } from "react";
import { Check, ClipboardCheck, TrendingUp, X } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { StatusBadge } from "../components/StatusBadge";
import { TopBar } from "../components/TopBar";
import { copy } from "../data/copy";
import { mockPatternWarning } from "../data/mockFlags";
import type { FlagStatus } from "../types/domain";
import type { ScreenProps } from "../navigation";

export function PatternWarningScreen({ go }: ScreenProps) {
  const [status, setStatus] = useState<FlagStatus>(mockPatternWarning.status);

  return (
    <Screen top={<TopBar title={copy.pattern.title} onBack={() => go("home")} />}>
      <div>
        <StatusBadge variant={status === "dismissed" ? "synced" : "flagged"} label="Row 4" />
      </div>

      <Card title={copy.pattern.evidence} tone="alert">
        <p className="flex gap-2">
          <TrendingUp aria-hidden size={20} className="mt-0.5 shrink-0 text-alert" />
          {mockPatternWarning.evidence}
        </p>
      </Card>

      <Card title={copy.pattern.suggested}>
        <p className="flex gap-2">
          <ClipboardCheck aria-hidden size={20} className="mt-0.5 shrink-0 text-brand" />
          {mockPatternWarning.suggestedCheck}
        </p>
      </Card>

      <div className="mt-auto flex flex-col gap-3">
        {status === "unconfirmed" ? (
          <>
            <Button icon={Check} onClick={() => setStatus("confirmed")}>
              {copy.pattern.confirm}
            </Button>
            <Button variant="secondary" icon={X} onClick={() => setStatus("dismissed")}>
              {copy.pattern.dismiss}
            </Button>
          </>
        ) : (
          <>
            <p className="text-center text-ink-muted">
              {status === "confirmed" ? copy.pattern.confirmed : copy.pattern.dismissed}
            </p>
            <Button variant="secondary" onClick={() => go("row-history")}>
              {copy.rowHistory.title}
            </Button>
          </>
        )}
      </div>
    </Screen>
  );
}
