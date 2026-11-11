import type { Check } from "../types/domain";

// Spread over three weeks. Row 4 is flagged on 3 of its last 5 checks.
export const mockChecks: Check[] = [
  { id: "c01", date: "2026-10-08", mode: "check-up", plantId: "r1p2", cause: "healthy", part: "whole" },
  { id: "c02", date: "2026-10-08", mode: "check-up", plantId: "r2p3", cause: "healthy", part: "whole" },
  { id: "c03", date: "2026-10-10", mode: "check-up", plantId: "r4p1", cause: "healthy", part: "whole" },
  { id: "c04", date: "2026-10-12", mode: "problem", plantId: "r3p5", cause: "pest", part: "leaf", note: "Curled leaves, small insects underneath" },
  { id: "c05", date: "2026-10-14", mode: "check-up", plantId: "r1p4", cause: "healthy", part: "whole" },
  { id: "c06", date: "2026-10-15", mode: "check-up", plantId: "r4p2", cause: "healthy", part: "whole" },
  { id: "c07", date: "2026-10-17", mode: "check-up", plantId: "r2p1", cause: "nutrient", part: "leaf", note: "Yellowing between veins" },
  { id: "c08", date: "2026-10-20", mode: "check-up", plantId: "r3p2", cause: "healthy", part: "whole" },
  { id: "c09", date: "2026-10-22", mode: "problem", plantId: "r4p3", cause: "disease", part: "leaf", note: "Dark spots on leaves" },
  { id: "c10", date: "2026-10-23", mode: "check-up", plantId: "r4p4", cause: "healthy", part: "whole" },
  { id: "c11", date: "2026-10-24", mode: "problem", plantId: "r4p5", cause: "disease", part: "leaf", note: "Spots spreading" },
  { id: "c12", date: "2026-10-26", mode: "check-up", plantId: "r4p3", cause: "disease", part: "fruit", note: "Sunken patches on fruit" },
  { id: "c13", date: "2026-10-27", mode: "check-up", plantId: "r1p1", cause: "healthy", part: "whole" },
];
