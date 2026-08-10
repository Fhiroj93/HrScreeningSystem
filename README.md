# HR System

Here's your complete Lovable prompt — copy and paste this entire thing:

Build a full-stack AI Candidate Screening Platform dashboard. This is a white-label SaaS product used by recruiters. Use Supabase for auth + database + real-time. Make it production-grade, visually premium, and complete — no placeholder screens. Both dark and white theme options with a just button to switch onntop

BRAND & VISUAL DIRECTION

Dark theme only. Design language: sharp, data-dense, professional — like Linear meets Greenhouse. Use a deep navy/charcoal base (#0a0f1e background), indigo/violet as primary accent (#6366f1), with emerald for positive signals, rose for rejections, amber for pending. Typography: DM Sans for UI, DM Mono for scores/codes/data. No gradients on backgrounds — reserve gradients for accent highlights only. Every screen must feel complete and "ready to ship."

AUTH & ONBOARDING

Supabase Auth — email/password login

On first login, show a one-time Client Setup Wizard (3 steps):

Step 1: Company name, logo upload, brand color picker

Step 2: Calendly event URL input, default hire score threshold (slider, default 65)

Step 3: "Create your first job" shortcut or "Go to dashboard"

After setup, never show wizard again (store onboarding_complete flag)

SIDEBAR NAVIGATION

Fixed left sidebar, 240px wide. Logo + client brand name at top. Nav items with icons:

Dashboard (home/overview)

Jobs (all open roles)

Candidates (global across all jobs)

Screening (chat transcripts)

Settings

Bottom of sidebar: user avatar, email, logout button.

SCREEN 1 — DASHBOARD (Home)

Top stat bar with 4 cards:

Total Candidates (this month)

Avg CV Score (across all active jobs)

Screening Completion Rate (%)

Interviews Scheduled (this month)

Below stats: two columns:

Left: "Recent Activity" feed — real-time list of latest candidate events (e.g. "Priya S. scored 78 on Frontend Engineer", "Rahul M. completed screening", "Tom K. interview scheduled") with timestamps and colored status dots

Right: "Top Candidates This Week" — top 5 by final_score across all jobs, with name, job title, score badge, and a "View" button

Below: a horizontal bar chart — "Candidate Pipeline by Stage" — showing counts per status: Received / Scored / Invited to Screen / Screened / Interview Scheduled / Rejected. Use Recharts.

SCREEN 2 — JOBS

Table view of all jobs. Columns: Job Title, Date Created, # Applicants, Avg Score, # Scheduled, Status (Open/Closed), Actions.

Top-right: "+ New Job" button → opens a right-side drawer (not a modal) with:

Job title input

Job Description textarea (large, with character count)

Score threshold slider (0–100, default 65)

Hire threshold slider (0–100, default 70)

"Create Job" button → saves to Supabase jobs table

Each job row is clickable → navigates to Job Detail page

Job Detail Page:

Header: job title, created date, status toggle (Open/Closed), Edit button

Tab bar: Overview | Candidates | Settings

Overview tab: same pipeline bar chart scoped to this job + top 5 candidates

Candidates tab: (see Candidates screen, filtered to this job)

Settings tab: edit JD, thresholds, Calendly URL override for this job

SCREEN 3 — CANDIDATES

Full candidate table with these columns:

Name

Job Applied

CV Score (colored badge: green ≥70, amber 50–69, rose <50)

Chat Score (same coloring, shows "—" if not yet screened)

Final Score (bold, same coloring)

Status (pill badge with color: Received / Scored / Screening Invited / Screening Complete / Interview Scheduled / Rejected / Screened Out)

Applied Date

Actions: "View" button

Filtering bar above table:

Search by name or email

Filter by Job (dropdown)

Filter by Status (multi-select dropdown)

Filter by Score range (slider: 0–100)

"Export CSV" button — exports visible filtered results

Candidate Detail Drawer (slides in from right, don't navigate away):

Header: name, email, applied job, final score badge, status pill

Tabs: Profile | Screening Chat | Evaluation | Timeline

Profile tab: parsed resume data — skills (tags), experience list (company, title, dates, summary), education, total years, employment gaps, red flags

Screening Chat tab: full chat transcript rendered as a real chat UI (candidate messages left, AI messages right, timestamps)

Evaluation tab: two side-by-side cards — CV Evaluation (cv_score, matched requirements, unmet requirements, strengths, concerns) and Chat Evaluation (chat_score, communication quality, answer depth, motivation signal, hire signal, recruiter note). At bottom: final score calculation shown as a formula: CV (weight 40%) + Chat (weight 60%) = Final Score

Timeline tab: vertical event log — every status change with timestamp and description

SCREEN 4 — SCREENING

List of all candidates currently in or completed screening (status = screening_invited / screening_complete).

Two tabs: In Progress | Completed

Each row shows: name, job, chat started time, # messages exchanged, status

Clicking a row opens the same Candidate Detail Drawer (pre-opened on Screening Chat tab).

SCREEN 5 — SETTINGS

Three sub-sections (tab nav within page):

Branding:

Logo upload (preview shown live)

Company name

Brand color picker

Preview card showing how the candidate-facing portal will look

Integrations:

Calendly Event URL input + "Test Link" button

Resend API Key input (masked) + "Test Email" button with status indicator

n8n Webhook Base URL input (masked)

Each integration shows a green "Connected" or red "Not configured" status badge

Scoring:

Default CV score threshold (slider + number input)

Default hire threshold (slider + number input)

CV weight % and Chat weight % (two sliders that must sum to 100, linked)

Save button

REAL-TIME BEHAVIOR

Use Supabase Realtime subscriptions on the candidates table. When a candidate's status or score changes:

Dashboard activity feed updates instantly (no refresh)

Candidate table row updates in place

Status pill animates (brief pulse effect)

Dashboard stat cards update counts

SUPABASE SCHEMA

Create these tables exactly:

clients: id (uuid PK), company_name (text), brand_color (text), logo_url (text), calendly_event_url (text), hire_threshold (int default 65), onboarding_complete (bool default false), created_at (timestamptz)

jobs: id (uuid PK), client_id (uuid FK), title (text), jd_text (text), jd_summary (text), score_threshold (int), hire_threshold (int), status (text default 'open'), created_at (timestamptz)

candidates: id (uuid PK), job_id (uuid FK), token (uuid), name (text), email (text), resume_url (text), parsed_data (jsonb), cv_score (int), cv_reasoning (jsonb), chat_transcript (jsonb), chat_score (int), chat_evaluation (jsonb), final_score (int), status (text), calendly_link (text), created_at (timestamptz)

Enable Row Level Security on all tables. Policy: users can only access rows where client_id matches their auth.uid().

EMPTY STATES

Every table/list must have a designed empty state (not a blank screen):

Jobs empty: icon + "No jobs yet. Create your first role to start screening candidates." + CTA button

Candidates empty: icon + "No candidates yet. Share your job link to start receiving applications."

Activity feed empty: "All quiet — candidates will appear here as they apply."

NOTIFICATIONS (in-app)

Toast notifications (top-right, auto-dismiss 4s) for:

New candidate received

Candidate completed screening

Interview scheduled

ADDITIONAL REQUIREMENTS

All tables must be sortable by clicking column headers

Pagination on all tables (25 rows per page)

Responsive down to 1280px width minimum (this is a desktop app, not mobile)

All drawers must close on ESC key and clicking outside

Use Recharts for all charts

Use Shadcn/ui as component base

No mock data hardcoded — all data from Supabase

Loading skeletons (not spinners) for all data-fetch states

All scores displayed as XX / 100 format with a thin progress bar underneath

----------
ignore the complete backend, dont implement it now , just focus on the complete frontend with demo data without missing anything memtioned, it hsould b ein both dark and whie theme, high professional

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://screening-shine-app.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b0665f6c-61af-448e-8d21-332d7c1d9255).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
