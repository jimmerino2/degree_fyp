import type { Farm, Row } from "../types/domain";

function makeRow(n: number): Row {
  const id = `r${n}`;
  return {
    id,
    label: `Row ${n}`,
    plants: Array.from({ length: 6 }, (_, i) => ({
      id: `${id}p${i + 1}`,
      qrTag: `RL-${n}${String(i + 1).padStart(2, "0")}`,
      rowId: id,
      positionInRow: i + 1,
    })),
  };
}

export const mockFarm: Farm = {
  name: "Sample chilli farm",
  variety: "Kulai 568",
  spacingCm: 60,
  growingMedium: "polybag",
  rows: [1, 2, 3, 4].map(makeRow),
};

/** "Today" for the prototype, so dates stay stable. */
export const MOCK_TODAY = "2026-10-28";
