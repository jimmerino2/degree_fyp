import { useState } from "react";
import { CircleHelp, CloudRain, Layers, Leaf, Rows3, Sprout, Sun, User, type LucideIcon } from "lucide-react";
import { IconTile } from "../components/IconTile";
import { ProgressDots } from "../components/ProgressDots";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { copy, followUpQuestions, type AnswerIcon } from "../data/copy";
import type { ScreenProps } from "../navigation";

const icons: Record<AnswerIcon, LucideIcon> = {
  old: Leaf,
  new: Sprout,
  both: Layers,
  "yes-rain": CloudRain,
  "no-sun": Sun,
  unknown: CircleHelp,
  "yes-rows": Rows3,
  "no-single": User,
};

export function FollowUpScreen({ go, mockResult }: ScreenProps) {
  const [index, setIndex] = useState(0);
  const total = followUpQuestions.length;
  const question = followUpQuestions[index];

  function answer() {
    if (index + 1 < total) {
      setIndex(index + 1);
      return;
    }
    // After three questions, an unsure case goes to an officer.
    go(mockResult === "unsure" ? "officer-referral" : "result");
  }

  return (
    <Screen top={<TopBar title={copy.followUp.title} onBack={() => go("result")} />}>
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink-muted">{copy.followUp.progress(index + 1, total)}</p>
        <ProgressDots total={total} answered={index} />
      </div>
      <p className="text-lg font-semibold">{question.text}</p>
      <div key={index} className="fade-in grid grid-cols-2 gap-4">
        {question.answers.map((a) => (
          <IconTile key={a.label} icon={icons[a.icon]} label={a.label} onClick={answer} />
        ))}
      </div>
    </Screen>
  );
}
