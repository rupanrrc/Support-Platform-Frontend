import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/api/usersApi";
import type { User, UserRole } from "@/types/user";

export function useUsersList(params?: {
  page?: number;
  limit?: number;
  role?: UserRole;
  isActive?: boolean;
}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () =>
      usersApi.list({
        ...params,
        isActive: params?.isActive === undefined ? undefined : params.isActive ? "true" : "false"
      })
  });
}

export function useAgents(enabled = true) {
  return useQuery({
    queryKey: ["users", "agents"],
    queryFn: () => usersApi.list({ role: "agent", limit: 100, isActive: "true" }),
    select: (data) => data.items,
    enabled
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      name: string;
      email: string;
      password: string;
      role: UserRole;
      teamId?: string | null;
    }) => usersApi.create(body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: { name?: string; isActive?: boolean } }) =>
      usersApi.update(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
  });
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: UserRole }) => usersApi.updateRole(id, role),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
  });
}

export function useAssignUserTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, teamId }: { id: string; teamId: string | null }) =>
      usersApi.assignTeam(id, teamId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["users"] })
  });
}
