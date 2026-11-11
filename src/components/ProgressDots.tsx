export function ProgressDots({ total, answered }: { total: number; answered: number }) {
  return (
    <div className="flex gap-2" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} className={`size-3 rounded-full ${i < answered ? "bg-brand" : "border-2 border-line"}`} />
      ))}
    </div>
  );
}
