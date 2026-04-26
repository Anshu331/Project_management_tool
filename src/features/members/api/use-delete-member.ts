import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteMember } from "@/lib/localdb";

type ResponseType = { data: { $id: string } };
type RequestType = { param: { memberId: string } };

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      return { data: deleteMember(param.memberId) };
    },
    onSuccess: async () => {
      toast.success("Member deleted successfully");
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete member");
    },
  });
  return mutation;
};
