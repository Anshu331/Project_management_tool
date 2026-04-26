import { useQuery } from "@tanstack/react-query";
import { listMembers } from "@/lib/localdb";

interface useGetMembersProps {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: useGetMembersProps) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      return listMembers(workspaceId);
    },
  });
};
