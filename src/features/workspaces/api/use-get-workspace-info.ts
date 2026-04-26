import { useQuery } from "@tanstack/react-query";
import { getWorkspace } from "@/lib/localdb";

interface useGetWorkspaceInfoProps {
  workspaceId: string;
}

export const useGetWorkspaceInfo = ({
  workspaceId,
}: useGetWorkspaceInfoProps) => {
  return useQuery({
    queryKey: ["workspace-info", workspaceId],
    queryFn: async () => {
      const ws = getWorkspace(workspaceId);
      if (!ws) return null;
      return { $id: ws.$id, name: ws.name, image: ws.imageUrl };
    },
  });
};
