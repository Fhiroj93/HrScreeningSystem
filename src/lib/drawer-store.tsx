import * as React from "react";
import type { Candidate } from "./demo-data";

type Tab = "profile" | "chat" | "evaluation" | "timeline";
type Ctx = {
  open: boolean;
  candidate: Candidate | null;
  tab: Tab;
  show: (c: Candidate, tab?: Tab) => void;
  close: () => void;
  setTab: (t: Tab) => void;
};
const C = React.createContext<Ctx | null>(null);

export function DrawerProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [candidate, setCandidate] = React.useState<Candidate | null>(null);
  const [tab, setTab] = React.useState<Tab>("profile");
  return (
    <C.Provider
      value={{
        open,
        candidate,
        tab,
        show: (c, t = "profile") => {
          setCandidate(c);
          setTab(t);
          setOpen(true);
        },
        close: () => setOpen(false),
        setTab,
      }}
    >
      {children}
    </C.Provider>
  );
}

export function useDrawer() {
  const v = React.useContext(C);
  if (!v) throw new Error("useDrawer outside provider");
  return v;
}