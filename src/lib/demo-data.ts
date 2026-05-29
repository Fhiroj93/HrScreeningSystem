export type Status =
  | "received"
  | "scored"
  | "screening_invited"
  | "screening_complete"
  | "interview_scheduled"
  | "rejected"
  | "screened_out";

export const STATUS_LABEL: Record<Status, string> = {
  received: "Received",
  scored: "Scored",
  screening_invited: "Screening Invited",
  screening_complete: "Screening Complete",
  interview_scheduled: "Interview Scheduled",
  rejected: "Rejected",
  screened_out: "Screened Out",
};

export type Job = {
  id: string;
  title: string;
  jd_text: string;
  jd_summary: string;
  status: "open" | "closed";
  score_threshold: number;
  hire_threshold: number;
  created_at: string;
};

export type ChatMessage = { role: "ai" | "candidate"; text: string; ts: string };

export type Candidate = {
  id: string;
  job_id: string;
  name: string;
  email: string;
  cv_score: number;
  chat_score: number | null;
  final_score: number;
  status: Status;
  created_at: string;
  parsed_data: {
    skills: string[];
    total_years: number;
    gaps: string[];
    red_flags: string[];
    experience: { company: string; title: string; dates: string; summary: string }[];
    education: { school: string; degree: string; dates: string }[];
  };
  cv_evaluation: {
    matched: string[];
    unmet: string[];
    strengths: string[];
    concerns: string[];
  };
  chat_evaluation: {
    communication: string;
    depth: string;
    motivation: string;
    hire_signal: "strong" | "moderate" | "weak";
    note: string;
  } | null;
  chat_transcript: ChatMessage[];
  timeline: { ts: string; label: string }[];
};

export const JOBS: Job[] = [
  {
    id: "j1",
    title: "Senior Frontend Engineer",
    jd_text:
      "We're hiring a senior frontend engineer with 5+ years of experience in React, TypeScript, and modern build tooling. You'll lead our design system and own the candidate-facing portal.",
    jd_summary: "5+ yrs React/TS, design systems, portal ownership",
    status: "open",
    score_threshold: 65,
    hire_threshold: 72,
    created_at: "2026-05-04T09:12:00Z",
  },
  {
    id: "j2",
    title: "Product Designer",
    jd_text:
      "Mid-level product designer with strong systems thinking. Figma, prototyping, and a sharp eye for data-dense UI.",
    jd_summary: "Mid-level, Figma, data-dense UI",
    status: "open",
    score_threshold: 60,
    hire_threshold: 70,
    created_at: "2026-05-11T14:02:00Z",
  },
  {
    id: "j3",
    title: "Backend Engineer (Python)",
    jd_text:
      "Backend engineer with deep Python and Postgres experience. Build the screening pipeline and integrations.",
    jd_summary: "Python, Postgres, pipelines",
    status: "open",
    score_threshold: 65,
    hire_threshold: 70,
    created_at: "2026-04-22T08:00:00Z",
  },
  {
    id: "j4",
    title: "Growth Marketer",
    jd_text: "Performance + lifecycle marketing for B2B SaaS.",
    jd_summary: "B2B SaaS lifecycle + paid",
    status: "closed",
    score_threshold: 60,
    hire_threshold: 68,
    created_at: "2026-03-18T11:30:00Z",
  },
];

const FIRST = ["Priya", "Rahul", "Tom", "Sofia", "Léa", "Daniel", "Aisha", "Marco", "Ines", "Noah", "Chen", "Yuki", "Omar", "Eli", "Hana", "Jordan", "Maya", "Lucas", "Sara", "Theo"];
const LAST = ["Sharma", "Mehta", "Klein", "Rossi", "Dubois", "Adler", "Khan", "Conti", "Silva", "Park", "Wei", "Tanaka", "Hassan", "Cohen", "Sato", "Reyes", "Patel", "Moreau", "Lopez", "Mueller"];

