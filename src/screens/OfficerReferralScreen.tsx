import { Phone, UserRound } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { StatusBadge } from "../components/StatusBadge";
import { TopBar } from "../components/TopBar";
import { copy, formatDate } from "../data/copy";
import { MOCK_TODAY } from "../data/mockFarm";
import type { ScreenProps } from "../navigation";

export function OfficerReferralScreen({ go }: ScreenProps) {
  const summary = [
    ["Plant", "Row 4 · Plant 3 (RL-403)"],
    ["Date", formatDate(MOCK_TODAY)],
    ["Part", "Leaves"],
    ["Photos", "2"],
    ["Answers", "Old leaves · Rain recently · Neighbours too"],
  ];

  return (
    <Screen top={<TopBar title={copy.referral.title} onBack={() => go("follow-up")} />}>
      <div className="flex flex-col items-center gap-3 py-4 text-center">
        <UserRound aria-hidden size={48} className="text-info" />
        <p className="text-lg font-semibold">{copy.referral.heading}</p>
        <p className="text-ink-muted">{copy.referral.body}</p>
      </div>

      <Card title={copy.referral.summary}>
        <dl className="flex flex-col gap-2">
          {summary.map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4">
              <dt className="text-sm text-ink-muted">{k}</dt>
              <dd className="text-right">{v}</dd>
            </div>
          ))}
        </dl>
        <div>
          <StatusBadge variant="pending" label="Saved, waiting to sync" />
        </div>
      </Card>

      <div className="mt-auto">
        <Button icon={Phone}>{copy.referral.contact}</Button>
      </div>
    </Screen>
  );
}
