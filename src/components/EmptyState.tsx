import type { LucideIcon } from "lucide-react";
import { Button } from "./Button";

interface EmptyStateProps {
  icon: LucideIcon;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

export function EmptyState({ icon: Icon, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-4 py-8 text-center">
      <Icon aria-hidden size={40} className="text-ink-muted" />
      <p>{message}</p>
      <Button variant="secondary" onClick={onAction}>
        {actionLabel}
      </Button>
    </div>
  );
}