function seeded(i: number) {
  // deterministic pseudo-random
  let x = Math.sin(i * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

function status(i: number, cv: number, chat: number | null): Status {
  if (cv < 40) return "rejected";
  if (chat === null) {
    if (i % 5 === 0) return "received";
    if (i % 5 === 1) return "scored";
    return "screening_invited";
  }
  if (chat < 45) return "screened_out";
  if (chat >= 75 && cv >= 70) return "interview_scheduled";
  return "screening_complete";
}

function makeCandidate(i: number, job: Job): Candidate {
  const f = FIRST[Math.floor(seeded(i) * FIRST.length)];
  const l = LAST[Math.floor(seeded(i + 7) * LAST.length)];
  const cv = Math.round(35 + seeded(i + 1) * 60);
  const hasChat = seeded(i + 2) > 0.35;
  const chat = hasChat ? Math.round(30 + seeded(i + 3) * 65) : null;
  const final = chat !== null ? Math.round(cv * 0.4 + chat * 0.6) : cv;
  const st = status(i, cv, chat);
  const day = 1 + Math.floor(seeded(i + 4) * 27);
  const created = `2026-05-${String(day).padStart(2, "0")}T${String(8 + (i % 10)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}:00Z`;
  return {
    id: `c${job.id}-${i}`,
    job_id: job.id,
    name: `${f} ${l}`,
    email: `${f}.${l}`.toLowerCase() + "@example.com",
    cv_score: cv,
    chat_score: chat,
    final_score: final,
    status: st,
    created_at: created,
    parsed_data: {
      skills: ["React", "TypeScript", "Node.js", "GraphQL", "Postgres", "Figma", "Python", "AWS"].filter((_, k) => seeded(i + k + 11) > 0.4).slice(0, 6),
      total_years: 2 + Math.floor(seeded(i + 12) * 10),
      gaps: seeded(i + 13) > 0.7 ? ["6-month gap in 2023"] : [],
      red_flags: seeded(i + 14) > 0.85 ? ["Short tenure at last 2 roles"] : [],
      experience: [
        { company: "Acme Corp", title: "Senior Engineer", dates: "2022 – Present", summary: "Led the design system rewrite and migrated 40+ surfaces." },
        { company: "Northwind", title: "Engineer", dates: "2019 – 2022", summary: "Built the customer-facing dashboard and shipped real-time analytics." },
      ],
      education: [{ school: "TU Berlin", degree: "B.Sc. Computer Science", dates: "2015 – 2019" }],
    },
    cv_evaluation: {
      matched: ["React 5+ yrs", "TypeScript", "Design systems"],
      unmet: cv < 70 ? ["No SSR experience", "Limited testing footprint"] : ["No SSR experience"],
      strengths: ["Strong systems thinking", "Shipped 0→1 products"],
      concerns: cv < 60 ? ["Tenure under 18 months", "No mentorship signal"] : ["No mentorship signal"],
    },
    chat_evaluation: chat
      ? {
          communication: chat > 70 ? "Clear, structured, concise." : "Adequate, occasionally verbose.",
          depth: chat > 70 ? "Strong examples with metrics." : "Surface-level, few specifics.",
          motivation: chat > 60 ? "Genuinely curious about the role." : "Transactional.",
          hire_signal: chat > 75 ? "strong" : chat > 55 ? "moderate" : "weak",
          note: chat > 75 ? "Recommend fast-track to onsite." : "Worth a screen with the hiring manager.",
        }
      : null,
    chat_transcript: hasChat
      ? [
          { role: "ai", text: "Hi! Thanks for applying. Ready for a few quick questions?", ts: "10:02" },
          { role: "candidate", text: "Yes, happy to start.", ts: "10:03" },
          { role: "ai", text: "Tell me about a time you led a complex frontend migration.", ts: "10:03" },
          { role: "candidate", text: "At Acme we migrated 40+ surfaces to a new design system over two quarters. I owned the rollout plan and the codemods.", ts: "10:05" },
          { role: "ai", text: "What was the hardest tradeoff?", ts: "10:06" },
          { role: "candidate", text: "Visual parity vs. velocity — we shipped 80% pixel-perfect and accepted 20% drift for speed.", ts: "10:07" },
          { role: "ai", text: "Great, thanks! We'll be in touch shortly.", ts: "10:10" },
        ]
      : [],
    timeline: [
      { ts: created, label: "Application received" },
      { ts: created, label: `CV scored ${cv}/100` },
      ...(hasChat
        ? [
            { ts: created, label: "Invited to screening" },
            { ts: created, label: `Screening complete — ${chat}/100` },
          ]
        : []),
      ...(st === "interview_scheduled" ? [{ ts: created, label: "Interview scheduled via Calendly" }] : []),
      ...(st === "rejected" ? [{ ts: created, label: "Rejected (below threshold)" }] : []),
    ],
  };
}

export const CANDIDATES: Candidate[] = JOBS.flatMap((j, ji) =>
  Array.from({ length: ji === 0 ? 18 : ji === 1 ? 12 : ji === 2 ? 9 : 6 }, (_, i) => makeCandidate(ji * 100 + i, j)),
);

export function jobById(id: string) {
  return JOBS.find((j) => j.id === id);
}
export function candidatesByJob(id: string) {
  return CANDIDATES.filter((c) => c.job_id === id);
}

export const CLIENT = {
  company_name: "Northbeam Talent",
  brand_color: "#6366f1",
  logo_url: "",
  calendly_event_url: "https://calendly.com/northbeam/interview",
  hire_threshold: 70,
  cv_weight: 40,
  chat_weight: 60,
};

export type ActivityEvent = {
  id: string;
  ts: string;
  text: string;
  kind: "scored" | "screened" | "interview" | "received" | "rejected";
};

export const ACTIVITY: ActivityEvent[] = [
  { id: "a1", ts: "2m ago", text: "Priya Sharma scored 78 on Senior Frontend Engineer", kind: "scored" },
  { id: "a2", ts: "11m ago", text: "Rahul Mehta completed screening — 82/100", kind: "screened" },
  { id: "a3", ts: "24m ago", text: "Tom Klein scheduled an interview", kind: "interview" },
  { id: "a4", ts: "1h ago", text: "Sofia Rossi applied to Product Designer", kind: "received" },
  { id: "a5", ts: "2h ago", text: "Léa Dubois was screened out (47/100)", kind: "rejected" },
  { id: "a6", ts: "3h ago", text: "Daniel Adler scored 71 on Backend Engineer", kind: "scored" },
  { id: "a7", ts: "5h ago", text: "Aisha Khan completed screening — 69/100", kind: "screened" },
  { id: "a8", ts: "yesterday", text: "Marco Conti scheduled an interview", kind: "interview" },
];