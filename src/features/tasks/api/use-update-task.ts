import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTask } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { json: any; param: { taskId: string } };

export const useUpdateTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      const patch: Record<string, unknown> = {};
      if (json.name !== undefined) patch.name = json.name;
      if (json.status !== undefined) patch.status = json.status;
      if (json.description !== undefined) patch.description = json.description;
      if (json.projectId !== undefined) patch.projectId = json.projectId;
      if (json.dueDate !== undefined) patch.dueDate = json.dueDate;
      if (json.assigneeId !== undefined) patch.assigneeId = json.assigneeId;

      const updated = updateTask(param.taskId, {
        ...patch,
      });
      if (!updated) throw new Error("Task not found");
      return { data: updated };
    },
    onSuccess: ({ data }) => {
      toast.success("Task updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["project-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["tasks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
  return mutation;
};
