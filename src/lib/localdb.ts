import { GUEST_WORKSPACE_ID } from "@/lib/guest";
import { TaskStatus } from "@/features/tasks/types";

type DocBase = {
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
};

export type ListResponse<T> = {
  total: number;
  documents: T[];
};

type WorkspaceDoc = DocBase & {
  name: string;
  imageUrl: string;
  inviteCode: string;
};

type ProjectDoc = DocBase & {
  workspaceId: string;
  name: string;
  imageUrl: string;
};

type MemberDoc = DocBase & {
  workspaceId: string;
  userid: string;
  role: "ADMIN" | "MEMBER";
  name: string;
  email: string;
};

type TaskDoc = DocBase & {
  workspaceId: string;
  projectId?: string;
  name: string;
  status: TaskStatus;
  assigneeId: string;
  dueDate: string;
  description?: string;
  position: number;
};

type DbShape = {
  version: 1;
  workspaces: Record<string, WorkspaceDoc>;
  projects: Record<string, ProjectDoc>;
  members: Record<string, MemberDoc>;
  tasks: Record<string, TaskDoc>;
};

const STORAGE_KEY = "ProjectManagementTool.db.v1";
const LOCAL_DATABASE_ID = "local";
const COLLECTIONS = {
  workspaces: "workspaces",
  projects: "projects",
  members: "members",
  tasks: "tasks",
} as const;

function nowIso() {
  return new Date().toISOString();
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

function safeParse<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function ensureSeed(db: DbShape): DbShape {
  if (!db.workspaces[GUEST_WORKSPACE_ID]) {
    const t = nowIso();
    db.workspaces[GUEST_WORKSPACE_ID] = {
      $id: GUEST_WORKSPACE_ID,
      $createdAt: t,
      $updatedAt: t,
      $collectionId: COLLECTIONS.workspaces,
      $databaseId: LOCAL_DATABASE_ID,
      $permissions: [],
      name: "Workspace",
      imageUrl: "",
      inviteCode: "GUEST",
    };
  } else if (db.workspaces[GUEST_WORKSPACE_ID].name === "Guest Workspace") {
    db.workspaces[GUEST_WORKSPACE_ID] = {
      ...db.workspaces[GUEST_WORKSPACE_ID],
      name: "Workspace",
      $updatedAt: nowIso(),
    };
  }

  // Ensure a single "guest" member exists in the guest workspace
  const guestMemberId = `member_${GUEST_WORKSPACE_ID}`;
  if (!db.members[guestMemberId]) {
    const t = nowIso();
    db.members[guestMemberId] = {
      $id: guestMemberId,
      $createdAt: t,
      $updatedAt: t,
      $collectionId: COLLECTIONS.members,
      $databaseId: LOCAL_DATABASE_ID,
      $permissions: [],
      workspaceId: GUEST_WORKSPACE_ID,
      userid: "guest",
      role: "ADMIN",
      name: "Guest",
      email: "guest@local",
    };
  }

  return db;
}

export function getDb(): DbShape {
  if (typeof window === "undefined") {
    // Server-side: return an empty seeded db (no localStorage access)
    return ensureSeed({
      version: 1,
      workspaces: {},
      projects: {},
      members: {},
      tasks: {},
    });
  }
  const parsed = safeParse<DbShape>(window.localStorage.getItem(STORAGE_KEY));
  const db =
    parsed && parsed.version === 1
      ? parsed
      : ({ version: 1, workspaces: {}, projects: {}, members: {}, tasks: {} } as DbShape);
  return ensureSeed(db);
}

export function setDb(next: DbShape) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
}

export function listWorkspaces(): ListResponse<WorkspaceDoc> {
  const db = getDb();
  const docs = Object.values(db.workspaces).sort((a, b) =>
    b.$createdAt.localeCompare(a.$createdAt)
  );
  return { total: docs.length, documents: docs };
}

export function createWorkspace(input: {
  name: string;
  imageUrl?: string;
}): WorkspaceDoc {
  const db = getDb();
  const t = nowIso();
  const id = randomId("ws");
  const workspace: WorkspaceDoc = {
    $id: id,
    $createdAt: t,
    $updatedAt: t,
    $collectionId: COLLECTIONS.workspaces,
    $databaseId: LOCAL_DATABASE_ID,
    $permissions: [],
    name: input.name,
    imageUrl: input.imageUrl ?? "",
    inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
  };
  db.workspaces[id] = workspace;

  const memberId = randomId("member");
  db.members[memberId] = {
    $id: memberId,
    $createdAt: t,
    $updatedAt: t,
    $collectionId: COLLECTIONS.members,
    $databaseId: LOCAL_DATABASE_ID,
    $permissions: [],
    workspaceId: id,
    userid: "guest",
    role: "ADMIN",
    name: "Guest",
    email: "guest@local",
  };

  setDb(db);
  return workspace;
}

