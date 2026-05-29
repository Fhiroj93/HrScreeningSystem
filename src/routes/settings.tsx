import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { CLIENT } from "@/lib/demo-data";
import { Upload } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings — Northbeam" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">Workspace, integrations, and scoring defaults.</p>
      </div>

      <Tabs defaultValue="branding">
        <TabsList>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="scoring">Scoring</TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="pt-4">
          <Branding />
        </TabsContent>
        <TabsContent value="integrations" className="pt-4">
          <Integrations />
        </TabsContent>
        <TabsContent value="scoring" className="pt-4">
          <Scoring />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Branding() {
  const [name, setName] = React.useState(CLIENT.company_name);
  const [color, setColor] = React.useState(CLIENT.brand_color);
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="space-y-4 rounded-lg border border-border bg-card p-5">
        <div>
          <Label>Logo</Label>
          <div className="mt-1 flex h-28 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
            <Upload className="mr-2 size-4" /> Upload logo
          </div>
        </div>
        <div>
          <Label>Company name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <Label>Brand color</Label>
          <div className="mt-1 flex items-center gap-3">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-9 w-12 cursor-pointer rounded-md border border-input bg-transparent"
            />
            <span className="font-mono text-xs text-muted-foreground">{color}</span>
          </div>
        </div>
        <Button onClick={() => toast.success("Branding saved")}>Save</Button>
      </div>

      <div className="rounded-lg border border-border bg-card p-5">
        <div className="text-xs uppercase tracking-wider text-muted-foreground">Preview</div>
        <div className="mt-3 overflow-hidden rounded-lg border border-border">
          <div className="flex items-center gap-2.5 px-4 py-3 text-white" style={{ backgroundColor: color }}>
            <div className="flex size-7 items-center justify-center rounded-md bg-white/20 text-xs font-semibold">
              {name[0]}
            </div>
            <span className="text-sm font-semibold">{name}</span>
          </div>
          <div className="space-y-3 bg-background p-5">
            <div className="text-base font-semibold">Welcome, Priya 👋</div>
            <p className="text-sm text-muted-foreground">
              We'd love to learn more about your experience before connecting you with the team.
            </p>
            <Button style={{ backgroundColor: color }}>Start screening</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="inline-flex rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success ring-1 ring-inset ring-success/20">
      Connected
    </span>
  ) : (
    <span className="inline-flex rounded-full bg-rose/10 px-2 py-0.5 text-xs font-medium text-rose ring-1 ring-inset ring-rose/20">
      Not configured
    </span>
  );
}

function Integrations() {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <Label>Calendly event URL</Label>
          <StatusBadge ok />
        </div>
        <div className="flex gap-2">
          <Input defaultValue={CLIENT.calendly_event_url} />
          <Button variant="outline" onClick={() => toast.success("Calendly link valid")}>Test link</Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <Label>Resend API key</Label>
          <StatusBadge ok />
        </div>
        <div className="flex gap-2">
          <Input type="password" defaultValue="re_••••••••••••••••" />
          <Button variant="outline" onClick={() => toast.success("Test email sent")}>Test email</Button>
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <Label>n8n webhook base URL</Label>
          <StatusBadge ok={false} />
        </div>
        <Input type="password" placeholder="https://n8n.example.com/webhook/..." />
      </div>
    </div>
  );
}

function Scoring() {
  const [scoreT, setScoreT] = React.useState(65);
  const [hireT, setHireT] = React.useState(70);
  const [cvW, setCvW] = React.useState(40);
  const chatW = 100 - cvW;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-baseline justify-between">
            <Label>Default CV score threshold</Label>
            <Input className="h-7 w-16 font-mono" value={scoreT} onChange={(e) => setScoreT(+e.target.value || 0)} />
          </div>
          <Slider value={[scoreT]} onValueChange={([v]) => setScoreT(v)} min={0} max={100} step={1} className="mt-3" />
        </Card>
        <Card>
          <div className="flex items-baseline justify-between">
            <Label>Default hire threshold</Label>
            <Input className="h-7 w-16 font-mono" value={hireT} onChange={(e) => setHireT(+e.target.value || 0)} />
          </div>
          <Slider value={[hireT]} onValueChange={([v]) => setHireT(v)} min={0} max={100} step={1} className="mt-3" />
        </Card>
      </div>
      <Card>
        <Label>Score weighting (must sum to 100)</Label>
        <div className="mt-3 space-y-3">
          <Weight label="CV weight" value={cvW} onChange={setCvW} />
          <Weight label="Chat weight" value={chatW} onChange={(v) => setCvW(100 - v)} />
        </div>
        <div className="mt-3 font-mono text-xs text-muted-foreground">
          Final = CV × {cvW}% + Chat × {chatW}%
        </div>
      </Card>
      <div className="flex justify-end">
        <Button onClick={() => toast.success("Scoring defaults saved")}>Save</Button>
      </div>
    </div>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-card p-5">{children}</div>;
}
function Weight({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono">{value}%</span>
      </div>
      <Slider value={[value]} onValueChange={([v]) => onChange(v)} min={0} max={100} step={5} className="mt-2" />
    </div>
  );
}