import { useState } from "react";
import { CloudRain, Droplet, Sprout, SprayCan, type LucideIcon } from "lucide-react";
import { BottomNav } from "../components/BottomNav";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { IconTile } from "../components/IconTile";
import { Screen } from "../components/Screen";
import { TopBar } from "../components/TopBar";
import { copy, eventLabel, formatDate } from "../data/copy";
import { MOCK_TODAY } from "../data/mockFarm";
import { addEvent, getEvents } from "../data/sessionStore";
import type { EventType, FarmEvent } from "../types/domain";
import type { ScreenProps } from "../navigation";

const eventIcons: Record<EventType, LucideIcon> = {
  watered: Droplet,
  fed: Sprout,
  sprayed: SprayCan,
  rain: CloudRain,
};

export function EventLogScreen({ go }: ScreenProps) {
  const [type, setType] = useState<EventType | null>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(MOCK_TODAY);
  // In memory only; reload resets.
  const [events, setEvents] = useState<FarmEvent[]>(getEvents);

  function save() {
    if (!type) return;
    const saved = addEvent({ date, type, rowId: "r4", amount: amount || undefined });
    setEvents((prev) => [saved, ...prev]);
    setType(null);
    setAmount("");
  }

  return (
    <Screen top={<TopBar title={copy.eventLog.title} />} footer={<BottomNav active="event-log" go={go} />}>
      <div className="grid grid-cols-2 gap-4">
        {(Object.keys(eventIcons) as EventType[]).map((t) => (
          <IconTile key={t} icon={eventIcons[t]} label={eventLabel[t]} selected={type === t} onClick={() => setType(t)} />
        ))}
      </div>

      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink-muted">{copy.eventLog.amount}</span>
        <input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={copy.eventLog.amountPlaceholder}
          className="min-h-12 rounded-btn border border-line bg-surface px-3"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="text-sm text-ink-muted">{copy.eventLog.date}</span>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="min-h-12 rounded-btn border border-line bg-surface px-3"
        />
      </label>

      <Button disabled={!type} onClick={save}>
        {copy.eventLog.save}
      </Button>

      <Card title={copy.eventLog.recent}>
        <ul className="flex flex-col gap-3">
          {events.map((e) => {
            const Icon = eventIcons[e.type];
            return (
              <li key={e.id} className="flex items-center gap-3">
                <Icon aria-hidden size={20} className="text-info" />
                <span className="flex-1">
                  {eventLabel[e.type]}
                  <span className="text-sm text-ink-muted">
                    {" "}
                    · Row {e.rowId.slice(1)}
                    {e.amount && ` · ${e.amount}`}
                  </span>
                </span>
                <span className="text-sm text-ink-muted">{formatDate(e.date)}</span>
              </li>
            );
          })}
        </ul>
      </Card>
    </Screen>
  );
}
