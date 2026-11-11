import type { ReactNode } from "react";

interface CardProps {
  title?: string;
  tone?: "default" | "healthy" | "alert";
  children: ReactNode;
}

const tones = {
  default: "bg-surface border-line",
  healthy: "bg-brand-soft border-brand/30",
  alert: "bg-alert/5 border-alert/40",
};

export function Card({ title, tone = "default", children }: CardProps) {
  return (
    <section className={`flex flex-col gap-2 rounded-card border p-4 ${tones[tone]}`}>
      {title && <h2 className="text-lg font-semibold">{title}</h2>}
      {children}
    </section>
  );
}
