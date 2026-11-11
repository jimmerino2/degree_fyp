import { Camera, CloudUpload, ImageUp, Search, TriangleAlert } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { Mascot } from "../components/Mascot";
import { APP_NAME, MASCOT_NAME } from "../config";
import { mockChecks } from "../data/mockChecks";
import { mockFarm, MOCK_TODAY } from "../data/mockFarm";
import { mockPatternWarning } from "../data/mockFlags";
import { copy, formatDate, mascotCopy } from "../data/copy";
import { useDevice } from "../device";
import { useMascot } from "../mascot";
import type { ScreenProps } from "../navigation";

export function HomeScreen({ go }: ScreenProps) {
  const lastCheck = mockChecks[mockChecks.length - 1];
  const rowsDue = mockFarm.rows.filter((r) => r.id !== "r1").map((r) => r.label);
  // Desktop has Sync in the side nav and uploads photos instead of taking them.
  const desktop = useDevice() === "desktop";
  const { openChat } = useMascot();

  return (
    <Screen
      top={
        <TopBar
          title={APP_NAME}
          right={
            !desktop && (
              <button
                type="button"
                onClick={() => go("sync")}
                aria-label={copy.sync.title}
                className="flex size-12 items-center justify-center rounded-btn text-ink-muted"
              >
                <CloudUpload aria-hidden size={24} />
              </button>
            )
          }
        />
      }
      footer={<BottomNav active="home" go={go} />}
    >
      <p className="text-sm text-ink-muted">
        {copy.home.title} · {formatDate(MOCK_TODAY)}
      </p>

      <Card title={copy.home.checkTitle} tone="healthy">
        <p>{desktop ? copy.home.checkBodyDesktop : copy.home.checkBody}</p>
        <Button icon={desktop ? ImageUp : Camera} onClick={() => go("capture")}>
          {copy.home.startCheck}
        </Button>
      </Card>

      <button
        type="button"
        onClick={openChat}
        className="flex items-center gap-3 rounded-card border border-line bg-surface p-4 text-left hover:bg-brand-soft"
      >
        <Mascot size={48} />
        <span className="flex-1">
          <span className="block font-semibold">{mascotCopy.open(MASCOT_NAME)}</span>
          <span className="block text-sm text-ink-muted">{mascotCopy.homeGreeting}</span>
        </span>
      </button>

      <Card>
        <dl className="grid grid-cols-2 gap-3">
          <div>
            <dt className="text-sm text-ink-muted">{copy.home.rowsDue}</dt>
            <dd className="font-semibold">{rowsDue.join(", ")}</dd>
          </div>
          <div>
            <dt className="text-sm text-ink-muted">{copy.common.lastCheck}</dt>
            <dd className="font-semibold">{formatDate(lastCheck.date)}</dd>
          </div>
        </dl>
      </Card>

      <Card title={copy.home.openWarning} tone="alert">
        <p className="flex gap-2">
          <TriangleAlert aria-hidden size={20} className="mt-0.5 shrink-0 text-alert" />
          {mockPatternWarning.evidence}
        </p>
        <Button variant="secondary" onClick={() => go("pattern-warning")}>
          {copy.home.viewWarning}
        </Button>
      </Card>

      <Button variant="ghost" icon={Search} onClick={() => go("problem-picker")}>
        {copy.home.reportProblem}
      </Button>
    </Screen>
  );
}
