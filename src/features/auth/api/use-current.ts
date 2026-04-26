import { useQuery } from "@tanstack/react-query";

export const useCurrent = () => {
  return useQuery({
    queryKey: ["current"],
    queryFn: async () => {
      return {
        $id: "guest",
        name: "Guest",
        email: "guest@local",
      };
    },
  });
};
