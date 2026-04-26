import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteProject } from "@/lib/localdb";

type ResponseType = { data: { $id: string } };
type RequestType = { param: { projectId: string } };

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      return { data: deleteProject(param.projectId) };
    },
    onSuccess: ({ data }) => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to delete project");
    },
  });
  return mutation;
};
