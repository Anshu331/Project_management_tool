import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createWorkspace } from "@/lib/localdb";

type ResponseType = { data: any };
type RequestType = { form: any };

export const useCreateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ form }) => {
      const ws = createWorkspace({
        name: form.name,
        imageUrl: typeof form.image === "string" ? form.image : "",
      });
      return { data: ws };
    },
    onSuccess: () => {
      toast.success("Workspace created successfully");
      router.refresh();
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
    onError: () => {
      toast.error("Failed to create workspace");
    },
  });
  return mutation;
};
