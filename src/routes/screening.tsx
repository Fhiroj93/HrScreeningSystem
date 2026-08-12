import { createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CANDIDATES, JOBS } from "@/lib/demo-data";
import { Button } from "@/components/ui/button";
import { useDrawer } from "@/lib/drawer-store";
import { EmptyState } from "@/components/empty-state";
import { MessagesSquare } from "lucide-react";

export const Route = createFileRoute("/screening")({
  head: () => ({ meta: [{ title: "Screening — Hiring OS" }] }),
  component: ScreeningPage,
});

function ScreeningPage() {
  const inProgress = CANDIDATES.filter((c) => c.status === "screening_invited");
  const completed = CANDIDATES.filter(
    (c) => c.status === "screening_complete" || c.status === "interview_scheduled" || c.status === "screened_out",
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Screening</h1>
        <p className="text-sm text-muted-foreground">Candidates currently in or completed with screening.</p>
      </div>

      <Tabs defaultValue="in_progress">
        <TabsList>
          <TabsTrigger value="in_progress">In progress ({inProgress.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="in_progress" className="pt-4">
          <ScreenList rows={inProgress} emptyText="No candidates currently being screened." />
        </TabsContent>
        <TabsContent value="completed" className="pt-4">
          <ScreenList rows={completed} emptyText="No completed screenings yet." />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ScreenList({ rows, emptyText }: { rows: typeof CANDIDATES; emptyText: string }) {
  const { show } = useDrawer();
  if (rows.length === 0)
    return <EmptyState icon={MessagesSquare} title="Nothing here" description={emptyText} />;
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card">
      <table className="w-full text-sm">
        <thead className="border-b border-border bg-muted/30 text-left text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="p-3 font-medium">Name</th>
            <th className="p-3 font-medium">Job</th>
            <th className="p-3 font-medium">Chat started</th>
            <th className="p-3 font-medium">Messages</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((c) => {
            const job = JOBS.find((j) => j.id === c.job_id);
            return (
              <tr key={c.id} className="hover:bg-muted/30">
                <td className="p-3 font-medium">{c.name}</td>
                <td className="p-3 text-muted-foreground">{job?.title}</td>
                <td className="p-3 font-mono text-xs text-muted-foreground">
                  {new Date(c.created_at).toLocaleString()}
                </td>
                <td className="p-3 font-mono">{c.chat_transcript.length}</td>
                <td className="p-3 text-xs">{c.status.replace(/_/g, " ")}</td>
                <td className="p-3 text-right">
                  <Button size="sm" variant="ghost" onClick={() => show(c, "chat")}>
                    Open chat
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}