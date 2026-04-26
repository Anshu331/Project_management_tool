import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateWorkspace } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { form: any; param: { workspaceId: string } };

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form, param }) => {
      const ws = updateWorkspace(param.workspaceId, {
        name: form.name,
        imageUrl: typeof form.image === "string" ? form.image : "",
      });
      if (!ws) {
        throw new Error("Workspace not found");
      }
      return { data: ws };
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to update workspace");
    },
  });
  return mutation;
};
