import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CLIENT } from "@/lib/demo-data";
import { Upload } from "lucide-react";

const KEY = "onboarding_complete_v1";

export function OnboardingWizard() {
  const [open, setOpen] = React.useState(false);
  const [step, setStep] = React.useState(0);
  const [name, setName] = React.useState(CLIENT.company_name);
  const [color, setColor] = React.useState(CLIENT.brand_color);
  const [calendly, setCalendly] = React.useState(CLIENT.calendly_event_url);
  const [threshold, setThreshold] = React.useState(65);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!localStorage.getItem(KEY)) setOpen(true);
  }, []);

  const finish = () => {
    localStorage.setItem(KEY, "1");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && finish()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Welcome — let's set up your workspace</DialogTitle>
          <DialogDescription>Step {step + 1} of 3</DialogDescription>
        </DialogHeader>

        {step === 0 && (
          <div className="space-y-4">
            <div>
              <Label>Company name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label>Logo</Label>
              <div className="mt-1 flex h-24 cursor-pointer items-center justify-center rounded-md border border-dashed border-border bg-muted/30 text-sm text-muted-foreground">
                <Upload className="mr-2 size-4" /> Drop a PNG/SVG or click to upload
              </div>
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
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div>
              <Label>Calendly event URL</Label>
              <Input value={calendly} onChange={(e) => setCalendly(e.target.value)} placeholder="https://calendly.com/..." />
            </div>
            <div>
              <div className="flex items-baseline justify-between">
                <Label>Default hire score threshold</Label>
                <span className="font-mono text-sm">{threshold}</span>
              </div>
              <Slider value={[threshold]} onValueChange={([v]) => setThreshold(v)} min={0} max={100} step={1} className="mt-3" />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-3 text-sm">
            <p>You're all set. Want to create your first job now?</p>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={finish}>Go to dashboard</Button>
              <Button onClick={finish}>Create my first job</Button>
            </div>
          </div>
        )}

        {step < 2 && (
          <div className="mt-2 flex justify-between">
            <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0}>
              Back
            </Button>
            <Button onClick={() => setStep((s) => s + 1)}>Next</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}