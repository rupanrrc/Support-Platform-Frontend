import { useSocketConnection } from "@/hooks/useSocket";

/** Headless component — mounts global Socket.IO listeners when authenticated. */
export function SocketConnection() {
  useSocketConnection();
  return null;
}
