import * as React from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";
import { JOBS, type Candidate, STATUS_LABEL, type Status } from "@/lib/demo-data";
import { ScoreCell } from "@/components/score-display";
import { StatusPill } from "@/components/status-pill";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/lib/drawer-store";
import { cn } from "@/lib/utils";

type Key = "name" | "job" | "cv_score" | "chat_score" | "final_score" | "status" | "created_at";
const PAGE = 25;

export function CandidateTable({ rows, hideJob }: { rows: Candidate[]; hideJob?: boolean }) {
  const { show } = useDrawer();
  const [sort, setSort] = React.useState<{ key: Key; dir: "asc" | "desc" }>({ key: "final_score", dir: "desc" });
  const [page, setPage] = React.useState(0);

  const sorted = React.useMemo(() => {
    const arr = [...rows];
    arr.sort((a, b) => {
      const va: number | string =
        sort.key === "job" ? JOBS.find((j) => j.id === a.job_id)?.title ?? "" : (a as never)[sort.key] ?? 0;
      const vb: number | string =
        sort.key === "job" ? JOBS.find((j) => j.id === b.job_id)?.title ?? "" : (b as never)[sort.key] ?? 0;
      const cmp = typeof va === "number" && typeof vb === "number" ? va - vb : String(va).localeCompare(String(vb));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return arr;
  }, [rows, sort]);

  const pageRows = sorted.slice(page * PAGE, page * PAGE + PAGE);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE));

  const toggleSort = (k: Key) =>
    setSort((s) => (s.key === k ? { key: k, dir: s.dir === "asc" ? "desc" : "asc" } : { key: k, dir: "desc" }));

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <Th label="Name" k="name" sort={sort} onSort={toggleSort} />
              {!hideJob && <Th label="Job applied" k="job" sort={sort} onSort={toggleSort} />}
              <Th label="CV" k="cv_score" sort={sort} onSort={toggleSort} />
              <Th label="Chat" k="chat_score" sort={sort} onSort={toggleSort} />
              <Th label="Final" k="final_score" sort={sort} onSort={toggleSort} />
              <Th label="Status" k="status" sort={sort} onSort={toggleSort} />
              <Th label="Applied" k="created_at" sort={sort} onSort={toggleSort} />
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pageRows.map((c) => {
              const job = JOBS.find((j) => j.id === c.job_id);
              return (
                <tr key={c.id} className="transition-colors hover:bg-muted/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-7 items-center justify-center rounded-full bg-primary/15 text-[10px] font-medium text-primary">
                        {c.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                      <div className="min-w-0">
                        <div className="truncate font-medium">{c.name}</div>
                        <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  {!hideJob && <td className="p-3 text-muted-foreground">{job?.title}</td>}
                  <td className="p-3"><ScoreCell score={c.cv_score} /></td>
                  <td className="p-3"><ScoreCell score={c.chat_score} /></td>
                  <td className="p-3"><ScoreCell score={c.final_score} /></td>
                  <td className="p-3"><StatusPill status={c.status as Status} /></td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">
                    {new Date(c.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" onClick={() => show(c)}>View</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
        <span>
          Showing {pageRows.length} of {sorted.length}
        </span>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>
            Prev
          </Button>
          <span className="font-mono">
            {page + 1} / {totalPages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

function Th({
  label,
  k,
  sort,
  onSort,
}: {
  label: string;
  k: Key;
  sort: { key: Key; dir: "asc" | "desc" };
  onSort: (k: Key) => void;
}) {
  const active = sort.key === k;
  return (
    <th className="p-3 font-medium">
      <button
        onClick={() => onSort(k)}
        className={cn("inline-flex items-center gap-1 hover:text-foreground", active && "text-foreground")}
      >
        {label}
        {active ? (sort.dir === "asc" ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />) : <ArrowUpDown className="size-3 opacity-40" />}
      </button>
    </th>
  );
}