import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createProject } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { form: any };

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const project = createProject({
        workspaceId: form.workspaceId,
        name: form.name,
        imageUrl: typeof form.image === "string" ? form.image : "",
      });
      return { data: project };
    },
    onSuccess: () => {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
    onError: () => {
      toast.error("Failed to create project");
    },
  });
  return mutation;
};
