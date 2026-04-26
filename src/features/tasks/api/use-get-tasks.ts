import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";
import { listTasks } from "@/lib/localdb";

interface useGetTasksProps {
  workspaceId: string;
  projectId?: string | undefined | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: useGetTasksProps) => {
  return useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search,
    ],
    queryFn: async () => {
      return listTasks({
        workspaceId,
        projectId: projectId ?? undefined,
        status: status ?? undefined,
        assigneeId: assigneeId ?? undefined,
        dueDate: dueDate ?? undefined,
        search: search ?? undefined,
      });
    },
  });
};
