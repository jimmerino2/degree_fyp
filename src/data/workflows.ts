import type { ScreenId } from "../navigation";
import { MOCK_TODAY, mockFarm } from "./mockFarm";
import { mockPatternWarning } from "./mockFlags";
import { addEvent } from "./sessionStore";

/**
 * Tasks the mascot chat can run. Matching is simple keyword rules, not real AI.
 * The mascot never diagnoses or recommends sprays; it only runs app tasks.
 */
export interface Workflow {
  id: string;
  /** Shown as a quick-reply chip. */
  label: string;
  match: RegExp;
  /** Asked before running, for workflows that change data. */
  confirm?: string;
  steps: string[];
  done: string;
  run?: () => void;
  /** Screen to show afterwards. With autoOpen it opens by itself; otherwise a button is offered. */
  open?: { screen: ScreenId; label: string; autoOpen?: boolean };
}

// Matched in order, so the generic "check" workflow goes last. This is also the chip order.
export const workflows: Workflow[] = [
  {
    id: "report-problem",
    label: "Report a problem",
    match: /\b(problem|sick|spots?|yellow|wilt\w*|sakit)\b/i,
    steps: ["Start a new problem report"],
    done: "Tell me where the problem is.",
    open: { screen: "problem-picker", label: "Report a problem", autoOpen: true },
  },
  {
    id: "log-rain",
    label: "Log rain today",
    match: /\b(rain\w*|hujan)\b/i,
    confirm: `Log rain today for all ${mockFarm.rows.length} rows?`,
    steps: ["Create a rain entry for today", `Add it to Rows 1 to ${mockFarm.rows.length}`],
    done: `Done. Rain is logged for all ${mockFarm.rows.length} rows.`,
    run: () => mockFarm.rows.forEach((r) => addEvent({ date: MOCK_TODAY, type: "rain", rowId: r.id })),
    open: { screen: "event-log", label: "View log" },
  },
  {
    id: "explain-warning",
    label: "Why is Row 4 flagged?",
    match: /\b(warning|flag\w*|row 4)\b/i,
    steps: ["Read the last 5 checks on Row 4", "Compare them with the weather log"],
    done: `${mockPatternWarning.evidence} ${mockPatternWarning.suggestedCheck}`,
    open: { screen: "pattern-warning", label: "See the warning" },
  },
  {
    id: "sync-status",
    label: "Check sync",
    match: /\b(sync\w*|internet|wi-?fi)\b/i,
    steps: ["Count items waiting to upload"],
    done: "5 items are waiting. Photos upload on Wi-Fi only.",
    open: { screen: "sync", label: "Open sync" },
  },
  {
    id: "start-check",
    label: "Start today's check",
    match: /\b(check|check-up|checkup|photo|scan|start)\b/i,
    steps: ["Find today's sample plants", "Get Row 4, Plant 3 ready"],
    done: "Ready. Starting with Row 4, Plant 3.",
    open: { screen: "capture", label: "Start check", autoOpen: true },
  },
];

export function matchWorkflow(text: string): Workflow | undefined {
  const exact = workflows.find((w) => w.label.toLowerCase() === text.trim().toLowerCase());
  return exact ?? workflows.find((w) => w.match.test(text));
}
