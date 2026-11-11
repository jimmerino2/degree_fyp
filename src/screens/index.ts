import type { ComponentType } from "react";
import type { ScreenId, ScreenProps } from "../navigation";
import { CaptureCheckScreen } from "./CaptureCheckScreen";
import { CaptureScreen } from "./CaptureScreen";
import { EventLogScreen } from "./EventLogScreen";
import { FarmSetupScreen } from "./FarmSetupScreen";
import { FollowUpScreen } from "./FollowUpScreen";
import { HomeScreen } from "./HomeScreen";
import { OfficerReferralScreen } from "./OfficerReferralScreen";
import { PatternWarningScreen } from "./PatternWarningScreen";
import { ProblemPickerScreen } from "./ProblemPickerScreen";
import { ResultScreen } from "./ResultScreen";
import { RowHistoryScreen } from "./RowHistoryScreen";
import { SyncScreen } from "./SyncScreen";

/** Every screen, in the order of the design spec's screen map. */
export const screens: { id: ScreenId; label: string; Component: ComponentType<ScreenProps> }[] = [
  { id: "home", label: "Home", Component: HomeScreen },
  { id: "capture", label: "Capture (check-up)", Component: CaptureScreen },
  { id: "problem-picker", label: "Problem picker", Component: ProblemPickerScreen },
  { id: "capture-check", label: "Capture check", Component: CaptureCheckScreen },
  { id: "result", label: "Result", Component: ResultScreen },
  { id: "follow-up", label: "Follow-up question", Component: FollowUpScreen },
  { id: "officer-referral", label: "Officer referral", Component: OfficerReferralScreen },
  { id: "row-history", label: "Row history", Component: RowHistoryScreen },
  { id: "event-log", label: "Event log", Component: EventLogScreen },
  { id: "pattern-warning", label: "Pattern warning", Component: PatternWarningScreen },
  { id: "farm-setup", label: "Farm setup", Component: FarmSetupScreen },
  { id: "sync", label: "Sync status", Component: SyncScreen },
];
