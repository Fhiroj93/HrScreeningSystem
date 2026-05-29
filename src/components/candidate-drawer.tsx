import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDrawer } from "@/lib/drawer-store";
import { ScoreBadge } from "@/components/score-display";
import { StatusPill } from "@/components/status-pill";
import { JOBS, CLIENT } from "@/lib/demo-data";
import { cn } from "@/lib/utils";

export function CandidateDrawer() {
  const { open, candidate, tab, close, setTab } = useDrawer();
  if (!candidate) return null;
  const job = JOBS.find((j) => j.id === candidate.job_id);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
        <SheetHeader className="border-b border-border bg-card/60 px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <SheetTitle className="text-lg">{candidate.name}</SheetTitle>
              <div className="mt-0.5 text-xs text-muted-foreground">
                {candidate.email} · Applied to {job?.title}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <ScoreBadge score={candidate.final_score} />
              <StatusPill status={candidate.status} />
            </div>
          </div>
        </SheetHeader>

        <Tabs value={tab} onValueChange={(v) => setTab(v as never)} className="px-6 pb-8 pt-4">
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="chat">Screening Chat</TabsTrigger>
            <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-5 pt-4">
            <Section title="Skills">
              <div className="flex flex-wrap gap-1.5">
                {candidate.parsed_data.skills.map((s) => (
                  <span key={s} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </Section>
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total years" value={`${candidate.parsed_data.total_years}y`} />
              <Stat label="Gaps" value={candidate.parsed_data.gaps.length ? candidate.parsed_data.gaps.join(", ") : "None"} />
              <Stat
                label="Red flags"
                value={candidate.parsed_data.red_flags.length ? candidate.parsed_data.red_flags.join(", ") : "None"}
                tone={candidate.parsed_data.red_flags.length ? "warn" : "ok"}
              />
            </div>
            <Section title="Experience">
              <ol className="space-y-3">
                {candidate.parsed_data.experience.map((e, i) => (
                  <li key={i} className="rounded-md border border-border bg-card/40 p-3">
                    <div className="flex justify-between gap-3">
                      <div className="text-sm font-medium">
                        {e.title} <span className="text-muted-foreground">· {e.company}</span>
                      </div>
                      <div className="font-mono text-xs text-muted-foreground">{e.dates}</div>
                    </div>
                    <p className="mt-1.5 text-sm text-muted-foreground">{e.summary}</p>
                  </li>
                ))}
              </ol>
            </Section>
            <Section title="Education">
              {candidate.parsed_data.education.map((e, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span>
                    {e.degree} · <span className="text-muted-foreground">{e.school}</span>
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">{e.dates}</span>
                </div>
              ))}
            </Section>
          </TabsContent>

          <TabsContent value="chat" className="pt-4">
            {candidate.chat_transcript.length === 0 ? (
              <div className="rounded-md border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                Candidate hasn't started screening yet.
              </div>
            ) : (
              <div className="space-y-2.5 rounded-lg border border-border bg-card/40 p-4">
                {candidate.chat_transcript.map((m, i) => (
                  <div key={i} className={cn("flex", m.role === "ai" ? "justify-end" : "justify-start")}>
                    <div
                      className={cn(
                        "max-w-[78%] rounded-lg px-3 py-2 text-sm",
                        m.role === "ai"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground",
                      )}
                    >
                      <p>{m.text}</p>
                      <div className={cn("mt-1 font-mono text-[10px]", m.role === "ai" ? "text-primary-foreground/70" : "text-muted-foreground")}>
                        {m.ts}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="evaluation" className="space-y-4 pt-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <EvalCard title="CV Evaluation" score={candidate.cv_score}>
                <EvalList label="Matched requirements" items={candidate.cv_evaluation.matched} tone="ok" />
                <EvalList label="Unmet requirements" items={candidate.cv_evaluation.unmet} tone="warn" />
                <EvalList label="Strengths" items={candidate.cv_evaluation.strengths} tone="ok" />
                <EvalList label="Concerns" items={candidate.cv_evaluation.concerns} tone="warn" />
              </EvalCard>
              <EvalCard title="Chat Evaluation" score={candidate.chat_score}>
                {candidate.chat_evaluation ? (
                  <dl className="space-y-2 text-sm">
                    <Row k="Communication" v={candidate.chat_evaluation.communication} />
                    <Row k="Depth" v={candidate.chat_evaluation.depth} />
                    <Row k="Motivation" v={candidate.chat_evaluation.motivation} />
                    <Row k="Hire signal" v={candidate.chat_evaluation.hire_signal} />
                    <Row k="Recruiter note" v={candidate.chat_evaluation.note} />
                  </dl>
                ) : (
                  <p className="text-sm text-muted-foreground">Not screened yet.</p>
                )}
              </EvalCard>
            </div>
            <div className="rounded-md border border-border bg-card/40 p-4">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Final score calculation</div>
              <div className="mt-2 font-mono text-sm">
                CV ({candidate.cv_score}) × {CLIENT.cv_weight}% + Chat ({candidate.chat_score ?? "—"}) × {CLIENT.chat_weight}% ={" "}
                <span className="font-semibold text-foreground">{candidate.final_score} / 100</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="timeline" className="pt-4">
            <ol className="relative space-y-4 border-l border-border pl-6">
              {candidate.timeline.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[1.6rem] top-1 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-sm font-medium">{e.label}</div>
                  <div className="font-mono text-xs text-muted-foreground">{new Date(e.ts).toLocaleString()}</div>
                </li>
              ))}
            </ol>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{title}</h4>
      {children}
    </div>
  );
}
function Stat({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className="rounded-md border border-border bg-card/40 p-3">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={cn("mt-1 text-sm font-medium", tone === "warn" && "text-warning")}>{value}</div>
    </div>
  );
}
function EvalCard({ title, score, children }: { title: string; score: number | null; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="text-sm font-semibold">{title}</h4>
        <ScoreBadge score={score} />
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
function EvalList({ label, items, tone }: { label: string; items: string[]; tone: "ok" | "warn" }) {
  if (!items.length) return null;
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <ul className="mt-1 space-y-1 text-sm">
        {items.map((it) => (
          <li key={it} className="flex gap-2">
            <span className={cn("mt-1.5 size-1.5 shrink-0 rounded-full", tone === "ok" ? "bg-success" : "bg-warning")} />
            {it}
          </li>
        ))}
      </ul>
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      <dt className="text-xs uppercase tracking-wider text-muted-foreground">{k}</dt>
      <dd className="col-span-2 capitalize">{v}</dd>
    </div>
  );
}