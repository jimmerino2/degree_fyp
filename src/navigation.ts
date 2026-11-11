import type { MockResult } from "./types/domain";

export type ScreenId =
  | "home"
  | "capture"
  | "problem-picker"
  | "capture-check"
  | "result"
  | "follow-up"
  | "officer-referral"
  | "row-history"
  | "event-log"
  | "pattern-warning"
  | "farm-setup"
  | "sync";

/** Props every screen receives from the switcher. */
export interface ScreenProps {
  go: (screen: ScreenId) => void;
  mockResult: MockResult;
}
