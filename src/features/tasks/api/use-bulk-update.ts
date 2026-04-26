import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { bulkUpdateTasks } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { json: { tasks: Array<{ $id: string; status: any; position: number }> } };

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const updated = bulkUpdateTasks(json.tasks as any);
      return { data: updated };
    },
    onSuccess: () => {
      toast.success("Tasks updated successfully");
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
      toast.error("Failed to update tasks");
    },
  });
  return mutation;
};
