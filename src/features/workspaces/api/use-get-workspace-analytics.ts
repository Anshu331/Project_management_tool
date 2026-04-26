import { useQuery } from "@tanstack/react-query";
import { workspaceAnalytics } from "@/lib/localdb";

interface useGetWorkspaceAnalyticProps {
  workspaceId: string;
}

export const useGetWorkspaceAnalytics = ({
  workspaceId,
}: useGetWorkspaceAnalyticProps) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: async () => {
      return workspaceAnalytics(workspaceId);
    },
  });
};
