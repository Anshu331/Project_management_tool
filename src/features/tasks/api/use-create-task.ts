import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTask } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { json: any };

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const task = createTask({
        name: json.name,
        status: json.status,
        workspaceId: json.workspaceId,
        projectId: json.projectId ?? undefined,
        dueDate: json.dueDate,
        assigneeId: json.assigneeId,
      });
      return { data: task };
    },
    onSuccess: () => {
      toast.success("Task created successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
    },
    onError: () => {
      toast.error("Failed to create task");
    },
  });
  return mutation;
};
