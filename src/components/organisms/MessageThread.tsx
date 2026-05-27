import { FormEvent, useEffect, useRef, useState } from "react";
import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/atoms/Button";
import { Spinner } from "@/components/atoms/Spinner";
import { formatDate } from "@/utils/formatDate";
import { refName } from "@/utils/ticketDisplay";
import { getApiErrorMessage } from "@/api/axiosInstance";
import { useUiStore } from "@/stores/uiStore";
import { emitStopTyping, emitTyping, getSocket } from "@/sockets/socketClient";
import type { TypingPayload, StopTypingPayload } from "@/types/socket";
import type { Message } from "@/types/message";

interface MessageThreadProps {
  ticketId: string;
}

export function MessageThread({ ticketId }: MessageThreadProps) {
  const user = useAuthStore((s) => s.user);
  const { data: messages, isLoading } = useMessages(ticketId);
  const createMessage = useCreateMessage(ticketId);
  const pushToast = useUiStore((s) => s.pushToast);

  const [content, setContent] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const canInternal = user && user.role !== "customer";

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const onTyping = (payload: TypingPayload) => {
      if (payload.ticketId !== ticketId || payload.user.id === user?._id) return;
      setTypingUsers((prev) => ({ ...prev, [payload.user.id]: payload.user.name }));
    };

    const onStopTyping = (payload: StopTypingPayload) => {
      if (payload.ticketId !== ticketId) return;
      setTypingUsers((prev) => {
        const next = { ...prev };
        delete next[payload.userId];
        return next;
      });
    };

    socket.on("message:typing", onTyping);
    socket.on("message:stop-typing", onStopTyping);

    return () => {
      socket.off("message:typing", onTyping);
      socket.off("message:stop-typing", onStopTyping);
    };
  }, [ticketId, user?._id]);

  const handleContentChange = (value: string) => {
    setContent(value);
    if (!value.trim()) {
      emitStopTyping(ticketId);
      return;
    }
    emitTyping(ticketId);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => emitStopTyping(ticketId), 2000);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    emitStopTyping(ticketId);
    try {
      await createMessage.mutateAsync({
        content: content.trim(),
        isInternal: canInternal ? isInternal : false
      });
      setContent("");
      setIsInternal(false);
    } catch (err) {
      pushToast({ type: "error", message: getApiErrorMessage(err) });
    }
  };

  const typingLabel = Object.values(typingUsers);
  const typingText =
    typingLabel.length === 1
      ? `${typingLabel[0]} is typing…`
      : typingLabel.length > 1
        ? `${typingLabel.slice(0, 2).join(", ")}${typingLabel.length > 2 ? " and others" : ""} are typing…`
        : null;

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="max-h-96 space-y-3 overflow-y-auto rounded-xl border border-border bg-muted p-4">
        {(messages || []).length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">No messages yet. Start the conversation.</p>
        ) : (
          (messages || []).map((msg) => (
            <MessageBubble key={msg._id} message={msg} currentUserId={user?._id} />
          ))
        )}
      </div>

      {typingText ? <p className="text-xs italic text-muted-foreground">{typingText}</p> : null}

      <form onSubmit={handleSubmit} className="space-y-3 rounded-xl border border-border bg-card p-4">
        <textarea
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
          rows={3}
          placeholder="Write a reply…"
          value={content}
          onChange={(e) => handleContentChange(e.target.value)}
          onBlur={() => emitStopTyping(ticketId)}
        />
        {canInternal ? (
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(e) => setIsInternal(e.target.checked)}
            />
            Internal note (hidden from customer)
          </label>
        ) : null}
        <Button type="submit" loading={createMessage.isPending} disabled={!content.trim()}>
          Send message
        </Button>
      </form>
    </div>
  );
}

function MessageBubble({
  message,
  currentUserId
}: {
  message: Message;
  currentUserId?: string;
}) {
  const senderId = typeof message.senderId === "string" ? message.senderId : message.senderId._id;
  const isMine = senderId === currentUserId;

  return (
    <div
      className={`rounded-lg px-3 py-2 text-sm ${
        message.isInternal
          ? "border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/60"
          : isMine
            ? "ml-8 bg-brand-50 text-foreground dark:bg-brand-950/50"
            : "mr-8 bg-card text-foreground shadow-sm"
      }`}
    >
      <div className="mb-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <span className="font-medium text-foreground">{refName(message.senderId)}</span>
        <span className="capitalize">{message.senderRole}</span>
        {message.isInternal ? (
          <span className="text-amber-700 dark:text-amber-300">Internal</span>
        ) : null}
        <span>{formatDate(message.createdAt)}</span>
      </div>
      <p className="whitespace-pre-wrap">{message.content}</p>
    </div>
  );
}
