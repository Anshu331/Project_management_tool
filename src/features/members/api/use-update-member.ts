import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateMember } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { param: { memberId: string }; json: any };

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const updated = updateMember(param.memberId, json);
      if (!updated) throw new Error("Member not found");
      return { data: updated };
    },
    onSuccess: () => {
      toast.success("Member updated successfully");
      queryClient.invalidateQueries({
        queryKey: ["members"],
      });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update member");
    },
  });
  return mutation;
};
