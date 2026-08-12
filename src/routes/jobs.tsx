import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Plus, Briefcase } from "lucide-react";
import { JOBS, CANDIDATES } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { EmptyState } from "@/components/empty-state";
import { toast } from "sonner";

export const Route = createFileRoute("/jobs")({
  head: () => ({ meta: [{ title: "Jobs — Hiring OS" }] }),
  component: JobsPage,
});

function JobsPage() {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [jd, setJd] = React.useState("");
  const [scoreT, setScoreT] = React.useState(65);
  const [hireT, setHireT] = React.useState(70);

  const rows = JOBS.map((j) => {
    const cands = CANDIDATES.filter((c) => c.job_id === j.id);
    const avg = cands.length ? Math.round(cands.reduce((a, c) => a + c.final_score, 0) / cands.length) : 0;
    const scheduled = cands.filter((c) => c.status === "interview_scheduled").length;
    return { ...j, count: cands.length, avg, scheduled };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Jobs</h1>
          <p className="text-sm text-muted-foreground">All open roles and their pipelines.</p>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-1 size-4" /> New job
        </Button>
      </div>

      {rows.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          description="Create your first role to start screening candidates."
          action="Create job"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 font-medium">Job title</th>
                <th className="p-3 font-medium">Created</th>
                <th className="p-3 font-medium">Applicants</th>
                <th className="p-3 font-medium">Avg score</th>
                <th className="p-3 font-medium">Scheduled</th>
                <th className="p-3 font-medium">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((r) => (
                <tr key={r.id} className="cursor-pointer transition-colors hover:bg-muted/30">
                  <td className="p-3">
                    <Link to="/jobs/$jobId" params={{ jobId: r.id }} className="font-medium hover:text-primary">
                      {r.title}
                    </Link>
                    <div className="text-xs text-muted-foreground">{r.jd_summary}</div>
                  </td>
                  <td className="p-3 font-mono text-xs text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3 font-mono">{r.count}</td>
                  <td className="p-3 font-mono">{r.avg}</td>
                  <td className="p-3 font-mono">{r.scheduled}</td>
                  <td className="p-3">
                    <span
                      className={
                        r.status === "open"
                          ? "inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success ring-1 ring-inset ring-success/20"
                          : "inline-flex rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground ring-1 ring-inset ring-border"
                      }
                    >
                      {r.status === "open" ? "Open" : "Closed"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <Link to="/jobs/$jobId" params={{ jobId: r.id }}>
                      <Button size="sm" variant="ghost">Open</Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>New job</SheetTitle>
          </SheetHeader>
          <div className="mt-5 space-y-4">
            <div>
              <Label>Job title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Backend Engineer" />
            </div>
            <div>
              <Label>Job description</Label>
              <Textarea
                value={jd}
                onChange={(e) => setJd(e.target.value)}
                rows={10}
                placeholder="Paste the full JD here…"
              />
              <div className="mt-1 text-right font-mono text-[11px] text-muted-foreground">{jd.length} chars</div>
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label>Score threshold</Label>
                <span className="font-mono text-sm">{scoreT}</span>
              </div>
              <Slider value={[scoreT]} onValueChange={([v]) => setScoreT(v)} min={0} max={100} step={1} className="mt-3" />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label>Hire threshold</Label>
                <span className="font-mono text-sm">{hireT}</span>
              </div>
              <Slider value={[hireT]} onValueChange={([v]) => setHireT(v)} min={0} max={100} step={1} className="mt-3" />
            </div>
            <Button
              className="w-full"
              onClick={() => {
                setOpen(false);
                toast.success("Job created", { description: title || "Untitled role" });
                setTitle("");
                setJd("");
              }}
            >
              Create job
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}