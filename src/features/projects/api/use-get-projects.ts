import { useQuery } from "@tanstack/react-query";
import { listProjects } from "@/lib/localdb";

interface useGetProjectsProps {
  workspaceId: string;
}

export const useGetProjects = ({ workspaceId }: useGetProjectsProps) => {
  return useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: async () => {
      return listProjects(workspaceId);
    },
  });
};
