import type { Product } from "../types/domain";

// Placeholders only. Replace with the verified DOA / MARDI list.
export const mockProducts: Product[] = [
  { id: "p1", name: "Placeholder product A (replace with verified list)", targets: ["disease"], preHarvestDays: 7, registered: true },
  { id: "p2", name: "Placeholder product B (replace with verified list)", targets: ["pest"], preHarvestDays: 3, registered: true },
  { id: "p3", name: "Placeholder product C (replace with verified list)", targets: ["disease"], preHarvestDays: 14, registered: true },
];
