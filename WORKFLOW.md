# ProjectManagementTool - Implementation Workflow

This document explains how the prototype is implemented end-to-end, from routing to data handling to UI behavior.

## 1) High-Level Architecture

The application uses a feature-first structure on top of Next.js App Router.

- **UI Layer**: React components inside `src/app` and `src/features/*/components`
- **State + Data Fetching**: TanStack Query hooks in `src/features/*/api`
- **Server/API Layer**: Hono routes in `src/features/*/server/route.ts`, mounted via `src/app/api/[[...route]]/route.ts`
- **Data Layer**:
  - Local prototype DB (`src/lib/localdb.ts`) for seeded offline-friendly behavior
  - Appwrite-compatible shapes/types for backend compatibility

## 2) Project Structure Responsibility Map

- `src/app/`
  - Route entrypoints and page composition (dashboard, standalone flows, auth redirects)
- `src/features/auth/`
  - Auth schemas, APIs, and server route handlers
- `src/features/workspaces/`
  - Workspace listing, create/edit/delete, member access boundaries
- `src/features/projects/`
  - Project create/read/update/delete and project analytics
- `src/features/tasks/`
  - Task CRUD, status movement, board/calendar/table views, analytics inputs
- `src/features/members/`
  - Team member listing and role management
- `src/lib/localdb.ts`
  - Local document store, seed data, list/create/update/delete helpers
- `src/types/document.ts`
  - Shared Appwrite-compatible document metadata contract

## 3) Runtime Request/Data Flow

Typical flow used across features:

1. User interacts with a page/component in `src/app/...`.
2. Component calls a feature hook from `src/features/*/api/use-*.ts`.
3. Hook runs query/mutation via TanStack Query.
4. Hook reaches:
   - local data helper (`src/lib/localdb.ts`) for this prototype mode, or
   - server endpoints (Hono) where configured.
5. Returned data updates query cache.
6. UI re-renders with latest state.

This keeps UI logic clean and moves data concerns into feature APIs.

## 4) Core Feature Workflow

## 4.1 Workspace Workflow

1. App opens `src/app/(dashboard)/page.tsx`.
2. `getWorkspaces()` fetches available workspaces.
3. If none exist, user is redirected to `/workspaces/create`.
4. On create:
   - workspace document is added
   - default member record is created for owner context
5. User is redirected to `/workspaces/[workspaceId]`.

## 4.2 Project Workflow

1. In workspace dashboard, project list is fetched with `useGetProjects`.
2. Create Project modal submits name/image.
3. `createProject()` writes to local document store.
4. Query invalidates and project list refreshes.
5. User can open project page and project settings page for updates.

## 4.3 Task Workflow

1. Workspace/project task views fetch tasks with filters:
   - by workspace
   - optional project
   - optional status/assignee/date/search
2. Create Task modal captures:
   - task name
   - assignee
   - status
   - due date
   - optional description/project
3. `createTask()` computes position for ordering in status columns.
4. Board interactions (drag/drop) trigger bulk updates to status/position.
5. Views (list/board/calendar) consume the same task source with different UI renderers.

## 4.4 Member Workflow

1. Members are fetched per workspace.
2. Member list is shown in dashboard and member management screen.
3. Role/name/email updates are persisted through member update handlers.
4. Task assignee mapping uses member IDs to resolve ownership in UI.

## 5) Analytics Workflow

Analytics are computed from task data:

- total tasks
- incomplete tasks
- complete tasks
- overdue tasks
- assigned tasks

Computation is derived in `src/lib/localdb.ts` (`workspaceAnalytics`, `projectAnalytics`) and consumed in dashboard analytics cards.

## 6) Type System Workflow

To keep local and backend documents compatible:

- Shared document base type lives in `src/types/document.ts`
- Feature models (`Task`, `Project`, `Member`, `Workspace`) extend this base
- Local DB records include required metadata keys:
  - `$id`
  - `$createdAt`
  - `$updatedAt`
  - `$permissions`
  - `$databaseId`
  - `$collectionId`

This prevents runtime/type drift between prototype data and Appwrite-style contracts.

## 7) Why This Implementation Strategy

- Keeps MVP development fast (local-first data path)
- Preserves backend compatibility for future Appwrite migration
- Uses feature boundaries to avoid monolithic components
- Supports incremental upgrades (notifications, comments, activity logs) without redesigning base architecture

## 8) End-to-End User Journey (Daily Use)

1. Open app -> enter workspace.
2. Create or select project.
3. Add tasks, assign owners, set due dates.
4. Move tasks through status columns during execution.
5. Check analytics for overdue/incomplete risk.
6. Update members/projects as team/client context changes.

## 9) Build and Verification Workflow

Local verification sequence:

```bash
npm install
npm run dev
npm run build
```

- `npm run dev`: interactive local development
- `npm run build`: production compile + type safety validation

## 10) Extension Roadmap (Post-MVP)

Planned natural extensions on top of current architecture:

1. Comments/activity timeline on tasks
2. Reminder notifications for due dates
3. Saved views and advanced filtering
4. File attachments
5. Rich permissions and audit trails

These can be added as isolated feature modules with minimal disruption to existing flows.
