import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { StatusBadge } from "../components/StatusBadge";
import { TopBar } from "../components/TopBar";
import { copy } from "../data/copy";
import type { ScreenProps } from "../navigation";

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex min-h-12 items-center justify-between gap-4">
      <span>{label}</span>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="size-6 accent-brand"
      />
    </label>
  );
}

export function SyncScreen({ go }: ScreenProps) {
  const [pending, setPending] = useState(5);
  const [lastSync, setLastSync] = useState("Yesterday, 6:40 pm");
  const [wifiOnly, setWifiOnly] = useState(true);
  const [consent, setConsent] = useState(false);

  return (
    <Screen top={<TopBar title={copy.sync.title} onBack={() => go("home")} />}>
      <Card>
        <div className="flex items-center justify-between">
          <span>{copy.sync.pending}</span>
          {pending > 0 ? <StatusBadge variant="pending" label={String(pending)} /> : <StatusBadge variant="synced" />}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-ink-muted">{copy.sync.lastSync}</span>
          <span className="text-sm">{lastSync}</span>
        </div>
      </Card>

      <Card>
        <Toggle label={copy.sync.wifiOnly} checked={wifiOnly} onChange={setWifiOnly} />
        <Toggle label={copy.sync.consent} checked={consent} onChange={setConsent} />
      </Card>

      <div className="mt-auto">
        <Button
          icon={RefreshCw}
          disabled={pending === 0}
          onClick={() => {
            setPending(0);
            setLastSync("Just now");
          }}
        >
          {copy.sync.syncNow}
        </Button>
      </div>
    </Screen>
  );
}
