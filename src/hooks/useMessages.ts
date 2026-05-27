import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { messagesApi } from "@/api/messagesApi";

export function useMessages(ticketId: string | undefined) {
  return useQuery({
    queryKey: ["messages", ticketId],
    queryFn: () => messagesApi.list(ticketId!),
    enabled: Boolean(ticketId)
  });
}

export function useCreateMessage(ticketId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { content: string; isInternal?: boolean }) =>
      messagesApi.create(ticketId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    }
  });
}
