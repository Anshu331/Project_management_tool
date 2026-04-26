# ProjectManagementTool

Prototype submission for Meraki take-home: a practical project management workspace for a small team (3-5 people) to track projects, tasks, ownership, and progress in one place.

## Problem Framing

The current workflow is split across WhatsApp, spreadsheets, and memory. That creates three costly problems:

1. **No single source of truth** - tasks, deadlines, and ownership are scattered.
2. **Low accountability** - it is hard to answer "who owns this, and what is blocked?"
3. **Poor planning visibility** - managers cannot quickly see overdue/incomplete work.

The first problem to solve is **operational clarity**: one shared place where the team can create work, assign ownership, and track status day to day.

## MVP Definition

The MVP is intentionally small but usable on Monday morning.

### Core user flow

1. Create or open a workspace.
2. Create projects inside that workspace.
3. Create tasks with assignee, status, due date, and project.
4. Track work from task views and analytics.
5. Manage team members for responsibility and coordination.

### Core features included

- Workspace creation and switching
- Project management (create, view, edit)
- Task management (create, update, status workflow, due dates)
- Member management (team list and role usage)
- Dashboard analytics (incomplete, complete, overdue, assigned, total)

## Why These Features First

These features were prioritized because they create immediate daily value with minimum complexity:

- **Workspaces + projects** provide structure for client/internal work.
- **Tasks with status + due date + assignee** create execution clarity.
- **Members** connect tasks to real ownership.
- **Analytics** gives leadership quick health checks without manual reporting.

This set is the smallest combination that supports planning, execution, and review in one tool.

## Out of Scope (Deliberate)

The following were intentionally excluded from this prototype:

- Advanced authentication flows and account lifecycle management
- Notifications (email, push, Slack/WhatsApp integrations)
- Time tracking, billing, and invoicing
- Attachments/comments history and rich collaboration threads
- Granular permissions matrix beyond lightweight role handling
- Audit logs, exports, and enterprise-grade compliance features
- Marketing website/landing pages

Reason: these add complexity but are not required to validate core product usefulness for a small team.

## Trade-offs and Assumptions

### Trade-offs

- Prioritized **shipping a reliable core workflow** over broad feature breadth.
- Chose simple, fast UI interactions over highly customized edge-case logic.
- Focused on day-to-day task/project operation rather than long-term reporting depth.

### Assumptions

- Team size is small (3-5 users) and collaborative.
- Most work can be represented as project-linked tasks with simple status progression.
- Quick visibility beats deep configuration in the first version.
- A clean, responsive web app is sufficient for initial adoption.

## If I Had 1 More Week

Given one additional week, I would focus on high-impact improvements:

1. **In-app comments + activity timeline** per task for collaboration context.
2. **Automated reminders** for overdue and upcoming due dates.
3. **Saved filters/views** (by assignee, client, deadline window).
4. **Basic file attachments** on tasks and projects.
5. **Deployment hardening + demo data seed** for smoother evaluation.
6. **Focused usability polish** (empty states, keyboard shortcuts, onboarding hints).

## Tech Snapshot

- Next.js (App Router), React, TypeScript
- Hono-based API routing
- TanStack Query for server state
- Tailwind + shadcn UI components
- Drag-and-drop task interactions

## File Structure

```text
ProjectManagementTool/
├─ public/                         # Static assets
├─ src/
│  ├─ app/                         # Next.js app router pages/layouts
│  │  ├─ (dashboard)/              # Main product experience
│  │  ├─ (standalone)/             # Workspace settings/create/member flows
│  │  ├─ (auth)/                   # Auth routes (currently de-prioritized)
│  │  ├─ api/[[...route]]/         # Hono route entrypoint
│  │  └─ oauth/                    # OAuth callback route
│  ├─ components/                  # Shared UI components
│  ├─ config.ts                    # Appwrite/env config constants
│  ├─ features/
│  │  ├─ auth/                     # Auth APIs/components/schemas
│  │  ├─ workspaces/               # Workspace APIs, routes, and types
│  │  ├─ projects/                 # Project APIs, routes, and types
│  │  ├─ tasks/                    # Task APIs, routes, and Kanban/calendar UI
│  │  └─ members/                  # Member APIs, routes, and types
│  ├─ lib/                         # Utilities, local DB, middleware helpers
│  └─ types/                       # Shared TypeScript types
├─ package.json
├─ tailwind.config.ts
├─ tsconfig.json
└─ README.md
```

## Run Locally

```bash
npm install
npm run dev
```

Build check:

```bash
npm run build
```
