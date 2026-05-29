import { cn } from "@/lib/utils";
import { STATUS_LABEL, type Status } from "@/lib/demo-data";

const styles: Record<Status, string> = {
  received: "bg-muted text-muted-foreground ring-border",
  scored: "bg-primary/10 text-primary ring-primary/20",
  screening_invited: "bg-warning/10 text-warning ring-warning/20",
  screening_complete: "bg-primary/10 text-primary ring-primary/20",
  interview_scheduled: "bg-success/10 text-success ring-success/20",
  rejected: "bg-rose/10 text-rose ring-rose/20",
  screened_out: "bg-rose/10 text-rose ring-rose/20",
};

export function StatusPill({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        styles[status],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-80" />
      {STATUS_LABEL[status]}
    </span>
  );
}