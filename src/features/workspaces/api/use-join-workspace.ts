import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getWorkspace } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { param: { workspaceId: string }; json: { code: string } };

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const ws = getWorkspace(param.workspaceId);
      if (!ws) {
        throw new Error("Workspace not found");
      }
      return { data: ws };
    },
    onSuccess: ({ data }) => {
      toast.success("Joined workspace successfully");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to join workspace");
    },
  });
  return mutation;
};
