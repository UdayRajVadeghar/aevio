"use client";

import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  User,
  AlertCircle
} from "lucide-react";
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
    
    // Close sidebar on mobile when a chat is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }

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
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }

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

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);
    e.target.style.height = "56px"; // Reset height to recalculate
    const scrollHeight = e.target.scrollHeight;
    e.target.style.height = Math.min(scrollHeight, 200) + "px";
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
    <main className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-white text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black font-sans relative">
      {/* Ambient Background for Chat Area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-neutral-200/40 dark:bg-neutral-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[30%] w-[400px] h-[400px] bg-neutral-200/40 dark:bg-neutral-800/20 rounded-full blur-[100px]" />
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "absolute md:relative z-20 h-full flex flex-col border-r border-black/10 bg-white/90 backdrop-blur-xl transition-all duration-300 ease-in-out dark:border-white/10 dark:bg-black/90",
          sidebarOpen ? "w-80 translate-x-0" : "w-0 -translate-x-full md:translate-x-0 overflow-hidden border-r-0",
        )}
      >
        <div className="flex h-[68px] items-center justify-between gap-2 border-b border-black/10 px-5 dark:border-white/10 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Active Sessions
          </span>
          <button
            onClick={startNewChat}
            className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded hover:bg-black/5 dark:hover:bg-white/5"
            title="New Session"
          >
            <MessageSquarePlus className="size-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar">
          {chatListLoading ? (
            <div className="flex flex-col gap-2 p-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="px-3 py-3">
                  <Skeleton className="h-4 w-3/4 mb-2 bg-neutral-200 dark:bg-neutral-800" />
                  <Skeleton className="h-3 w-1/4 bg-neutral-200 dark:bg-neutral-800" />
                </div>
              ))}
            </div>
          ) : chatList.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-6 text-center">
              <MessageSquarePlus className="size-8 text-neutral-300 dark:text-neutral-700 mb-3" />
              <p className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                No active sessions
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-black/5 dark:divide-white/5">
              {chatList.map((chat) => (
                <button
                  key={chat.session_id}
                  onClick={() => loadChat(chat.session_id)}
                  className={cn(
                    "w-full px-5 py-4 text-left transition-colors group relative",
                    chat.session_id === activeSessionId
                      ? "bg-black/[0.03] dark:bg-white/[0.05]"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
                  )}
                >
                  {chat.session_id === activeSessionId && (
                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-black dark:bg-white" />
                  )}
                  <p
                    className={cn(
                      "truncate text-sm font-medium tracking-tight mb-1",
                      chat.session_id === activeSessionId
                        ? "text-black dark:text-white"
                        : "text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white"
                    )}
                  >
                    {chat.preview || "New Session"}
                  </p>
                  <p className="text-[10px] font-mono uppercase tracking-widest text-neutral-400">
                    {formatTime(chat.last_update)}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden absolute inset-0 bg-black/20 dark:bg-black/40 z-10 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Main chat area ── */}
      <div className="flex flex-1 flex-col relative z-10 w-full min-w-0">
        {/* Top bar */}
        <div className="flex h-[68px] items-center gap-4 border-b border-black/10 px-4 md:px-6 bg-white/80 dark:bg-black/80 backdrop-blur-md shrink-0">
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded hover:bg-black/5 dark:hover:bg-white/5"
            title={sidebarOpen ? "Close sidebar" : "Open sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="size-4" />
            ) : (
              <PanelLeftOpen className="size-4" />
            )}
          </button>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight uppercase flex items-center gap-2">
              <Brain className="w-4 h-4" />
              AI Coach
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </span>
          </div>
          {activeSessionId && (
            <span className="ml-auto hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-black/10 dark:border-white/10 px-2 py-1 bg-white/50 dark:bg-black/50">
              ID: {activeSessionId.slice(0, 8)}...
            </span>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-6 py-8 custom-scrollbar">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            <AnimatePresence mode="popLayout">
              {historyLoading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col gap-8"
                >
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col gap-2 max-w-[85%]",
                        i % 2 === 0 ? "self-end items-end" : "self-start items-start"
                      )}
                    >
                      <Skeleton className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800" />
                      <Skeleton
                        className={cn(
                          "h-20 bg-neutral-200 dark:bg-neutral-800",
                          i % 2 === 0 ? "w-[280px]" : "w-[320px]"
                        )}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-20 text-center gap-6"
                >
                  <div className="w-16 h-16 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 flex items-center justify-center">
                    <Brain className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-sm font-bold uppercase tracking-tight">Initiate Sequence</h2>
                    <p className="text-xs text-neutral-500 leading-relaxed font-mono">
                      Your AI Coach is ready. Ask about your nutrition goals, request an analysis of your daily habits, or seek guidance on your next meal.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {["Analyze my diet", "How much protein today?", "Suggest a dinner"].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setMessage(suggestion)}
                        className="px-3 py-1.5 border border-black/10 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages.map((entry, index) => (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    key={`${entry.role}-${index}`}
                    className={cn(
                      "flex flex-col gap-1.5 max-w-[85%] md:max-w-[80%]",
                      entry.role === "user" ? "self-end items-end" : "self-start items-start"
                    )}
                  >
                    <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      {entry.role === "user" ? (
                        <>User <User className="w-3 h-3" /></>
                      ) : (
                        <><Brain className="w-3 h-3" /> AI Coach</>
                      )}
                    </div>
                    <div
                      className={cn(
                        "px-5 py-4 text-[13px] md:text-sm leading-relaxed whitespace-pre-wrap shadow-sm",
                        entry.role === "user"
                          ? "bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white"
                          : "bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-black/10 dark:border-white/10"
                      )}
                    >
                      {entry.content}
                    </div>
                  </motion.div>
                ))
              )}
              {isSending && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col gap-1.5 max-w-[85%] self-start items-start"
                >
                  <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                    <Brain className="w-3 h-3" /> AI Coach
                  </div>
                  <div className="bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-black/10 dark:border-white/10 px-5 py-4 flex items-center gap-2 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-neutral-400 dark:bg-neutral-500 animate-bounce" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} className="h-px w-full" />
          </div>
        </div>

        {/* Input Area */}
        <div className="shrink-0 bg-gradient-to-t from-white via-white to-white/50 dark:from-black dark:via-black dark:to-black/50 backdrop-blur-sm pt-2">
          <div className="mx-auto max-w-3xl px-4 md:px-6 pb-6">
            {error && (
              <div className="mb-3 flex items-center gap-2 border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 backdrop-blur-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end shadow-sm"
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your diet, request an analysis, or set a goal..."
                className="w-full resize-none bg-white dark:bg-[#0a0a0a] border border-black/20 dark:border-white/20 pl-4 pr-14 py-4 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black dark:focus:border-white dark:focus:ring-white transition-all placeholder:text-neutral-400 custom-scrollbar h-[56px] min-h-[56px] max-h-[200px]"
                style={{ height: "56px" }}
              />
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
            <div className="mt-3 text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                AI can make mistakes. Verify important dietary information.
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Global styles for custom scrollbar */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.2);
          border-radius: 3px;
        }
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(150, 150, 150, 0.4);
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.3);
        }
        .dark .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(100, 100, 100, 0.5);
        }
      `}} />
    </main>
  );
}

