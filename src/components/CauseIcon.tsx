import { Bug, CircleCheck, CircleHelp, Droplets, FlaskConical, Leaf, Wrench, type LucideIcon } from "lucide-react";
import type { Cause } from "../types/domain";

// Colour is always paired with an icon and a label, never used alone.
const causes: Record<Cause, { Icon: LucideIcon; className: string }> = {
  healthy: { Icon: CircleCheck, className: "text-healthy" },
  disease: { Icon: Leaf, className: "text-alert" },
  pest: { Icon: Bug, className: "text-caution" },
  nutrient: { Icon: FlaskConical, className: "text-info" },
  water: { Icon: Droplets, className: "text-info" },
  supply: { Icon: Wrench, className: "text-caution" },
  unsure: { Icon: CircleHelp, className: "text-caution" },
};

export function CauseIcon({ cause, size = 24 }: { cause: Cause; size?: number }) {
  const { Icon, className } = causes[cause];
  return <Icon aria-hidden size={size} className={`shrink-0 ${className}`} />;
}
