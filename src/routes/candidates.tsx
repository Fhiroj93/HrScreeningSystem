import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Download, Users } from "lucide-react";
import { CANDIDATES, JOBS, STATUS_LABEL, type Status } from "@/lib/demo-data";
import { CandidateTable } from "@/components/candidate-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { EmptyState } from "@/components/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";

export const Route = createFileRoute("/candidates")({
  head: () => ({ meta: [{ title: "Candidates — Northbeam" }] }),
  component: CandidatesPage,
});

function CandidatesPage() {
  const [q, setQ] = React.useState("");
  const [job, setJob] = React.useState<string>("all");
  const [statuses, setStatuses] = React.useState<Set<Status>>(new Set());
  const [range, setRange] = React.useState<[number, number]>([0, 100]);

  const rows = CANDIDATES.filter((c) => {
    if (q && !`${c.name} ${c.email}`.toLowerCase().includes(q.toLowerCase())) return false;
    if (job !== "all" && c.job_id !== job) return false;
    if (statuses.size && !statuses.has(c.status)) return false;
    if (c.final_score < range[0] || c.final_score > range[1]) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Candidates</h1>
        <p className="text-sm text-muted-foreground">Search and filter across all jobs.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3">
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email…"
          className="h-9 max-w-xs"
        />
        <Select value={job} onValueChange={setJob}>
          <SelectTrigger className="h-9 w-48">
            <SelectValue placeholder="All jobs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All jobs</SelectItem>
            {JOBS.map((j) => (
              <SelectItem key={j.id} value={j.id}>
                {j.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              Status {statuses.size > 0 && `(${statuses.size})`}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {(Object.keys(STATUS_LABEL) as Status[]).map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={statuses.has(s)}
                onCheckedChange={(c) => {
                  const next = new Set(statuses);
                  if (c) next.add(s);
                  else next.delete(s);
                  setStatuses(next);
                }}
              >
                {STATUS_LABEL[s]}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex min-w-56 items-center gap-3">
          <span className="text-xs text-muted-foreground">Score</span>
          <Slider
            value={range}
            onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
            min={0}
            max={100}
            step={1}
            className="w-44"
          />
          <span className="font-mono text-xs text-muted-foreground">
            {range[0]}–{range[1]}
          </span>
        </div>

        <div className="ml-auto">
          <Button variant="outline" size="sm" className="h-9">
            <Download className="mr-1 size-4" /> Export CSV
          </Button>
        </div>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No candidates match"
          description="Try clearing filters or expanding the score range."
        />
      ) : (
        <CandidateTable rows={rows} />
      )}
    </div>
  );
}