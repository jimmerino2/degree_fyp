import type { FarmEvent } from "../types/domain";
import { mockEvents } from "./mockFlags";

// Shared in-memory state, so changes made in one place (e.g. the mascot chat)
// show up on other screens. Reloading the page resets it.
const events: FarmEvent[] = [...mockEvents];

/** Newest first. */
export function getEvents(): FarmEvent[] {
  return [...events].reverse();
}

export function addEvent(event: Omit<FarmEvent, "id">): FarmEvent {
  const saved = { ...event, id: `e${Date.now()}-${events.length}` };
  events.push(saved);
  return saved;
}
