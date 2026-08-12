import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Users, Star, MessageCircle, CalendarCheck, ArrowRight } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { CANDIDATES, ACTIVITY, JOBS, STATUS_LABEL, type Status } from "@/lib/demo-data";
import { ScoreBadge } from "@/components/score-display";
import { useDrawer } from "@/lib/drawer-store";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Hiring OS" },
      { name: "description", content: "Pipeline overview, top candidates, and live activity." },
    ],
  }),
  component: Index,
});

function Index() {
  const { show } = useDrawer();
  const top = [...CANDIDATES].sort((a, b) => b.final_score - a.final_score).slice(0, 5);

  const pipeline = (Object.keys(STATUS_LABEL) as Status[]).map((s) => ({
    name: STATUS_LABEL[s],
    value: CANDIDATES.filter((c) => c.status === s).length,
  }));

  const avgCv = Math.round(CANDIDATES.reduce((a, c) => a + c.cv_score, 0) / CANDIDATES.length);
  const screened = CANDIDATES.filter((c) => c.chat_score != null).length;
  const completion = Math.round((screened / CANDIDATES.length) * 100);
  const interviews = CANDIDATES.filter((c) => c.status === "interview_scheduled").length;

  // demo realtime: occasional toast
  useEffect(() => {
    const t = setTimeout(() => toast("New candidate received", { description: "Hana Sato applied to Product Designer" }), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">Pipeline health across all open roles.</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-success/25 bg-success/10 px-3 py-1 label-mono text-success">
          <span className="size-1.5 animate-pulse rounded-full bg-success" /> Live
        </span>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 surface-glow">
        <div
          className="pointer-events-none absolute -right-24 -top-24 size-72 rounded-full opacity-25 blur-3xl"
          style={{ backgroundImage: "linear-gradient(120deg, var(--brand-1), var(--brand-2))" }}
        />
        <p className="label-mono text-muted-foreground">Hiring OS · Command center</p>
        <h2 className="mt-3 max-w-2xl text-4xl font-bold leading-[1.1]">
          Every applicant, <span className="text-gradient-brand">scored and screened</span> in one control room.
        </h2>
        <p className="mt-3 max-w-xl text-sm text-muted-foreground">
          CV scoring, AI screening chats, and interview scheduling — updating continuously from your live hiring pipeline.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Chip tone="primary">{CANDIDATES.length} candidates</Chip>
          <Chip tone="success">{interviews} interviews</Chip>
          <Chip tone="warning">{screened} screened</Chip>
          <Chip tone="rose">{CANDIDATES.filter((c) => c.status === "screened_out").length} screened out</Chip>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total candidates" value={CANDIDATES.length} sub="this month" icon={Users} trend="+12%" />
        <StatCard label="Avg CV score" value={`${avgCv} / 100`} sub="active jobs" icon={Star} trend="+3" />
        <StatCard label="Screening completion" value={`${completion}%`} sub={`${screened} / ${CANDIDATES.length} screened`} icon={MessageCircle} trend="+8%" />
        <StatCard label="Interviews scheduled" value={interviews} sub="this month" icon={CalendarCheck} trend="+5" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Recent activity" subtitle="Live updates from your pipeline" />
          <ul className="divide-y divide-border">
            {ACTIVITY.map((a) => (
              <li key={a.id} className="flex items-center gap-3 py-3">
                <ActivityDot kind={a.kind} />
                <div className="flex-1 text-sm">{a.text}</div>
                <div className="font-mono text-xs text-muted-foreground">{a.ts}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader title="Top candidates this week" subtitle="Highest final scores" />
          <ul className="space-y-2">
            {top.map((c) => {
              const job = JOBS.find((j) => j.id === c.job_id);
              return (
                <li key={c.id} className="flex items-center gap-3 rounded-md p-2 hover:bg-muted/40">
                  <div className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-medium text-primary">
                    {c.name.split(" ").map((n) => n[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{c.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{job?.title}</div>
                  </div>
                  <ScoreBadge score={c.final_score} />
                  <Button variant="ghost" size="sm" onClick={() => show(c)}>
                    View <ArrowRight className="ml-1 size-3" />
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>

      <Card>
        <CardHeader title="Candidate pipeline by stage" subtitle="All jobs combined" />
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pipeline} layout="vertical" margin={{ left: 24, right: 24 }}>
              <CartesianGrid horizontal={false} stroke="var(--border)" />
              <XAxis type="number" stroke="var(--muted-foreground)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="var(--muted-foreground)" fontSize={12} width={150} />
              <Tooltip
                cursor={{ fill: "var(--muted)" }}
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }}
              />
              <defs>
                <linearGradient id="pipelineFill" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="var(--brand-1)" />
                  <stop offset="100%" stopColor="var(--brand-2)" />
                </linearGradient>
              </defs>
              <Bar dataKey="value" fill="url(#pipelineFill)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}

function Chip({ children, tone }: { children: React.ReactNode; tone: "primary" | "success" | "warning" | "rose" }) {
  const map = {
    primary: "border-primary/30 bg-primary/10 text-primary",
    success: "border-success/30 bg-success/10 text-success",
    warning: "border-warning/30 bg-warning/10 text-warning",
    rose: "border-rose/30 bg-rose/10 text-rose",
  } as const;
  return (
    <span className={cn("rounded-full border px-3 py-1 text-xs font-medium", map[tone])}>{children}</span>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  trend,
}: {
  label: string;
  value: string | number;
  sub: string;
  icon: React.ElementType;
  trend: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between">
        <span className="label-mono text-muted-foreground">{label}</span>
        <span className="flex size-9 items-center justify-center rounded-lg bg-primary/12 text-primary ring-1 ring-inset ring-primary/20">
          <Icon className="size-4" />
        </span>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-3xl font-semibold tracking-tight">{value}</span>
        <span className="text-xs font-medium text-success">{trend}</span>
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-xl border border-border bg-card p-5", className)}>{children}</div>;
}
function CardHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-4 flex items-baseline justify-between">
      <div>
        <h3 className="label-mono text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
  );
}
function ActivityDot({ kind }: { kind: string }) {
  const map: Record<string, string> = {
    scored: "bg-primary",
    screened: "bg-primary",
    interview: "bg-success",
    received: "bg-muted-foreground",
    rejected: "bg-rose",
  };
  return <span className={cn("size-2 shrink-0 rounded-full", map[kind] ?? "bg-muted-foreground")} />;
}
