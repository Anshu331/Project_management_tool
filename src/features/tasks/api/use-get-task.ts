import { useQuery } from "@tanstack/react-query";
import { getTask } from "@/lib/localdb";

interface useGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: useGetTaskProps) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      return getTask(taskId);
    },
  });
};
