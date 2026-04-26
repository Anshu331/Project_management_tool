import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/lib/localdb";

interface useGetWorkspaceProps {
  workspaceId: string;
}

export const useGetWorkspace = ({ workspaceId }: useGetWorkspaceProps) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: async () => {
      return getWorkspace(workspaceId);
    },
  });
};
