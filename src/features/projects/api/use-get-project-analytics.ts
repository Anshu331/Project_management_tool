import { useQuery } from "@tanstack/react-query";
import { projectAnalytics } from "@/lib/localdb";

interface useGetProjectAnalyticProps {
  projectId: string;
}

export const useGetProjectAnalytics = ({
  projectId,
}: useGetProjectAnalyticProps) => {
  return useQuery({
    queryKey: ["project-analytics", projectId],
    queryFn: async () => {
      return projectAnalytics(projectId);
    },
  });
};
