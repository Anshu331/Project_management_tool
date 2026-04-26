import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type ResponseType = { success: true };
type RequestType = { json: any };

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Continuing as guest");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["current"],
      });
    },
    onError: () => {
      toast.error("Failed to login");
    },
  });
  return mutation;
};
