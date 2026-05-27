import { useQuery } from "@tanstack/react-query";
import { teamsApi } from "@/api/teamsApi";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.list()
  });
}

export function useTeam(id: string | undefined) {
  return useQuery({
    queryKey: ["team", id],
    queryFn: () => teamsApi.getById(id!),
    enabled: Boolean(id)
  });
}
