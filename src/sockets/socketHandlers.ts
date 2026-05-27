import type { QueryClient } from "@tanstack/react-query";
import type { Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUiStore } from "@/stores/uiStore";
import type {
  SocketMessagePayload,
  SocketNotificationPayload,
  SocketTicketPayload,
  TicketResolvedPayload,
  TicketStatusPayload,
  TicketUpdatedPayload
} from "@/types/socket";
import type { Notification } from "@/types/notification";
import { isViewingTicket } from "@/utils/notify";

function senderId(message: SocketMessagePayload["message"]): string {
  const s = message.senderId;
  return typeof s === "string" ? s : s._id;
}

/**
 * Registers server → client listeners. Returns cleanup to remove them.
 */
export function registerSocketHandlers(socket: Socket, queryClient: QueryClient): () => void {
  const pushToast = useUiStore.getState().pushToast;
  const addNotification = useNotificationStore.getState().addNotification;

  const invalidateTicket = (ticketId: string) => {
    queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
  };

  const onTicketCreated = (_payload: SocketTicketPayload) => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
    queryClient.invalidateQueries({ queryKey: ["analytics"] });
    const role = useAuthStore.getState().user?.role;
    if (role && role !== "customer") {
      pushToast({ type: "info", message: "New ticket in queue" });
    }
  };

  const onTicketUpdated = ({ ticketId }: TicketUpdatedPayload) => {
    invalidateTicket(ticketId);
  };

  const onTicketStatusChanged = ({ ticketId, status }: TicketStatusPayload) => {
    invalidateTicket(ticketId);
    if (!isViewingTicket(ticketId)) {
      pushToast({ type: "info", message: `Ticket status updated to ${status.replace("_", " ")}` });
    }
  };

  const onTicketAssigned = (_payload: SocketTicketPayload) => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
    const userId = useAuthStore.getState().user?._id;
    const agentRef = _payload.ticket.assignedAgentId;
    const agentId =
      agentRef == null
        ? null
        : typeof agentRef === "string"
          ? agentRef
          : String((agentRef as { _id?: string })._id ?? agentRef);
    if (userId && agentId === userId) {
      pushToast({ type: "info", message: "A ticket was assigned to you" });
    }
  };

  const onTicketEscalated = () => {
    queryClient.invalidateQueries({ queryKey: ["tickets"] });
    pushToast({ type: "info", message: "Ticket escalated" });
  };

  const onTicketResolved = ({ ticketId }: TicketResolvedPayload) => {
    invalidateTicket(ticketId);
    if (!isViewingTicket(ticketId)) {
      pushToast({ type: "success", message: "Ticket resolved" });
    }
  };

  const onMessageNew = (payload: SocketMessagePayload) => {
    const ticketId = String(payload.message.ticketId);
    queryClient.invalidateQueries({ queryKey: ["messages", ticketId] });
    queryClient.invalidateQueries({ queryKey: ["ticket", ticketId] });

    const userId = useAuthStore.getState().user?._id;
    if (userId && senderId(payload.message) !== userId && !isViewingTicket(ticketId)) {
      pushToast({ type: "info", message: "New message on a ticket" });
    }
  };

  const onNotificationNew = (payload: SocketNotificationPayload) => {
    const raw = payload.notification;
    const notification: Notification = {
      ...raw,
      _id: String(raw._id),
      userId: String(raw.userId),
      ticketId: raw.ticketId ? String(raw.ticketId) : null,
      createdAt:
        typeof raw.createdAt === "string"
          ? raw.createdAt
          : new Date(raw.createdAt as unknown as string).toISOString()
    };
    addNotification(notification);
    queryClient.invalidateQueries({ queryKey: ["notifications"] });
    if (!window.location.pathname.startsWith("/notifications")) {
      pushToast({ type: "info", message: notification.title });
    }
  };

  socket.on("ticket:created", onTicketCreated);
  socket.on("ticket:updated", onTicketUpdated);
  socket.on("ticket:status-changed", onTicketStatusChanged);
  socket.on("ticket:assigned", onTicketAssigned);
  socket.on("ticket:escalated", onTicketEscalated);
  socket.on("ticket:resolved", onTicketResolved);
  socket.on("message:new", onMessageNew);
  socket.on("notification:new", onNotificationNew);

  return () => {
    socket.off("ticket:created", onTicketCreated);
    socket.off("ticket:updated", onTicketUpdated);
    socket.off("ticket:status-changed", onTicketStatusChanged);
    socket.off("ticket:assigned", onTicketAssigned);
    socket.off("ticket:escalated", onTicketEscalated);
    socket.off("ticket:resolved", onTicketResolved);
    socket.off("message:new", onMessageNew);
    socket.off("notification:new", onNotificationNew);
  };
}
