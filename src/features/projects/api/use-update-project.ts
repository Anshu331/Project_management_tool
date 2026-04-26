import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProject } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { form: any; param: { projectId: string } };

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const project = updateProject(param.projectId, {
        name: form.name,
        imageUrl: typeof form.image === "string" ? form.image : "",
      });
      if (!project) throw new Error("Project not found");
      return { data: project };
    },
    onSuccess: ({ data }) => {
      toast.success("Project updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to update project");
    },
  });
  return mutation;
};
