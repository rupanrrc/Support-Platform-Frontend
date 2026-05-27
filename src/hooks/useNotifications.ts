import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationsApi } from "@/api/notificationsApi";
import { useNotificationStore } from "@/stores/notificationStore";
import { useEffect } from "react";

export function useNotifications(params?: { page?: number; limit?: number; isRead?: boolean }) {
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  const query = useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsApi.list(params)
  });

  useEffect(() => {
    if (query.data) {
      setNotifications(query.data.items);
      setUnreadCount(query.data.unreadCount);
    }
  }, [query.data, setNotifications, setUnreadCount]);

  return query;
}

export function useMarkNotificationRead() {
  const markRead = useNotificationStore((s) => s.markRead);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationsApi.markRead(id),
    onSuccess: (_data, id) => {
      markRead(id);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });
}
