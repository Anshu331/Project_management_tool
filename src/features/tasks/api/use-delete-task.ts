import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTask } from "@/lib/localdb";

type ResponseType = { data: { $id: string } };
type RequestType = { param: { taskId: string } };

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      return { data: deleteTask(param.taskId) };
    },
    onSuccess: ({ data }) => {
      toast.success("Task deleted successfully");
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
        queryKey: ["tasks", ["task", data.$id]],
      });
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
  return mutation;
};