export function getWorkspace(workspaceId: string): WorkspaceDoc | null {
  const db = getDb();
  return db.workspaces[workspaceId] ?? null;
}

export function updateWorkspace(
  workspaceId: string,
  patch: Partial<Pick<WorkspaceDoc, "name" | "imageUrl" | "inviteCode">>
): WorkspaceDoc | null {
  const db = getDb();
  const existing = db.workspaces[workspaceId];
  if (!existing) return null;
  const updated: WorkspaceDoc = {
    ...existing,
    ...patch,
    $updatedAt: nowIso(),
  };
  db.workspaces[workspaceId] = updated;
  setDb(db);
  return updated;
}

export function deleteWorkspace(workspaceId: string): { $id: string } {
  const db = getDb();
  delete db.workspaces[workspaceId];
  Object.keys(db.projects).forEach((id) => {
    if (db.projects[id].workspaceId === workspaceId) delete db.projects[id];
  });
  Object.keys(db.members).forEach((id) => {
    if (db.members[id].workspaceId === workspaceId) delete db.members[id];
  });
  Object.keys(db.tasks).forEach((id) => {
    if (db.tasks[id].workspaceId === workspaceId) delete db.tasks[id];
  });
  setDb(db);
  return { $id: workspaceId };
}

export function listMembers(workspaceId: string): ListResponse<MemberDoc> {
  const db = getDb();
  const docs = Object.values(db.members).filter(
    (m) => m.workspaceId === workspaceId
  );
  return { total: docs.length, documents: docs };
}

export function updateMember(
  memberId: string,
  patch: Partial<Pick<MemberDoc, "role" | "name" | "email">>
): MemberDoc | null {
  const db = getDb();
  const existing = db.members[memberId];
  if (!existing) return null;
  const updated: MemberDoc = { ...existing, ...patch, $updatedAt: nowIso() };
  db.members[memberId] = updated;
  setDb(db);
  return updated;
}

export function deleteMember(memberId: string): { $id: string } {
  const db = getDb();
  delete db.members[memberId];
  setDb(db);
  return { $id: memberId };
}

export function listProjects(workspaceId: string): ListResponse<ProjectDoc> {
  const db = getDb();
  const docs = Object.values(db.projects)
    .filter((p) => p.workspaceId === workspaceId)
    .sort((a, b) => b.$createdAt.localeCompare(a.$createdAt));
  return { total: docs.length, documents: docs };
}

export function createProject(input: {
  workspaceId: string;
  name: string;
  imageUrl?: string;
}): ProjectDoc {
  const db = getDb();
  const t = nowIso();
  const id = randomId("prj");
  const project: ProjectDoc = {
    $id: id,
    $createdAt: t,
    $updatedAt: t,
    $collectionId: COLLECTIONS.projects,
    $databaseId: LOCAL_DATABASE_ID,
    $permissions: [],
    workspaceId: input.workspaceId,
    name: input.name,
    imageUrl: input.imageUrl ?? "",
  };
  db.projects[id] = project;
  setDb(db);
  return project;
}

export function getProject(projectId: string): ProjectDoc | null {
  const db = getDb();
  return db.projects[projectId] ?? null;
}

export function updateProject(
  projectId: string,
  patch: Partial<Pick<ProjectDoc, "name" | "imageUrl">>
): ProjectDoc | null {
  const db = getDb();
  const existing = db.projects[projectId];
  if (!existing) return null;
  const updated: ProjectDoc = { ...existing, ...patch, $updatedAt: nowIso() };
  db.projects[projectId] = updated;
  setDb(db);
  return updated;
}

export function deleteProject(projectId: string): { $id: string } {
  const db = getDb();
  delete db.projects[projectId];
  Object.keys(db.tasks).forEach((id) => {
    if (db.tasks[id].projectId === projectId) delete db.tasks[id];
  });
  setDb(db);
  return { $id: projectId };
}

export function listTasks(input: {
  workspaceId: string;
  projectId?: string;
  status?: TaskStatus;
  assigneeId?: string;
  dueDate?: string;
  search?: string;
}): ListResponse<any> {
  const db = getDb();
  let docs = Object.values(db.tasks).filter(
    (t) => t.workspaceId === input.workspaceId
  );
  if (input.projectId) docs = docs.filter((t) => t.projectId === input.projectId);
  if (input.status) docs = docs.filter((t) => t.status === input.status);
  if (input.assigneeId) docs = docs.filter((t) => t.assigneeId === input.assigneeId);
  if (input.dueDate) docs = docs.filter((t) => t.dueDate === input.dueDate);
  if (input.search)
    docs = docs.filter((t) =>
      t.name.toLowerCase().includes(input.search!.toLowerCase())
    );

  docs.sort((a, b) => b.$createdAt.localeCompare(a.$createdAt));

  const populated = docs.map((task) => {
    const project = task.projectId ? db.projects[task.projectId] : undefined;
    const assignee = db.members[task.assigneeId];
    return { ...task, project, assignee };
  });

  return { total: populated.length, documents: populated };
}

