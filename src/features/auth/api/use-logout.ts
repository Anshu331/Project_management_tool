import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = { success: true };

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Guest mode");
      router.refresh();
      queryClient.invalidateQueries();
    },
    onError: () => {
      toast.error("Failed to log out");
    },
  });
  return mutation;
};
