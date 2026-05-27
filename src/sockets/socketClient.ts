import { io, type Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/authStore";

let socket: Socket | null = null;

/** REST API origin; in dev without VITE_API_URL, Vite proxies `/socket.io` to the backend. */
export function getSocketUrl(): string {
  const socketUrl = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, "");
  if (socketUrl) return socketUrl;
  const api = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
  return api || window.location.origin;
}

export function getSocket(): Socket | null {
  return socket;
}

export function connectSocket(): Socket | null {
  const token = useAuthStore.getState().accessToken;
  if (!token) return null;

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: 12,
    reconnectionDelay: 1000
  });

  socket.on("connect_error", (err) => {
    console.warn("[socket] connect_error:", err.message);
  });

  return socket;
}

/** Re-authenticate after JWT refresh without leaking duplicate listeners. */
export function updateSocketAuth(token: string): void {
  if (!socket) {
    connectSocket();
    return;
  }
  socket.auth = { token };
  if (socket.connected) {
    socket.disconnect();
  }
  socket.connect();
}

export function disconnectSocket(): void {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
}

export function joinTicketRoom(ticketId: string): void {
  socket?.emit("ticket:join", { ticketId });
}

export function leaveTicketRoom(ticketId: string): void {
  socket?.emit("ticket:leave", { ticketId });
}

export function emitTicketView(ticketId: string): void {
  socket?.emit("ticket:view", { ticketId });
}

export function emitTyping(ticketId: string): void {
  socket?.emit("message:typing", { ticketId });
}

export function emitStopTyping(ticketId: string): void {
  socket?.emit("message:stop-typing", { ticketId });
}
