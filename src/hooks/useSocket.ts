import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUiStore } from "@/stores/uiStore";
import { notificationsApi } from "@/api/notificationsApi";
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  updateSocketAuth
} from "@/sockets/socketClient";
import { registerSocketHandlers } from "@/sockets/socketHandlers";

/**
 * Maintains a single authenticated Socket.IO connection for the session.
 */
export function useSocketConnection() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();
  const setNotifications = useNotificationStore((s) => s.setNotifications);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);
  const setSocketConnected = useUiStore((s) => s.setSocketConnected);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      setSocketConnected(false);
      return;
    }

    if (!useAuthStore.getState().accessToken) return;

    const socket = connectSocket();
    if (!socket) return;

    const onConnect = () => setSocketConnected(true);
    const onDisconnect = () => setSocketConnected(false);
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    setSocketConnected(socket.connected);

    const removeHandlers = registerSocketHandlers(socket, queryClient);

    notificationsApi.list({ limit: 30 }).then((data) => {
      setNotifications(data.items);
      setUnreadCount(data.unreadCount);
    });

    const unsubAuth = useAuthStore.subscribe((state, prev) => {
      if (
        state.accessToken &&
        state.accessToken !== prev.accessToken &&
        state.isAuthenticated
      ) {
        updateSocketAuth(state.accessToken);
      }
    });

    return () => {
      if (socket) {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
      }
      removeHandlers();
      unsubAuth();
      disconnectSocket();
      setSocketConnected(false);
    };
  }, [isAuthenticated, queryClient, setNotifications, setUnreadCount, setSocketConnected]);
}

export function useTicketRoom(ticketId: string | undefined) {
  const setActiveTicketId = useUiStore((s) => s.setActiveTicketId);

  useEffect(() => {
    setActiveTicketId(ticketId ?? null);
    return () => setActiveTicketId(null);
  }, [ticketId, setActiveTicketId]);

  useEffect(() => {
    const socket = getSocket();
    if (!ticketId || !socket) return;

    const join = () => {
      socket.emit("ticket:join", { ticketId });
      socket.emit("ticket:view", { ticketId });
    };

    if (socket.connected) join();
    else socket.on("connect", join);

    return () => {
      socket.off("connect", join);
      socket.emit("ticket:leave", { ticketId });
    };
  }, [ticketId]);
}
