import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import * as React from "react";
import { ChevronLeft, Edit3 } from "lucide-react";
import { jobById, candidatesByJob, CANDIDATES, STATUS_LABEL, type Status } from "@/lib/demo-data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CandidateTable } from "@/components/candidate-table";
import { ScoreBadge } from "@/components/score-display";
import { useDrawer } from "@/lib/drawer-store";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

export const Route = createFileRoute("/jobs/$jobId")({
  head: () => ({ meta: [{ title: "Job — Northbeam" }] }),
  component: JobDetail,
});

function JobDetail() {
  const { jobId } = useParams({ from: "/jobs/$jobId" });
  const job = jobById(jobId);
  const { show } = useDrawer();
  const [scoreT, setScoreT] = React.useState(job?.score_threshold ?? 65);
  const [hireT, setHireT] = React.useState(job?.hire_threshold ?? 70);

  if (!job) return <div>Job not found</div>;

  const cands = candidatesByJob(job.id);
  const top = [...cands].sort((a, b) => b.final_score - a.final_score).slice(0, 5);
  const pipeline = (Object.keys(STATUS_LABEL) as Status[]).map((s) => ({
    name: STATUS_LABEL[s],
    value: cands.filter((c) => c.status === s).length,
  }));

  return (
    <div className="space-y-6">
      <Link to="/jobs" className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-3" /> All jobs
      </Link>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{job.title}</h1>
          <p className="text-sm text-muted-foreground">
            Created {new Date(job.created_at).toLocaleDateString()} · {cands.length} applicants
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-card px-3 py-1.5">
            <span className="text-xs text-muted-foreground">Open</span>
            <Switch defaultChecked={job.status === "open"} />
          </div>
          <Button variant="outline" size="sm"><Edit3 className="mr-1 size-4" /> Edit</Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="candidates">Candidates ({cands.length})</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Pipeline by stage</h3>
            <div className="mt-3 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={pipeline} layout="vertical" margin={{ left: 24, right: 24 }}>
                  <CartesianGrid horizontal={false} stroke="var(--border)" />
                  <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
                  <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={150} />
                  <Tooltip
                    cursor={{ fill: "var(--muted)" }}
                    contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
                  />
                  <Bar dataKey="value" fill="var(--primary)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <h3 className="text-sm font-semibold">Top candidates</h3>
            <ul className="mt-3 space-y-2">
              {top.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/40">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.email}</div>
                  </div>
                  <ScoreBadge score={c.final_score} />
                  <Button variant="ghost" size="sm" onClick={() => show(c)}>View</Button>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>

        <TabsContent value="candidates" className="pt-4">
          <CandidateTable rows={cands} hideJob />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 pt-4">
          <div className="rounded-lg border border-border bg-card p-5">
            <Label>Job description</Label>
            <Textarea defaultValue={job.jd_text} rows={8} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <Label>Score threshold</Label>
                <span className="font-mono text-sm">{scoreT}</span>
              </div>
              <Slider value={[scoreT]} onValueChange={([v]) => setScoreT(v)} min={0} max={100} step={1} className="mt-3" />
            </div>
            <div className="rounded-lg border border-border bg-card p-5">
              <div className="flex items-baseline justify-between">
                <Label>Hire threshold</Label>
                <span className="font-mono text-sm">{hireT}</span>
              </div>
              <Slider value={[hireT]} onValueChange={([v]) => setHireT(v)} min={0} max={100} step={1} className="mt-3" />
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-5">
            <Label>Calendly URL override</Label>
            <Input defaultValue="" placeholder="Leave empty to use workspace default" className="mt-1" />
          </div>
          <div className="flex justify-end"><Button>Save changes</Button></div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Avoid unused-import warning
void CANDIDATES;