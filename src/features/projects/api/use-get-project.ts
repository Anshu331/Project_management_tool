import { useQuery } from "@tanstack/react-query";
import { getProject } from "@/lib/localdb";

interface useGetProjectProps {
  projectId: string;
}

export const useGetProject = ({ projectId }: useGetProjectProps) => {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      return getProject(projectId);
    },
  });
};
