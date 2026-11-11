import type { FarmEvent, Flag, PatternWarning } from "../types/domain";

export const mockFlags: Flag[] = [
  { id: "f1", checkIds: ["c04"], cause: "pest", status: "confirmed" },
  { id: "f2", checkIds: ["c07"], cause: "nutrient", status: "dismissed" },
  { id: "f3", checkIds: ["c09", "c11", "c12"], cause: "disease", status: "unconfirmed" },
];

export const mockPatternWarning: PatternWarning = {
  id: "w1",
  rowId: "r4",
  evidence: "Row 4 was flagged on 3 of the last 5 checks. Flags went up after rain on 20 Oct.",
  suggestedCheck: "Check the lower leaves and fruit on Row 4 for spots. Look at drainage around the polybags.",
  status: "unconfirmed",
};

// Rain two days before the Row 4 flag cluster.
export const mockEvents: FarmEvent[] = [
  { id: "e1", date: "2026-10-18", type: "watered", rowId: "r4", amount: "2 L per plant" },
  { id: "e2", date: "2026-10-19", type: "fed", rowId: "r2", amount: "Fertigation mix" },
  { id: "e3", date: "2026-10-20", type: "rain", rowId: "r4" },
  { id: "e4", date: "2026-10-25", type: "sprayed", rowId: "r3", product: "Placeholder product B (replace with verified list)" },
];
