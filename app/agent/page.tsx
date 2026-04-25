"use client";

import { Button } from "@/components/ui/shadcn/button";
import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { cn } from "@/lib/utils";
import { MessageSquarePlus, PanelLeftClose, PanelLeftOpen, Send } from "lucide-react";
import {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatListItem = {
  session_id: string;
  preview: string;
  last_update: number;
};

type AgentApiResponse = {
  answer?: string;
  sessionId?: string;
  error?: string;
};

type ChatHistoryResponse = {
  sessionId: string;
  messages: { role: string; content: string }[];
};

export default function AgentPage() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatList, setChatList] = useState<ChatListItem[]>([]);
  const [chatListLoading, setChatListLoading] = useState(true);

  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [includeUserProfile, setIncludeUserProfile] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const fetchChatList = useCallback(async () => {
    setChatListLoading(true);
    try {
      const res = await fetch("/api/agent/chats");
      if (res.ok) {
        const data = (await res.json()) as ChatListItem[];
        data.sort((a, b) => b.last_update - a.last_update);
        setChatList(data);
      }
    } catch {
      /* sidebar is best-effort */
    } finally {
      setChatListLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChatList();
  }, [fetchChatList]);

  async function loadChat(sessionId: string) {
    if (sessionId === activeSessionId) return;
    setHistoryLoading(true);
    setError(null);
    setMessages([]);
    setActiveSessionId(sessionId);
    setIncludeUserProfile(false);

    try {
      const res = await fetch(`/api/agent/chats/${encodeURIComponent(sessionId)}`);
      if (!res.ok) throw new Error("Failed to load chat");
      const data = (await res.json()) as ChatHistoryResponse;
      setMessages(
        data.messages.map((m) => ({
          role: m.role === "user" ? "user" : "assistant",
          content: m.content,
        })),
      );
    } catch {
      setError("Could not load chat history.");
    } finally {
      setHistoryLoading(false);
    }
  }

  function startNewChat() {
    setActiveSessionId(null);
    setMessages([]);
    setError(null);
    setIncludeUserProfile(true);
    textareaRef.current?.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");

    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId: activeSessionId || undefined,
          includeUserProfile,
        }),
      });

      const data = (await res.json()) as AgentApiResponse;
      if (!res.ok) throw new Error(data.error || "Failed to get response.");

      if (data.sessionId) {
        setActiveSessionId(data.sessionId);
      }
      setIncludeUserProfile(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received." },
      ]);

      fetchChatList();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      const form = e.currentTarget.closest("form");
      form?.requestSubmit();
    }
  }

  function formatTime(ts: number) {
    const d = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays === 0) return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return (
    <main className="flex h-[calc(100vh-64px)] overflow-hidden bg-white text-black dark:bg-black dark:text-white">
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "flex flex-col border-r border-black/10 bg-neutral-50 transition-all dark:border-white/10 dark:bg-white/[0.03]",
          sidebarOpen ? "w-72" : "w-0 overflow-hidden border-r-0",
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-black/10 px-3 py-3 dark:border-white/10">
          <span className="text-sm font-semibold tracking-tight">Chats</span>
          <Button variant="ghost" size="icon-sm" onClick={startNewChat} title="New chat">
            <MessageSquarePlus className="size-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chatListLoading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full rounded-md" />
              ))}
            </div>
          ) : chatList.length === 0 ? (
            <p className="p-4 text-xs text-neutral-500">No chats yet. Start one!</p>
          ) : (
            <div className="flex flex-col gap-0.5 p-1.5">
              {chatList.map((chat) => (
                <button
                  key={chat.session_id}
                  onClick={() => loadChat(chat.session_id)}
                  className={cn(
                    "w-full rounded-md px-3 py-2.5 text-left transition-colors",
                    chat.session_id === activeSessionId
                      ? "bg-black/[0.08] dark:bg-white/[0.08]"
                      : "hover:bg-black/[0.04] dark:hover:bg-white/[0.04]",
                  )}
                >
                  <p className="truncate text-sm">
                    {chat.preview || "New chat"}
                  </p>
                  <p className="mt-0.5 text-[11px] text-neutral-500">
                    {formatTime(chat.last_update)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <div className="flex items-center gap-2 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setSidebarOpen((v) => !v)}
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </Button>
          <h1 className="text-sm font-semibold tracking-tight">AI Coach</h1>
          {activeSessionId && (
            <span className="ml-auto text-[11px] text-neutral-400 font-mono">
              {activeSessionId}
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3">
            {historyLoading ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className={cn("h-16 rounded-lg", i % 2 === 0 ? "w-3/4 self-end" : "w-4/5 self-start")} />
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-1 items-center justify-center py-20">
                <p className="text-sm text-neutral-500">
                  Start by asking something like: &ldquo;What should I focus on this week?&rdquo;
                </p>
              </div>
            ) : (
              messages.map((entry, index) => (
                <div
                  key={`${entry.role}-${index}`}
                  className={cn(
                    "max-w-[85%] whitespace-pre-wrap rounded-xl px-4 py-3 text-sm leading-relaxed",
                    entry.role === "user"
                      ? "self-end bg-black text-white dark:bg-white dark:text-black"
                      : "self-start border border-black/10 bg-white dark:border-white/10 dark:bg-white/[0.03]",
                  )}
                >
                  {entry.content}
                </div>
              ))
            )}
            {isSending && (
              <div className="flex items-center gap-2 self-start rounded-xl border border-black/10 px-4 py-3 dark:border-white/10">
                <div className="flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:0ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:150ms]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-neutral-400 [animation-delay:300ms]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-black/10 px-4 py-3 dark:border-white/10">
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-2xl items-end gap-2"
          >
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your AI coach..."
              rows={1}
              className="max-h-32 min-h-[44px] flex-1 resize-none rounded-xl border border-black/10 bg-neutral-50 px-4 py-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-black/30 dark:border-white/10 dark:bg-white/[0.03] dark:focus:border-white/30"
            />
            <Button
              type="submit"
              size="icon"
              disabled={isSending || !message.trim()}
              className="shrink-0 rounded-xl"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