export function createTask(input: Omit<TaskDoc, keyof DocBase | "position"> & {
  position?: number;
}): TaskDoc {
  const db = getDb();
  const t = nowIso();
  const id = randomId("task");

  const existingInColumn = Object.values(db.tasks)
    .filter((x) => x.workspaceId === input.workspaceId && x.status === input.status)
    .sort((a, b) => b.position - a.position);

  const position =
    typeof input.position === "number"
      ? input.position
      : existingInColumn.length > 0
        ? existingInColumn[0].position + 1000
        : 1000;

  const task: TaskDoc = {
    $id: id,
    $createdAt: t,
    $updatedAt: t,
    $collectionId: COLLECTIONS.tasks,
    $databaseId: LOCAL_DATABASE_ID,
    $permissions: [],
    workspaceId: input.workspaceId,
    projectId: input.projectId,
    name: input.name,
    status: input.status,
    assigneeId: input.assigneeId,
    dueDate: input.dueDate,
    description: input.description,
    position,
  };
  db.tasks[id] = task;
  setDb(db);
  return task;
}

export function updateTask(
  taskId: string,
  patch: Partial<Omit<TaskDoc, keyof DocBase | "workspaceId">>
): TaskDoc | null {
  const db = getDb();
  const existing = db.tasks[taskId];
  if (!existing) return null;
  const updated: TaskDoc = {
    ...existing,
    ...patch,
    $updatedAt: nowIso(),
  };
  db.tasks[taskId] = updated;
  setDb(db);
  return updated;
}

export function deleteTask(taskId: string): { $id: string } {
  const db = getDb();
  delete db.tasks[taskId];
  setDb(db);
  return { $id: taskId };
}

export function getTask(taskId: string): any | null {
  const db = getDb();
  const task = db.tasks[taskId];
  if (!task) return null;
  const project = task.projectId ? db.projects[task.projectId] : null;
  const assignee = db.members[task.assigneeId] ?? null;
  return { ...task, project, assignee };
}

export function bulkUpdateTasks(tasks: Array<{ $id: string; status: TaskStatus; position: number }>) {
  const db = getDb();
  tasks.forEach((t) => {
    const existing = db.tasks[t.$id];
    if (!existing) return;
    db.tasks[t.$id] = {
      ...existing,
      status: t.status,
      position: t.position,
      $updatedAt: nowIso(),
    };
  });
  setDb(db);
  return tasks.map((t) => db.tasks[t.$id]).filter(Boolean);
}

function buildAnalyticsFromTasks(tasks: TaskDoc[], guestMemberIds: Set<string>) {
  const now = new Date();
  const taskCount = tasks.length;
  const completeTaskCount = tasks.filter((t) => t.status === TaskStatus.DONE).length;
  const incompleteTaskCount = tasks.filter((t) => t.status !== TaskStatus.DONE).length;
  const overdueTaskCount = tasks.filter(
    (t) => t.status !== TaskStatus.DONE && new Date(t.dueDate) < now
  ).length;
  const assignedTaskCount = tasks.filter((t) => guestMemberIds.has(t.assigneeId)).length;

  return {
    taskCount,
    taskDifference: 0,
    assignedTaskCount,
    assignedTaskDifference: 0,
    incompleteTaskCount,
    incompleteTaskDifference: 0,
    completeTaskCount,
    completeTaskDifference: 0,
    overdueTaskCount,
    overdueTaskDifference: 0,
  };
}

export function workspaceAnalytics(workspaceId: string) {
  const db = getDb();
  const tasks = Object.values(db.tasks).filter((t) => t.workspaceId === workspaceId);
  const guestMemberIds = new Set(
    Object.values(db.members)
      .filter((m) => m.workspaceId === workspaceId && m.userid === "guest")
      .map((m) => m.$id)
  );
  return buildAnalyticsFromTasks(tasks, guestMemberIds);
}

export function projectAnalytics(projectId: string) {
  const db = getDb();
  const tasks = Object.values(db.tasks).filter((t) => t.projectId === projectId);
  const guestMemberIds = new Set(
    Object.values(db.members).filter((m) => m.userid === "guest").map((m) => m.$id)
  );
  return buildAnalyticsFromTasks(tasks, guestMemberIds);
}

