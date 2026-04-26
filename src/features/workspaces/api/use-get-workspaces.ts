import { useQuery } from "@tanstack/react-query";
import { listWorkspaces } from "@/lib/localdb";

export const useGetWorkspaces = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      return listWorkspaces();
    },
  });
};
