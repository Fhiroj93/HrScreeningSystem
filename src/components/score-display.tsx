import { cn } from "@/lib/utils";

function tone(score: number) {
  if (score >= 70) return "text-success bg-success/10 ring-success/20";
  if (score >= 50) return "text-warning bg-warning/10 ring-warning/20";
  return "text-rose bg-rose/10 ring-rose/20";
}
function bar(score: number) {
  if (score >= 70) return "bg-success";
  if (score >= 50) return "bg-warning";
  return "bg-rose";
}

export function ScoreBadge({ score, className }: { score: number | null; className?: string }) {
  if (score == null)
    return <span className={cn("font-mono text-xs text-muted-foreground", className)}>—</span>;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-0.5 font-mono text-xs font-medium ring-1 ring-inset",
        tone(score),
        className,
      )}
    >
      {score} / 100
    </span>
  );
}

export function ScoreCell({ score }: { score: number | null }) {
  if (score == null) return <span className="font-mono text-xs text-muted-foreground">—</span>;
  return (
    <div className="min-w-24">
      <div className={cn("font-mono text-sm tabular-nums", score >= 70 ? "text-success" : score >= 50 ? "text-warning" : "text-rose")}>
        {score}
        <span className="text-muted-foreground"> / 100</span>
      </div>
      <div className="mt-1 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div className={cn("h-full rounded-full", bar(score))} style={{ width: `${score}%` }} />
      </div>
    </div>
  );
}