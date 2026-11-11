import { useState } from "react";
import { CircleCheck, ImageUp, RotateCcw, TriangleAlert } from "lucide-react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { copy } from "../data/copy";
import { useDevice } from "../device";
import type { ScreenProps } from "../navigation";

export function CaptureCheckScreen({ go }: ScreenProps) {
  const desktop = useDevice() === "desktop";
  // Toggle so reviewers can see both branches.
  const [passed, setPassed] = useState(true);

  return (
    <Screen
      top={
        <TopBar
          title={copy.captureCheck.title}
          onBack={() => go("capture")}
          right={
            <button
              type="button"
              onClick={() => setPassed((p) => !p)}
              className="min-h-12 px-3 text-sm text-ink-muted underline"
            >
              {passed ? copy.captureCheck.showFail : copy.captureCheck.showPass}
            </button>
          }
        />
      }
    >
      <img
        src="/samples/plant.svg"
        alt=""
        className={`aspect-square w-full rounded-card object-cover ${desktop ? "mx-auto max-w-xs" : ""} ${passed ? "" : "blur-sm"}`}
      />

      {passed ? (
        <Card tone="healthy">
          <p className="flex items-center gap-2 text-lg font-semibold text-healthy">
            <CircleCheck aria-hidden size={24} />
            {copy.captureCheck.pass}
          </p>
          <p>{copy.captureCheck.passBody}</p>
        </Card>
      ) : (
        <Card tone="alert">
          <p className="flex items-center gap-2 text-lg font-semibold text-alert">
            <TriangleAlert aria-hidden size={24} />
            {copy.captureCheck.fail}
          </p>
          <p>{desktop ? copy.captureCheck.failBodyDesktop : copy.captureCheck.failBody}</p>
        </Card>
      )}

      <div className="mt-auto">
        {passed ? (
          <Button onClick={() => go("result")}>{copy.captureCheck.continue}</Button>
        ) : (
          <Button icon={desktop ? ImageUp : RotateCcw} onClick={() => go("capture")}>
            {desktop ? copy.captureCheck.reupload : copy.captureCheck.retake}
          </Button>
        )}
      </div>
    </Screen>
  );
}
