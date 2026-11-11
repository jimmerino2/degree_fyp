export type Cause = "healthy" | "disease" | "pest" | "nutrient" | "water" | "supply" | "unsure";
export type PartType = "leaf" | "stem" | "fruit" | "whole";
export type CheckMode = "check-up" | "problem";
export type FlagStatus = "unconfirmed" | "confirmed" | "dismissed";
export type EventType = "watered" | "fed" | "sprayed" | "rain";

export interface Farm {
  name: string;
  variety: string;
  spacingCm: number;
  growingMedium: "soil" | "polybag";
  rows: Row[];
}

export interface Row {
  id: string;
  label: string;
  plants: Plant[];
}

export interface Plant {
  id: string;
  qrTag: string;
  rowId: string;
  positionInRow: number;
}

export interface Check {
  id: string;
  date: string;
  mode: CheckMode;
  plantId: string;
  cause: Cause;
  part: PartType;
  note?: string;
}

export interface Flag {
  id: string;
  checkIds: string[];
  cause: Cause;
  status: FlagStatus;
}

export interface PatternWarning {
  id: string;
  rowId: string;
  evidence: string;
  suggestedCheck: string;
  status: FlagStatus;
}

export interface FarmEvent {
  id: string;
  date: string;
  type: EventType;
  rowId: string;
  amount?: string;
  product?: string;
}

export interface Product {
  id: string;
  name: string;
  targets: Cause[];
  preHarvestDays: number;
  registered: boolean;
}

/** Result the reviewer picks in the switcher to drive Result and Follow-up. */
export type MockResult = "healthy" | "disease" | "nutrient" | "water" | "supply" | "unsure";
