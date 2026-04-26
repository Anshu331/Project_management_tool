import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateWorkspace } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { param: { workspaceId: string } };

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const ws = updateWorkspace(param.workspaceId, {
        inviteCode: Math.random().toString(36).slice(2, 8).toUpperCase(),
      });
      if (!ws) throw new Error("Workspace not found");
      return { data: ws };
    },
    onSuccess: ({ data }) => {
      toast.success("Invite code reset successful");
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace", data.$id],
      });
    },
    onError: () => {
      toast.error("Failed to reset invite code");
    },
  });
  return mutation;
};
