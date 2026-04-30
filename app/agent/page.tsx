"use client";

import { Skeleton } from "@/components/ui/shadcn/skeleton";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertCircle,
  Brain,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Trash2,
  User,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type ChatMode = "normal" | "think";

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

type AgentSuggestionsResponse = {
  suggestions?: string[];
};

type AgentContextResponse = {
  historySummary?: string;
  context?: Record<string, unknown>;
  error?: string;
};

const DEFAULT_SUGGESTIONS = [
  "Review my meals today",
  "Suggest a balanced next meal",
  "What should I prioritize today?",
];

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
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [chatMode, setChatMode] = useState<ChatMode>("normal");
  const [agentContext, setAgentContext] =
    useState<AgentContextResponse | null>(null);

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

  useEffect(() => {
    let cancelled = false;

    async function preloadAgentContext() {
      try {
        const res = await fetch("/api/agent/context");
        const data = (await res.json()) as AgentContextResponse;
        if (!cancelled && res.ok) {
          setAgentContext(data);
        }
      } catch {
        /* fast mode can still answer with limited context */
      }
    }

    preloadAgentContext();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchSuggestions() {
      try {
        const res = await fetch("/api/agent/suggestions");
        if (!res.ok) return;

        const data = (await res.json()) as AgentSuggestionsResponse;
        if (
          !cancelled &&
          Array.isArray(data.suggestions) &&
          data.suggestions.length > 0
        ) {
          setSuggestions(data.suggestions.slice(0, 3));
        }
      } catch {
        /* suggestions are best-effort */
      }
    }

    fetchSuggestions();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Default sidebar to closed on mobile on mount
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

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
      const res = await fetch(
        `/api/agent/chats/${encodeURIComponent(sessionId)}`,
      );
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

  async function deleteChat(sessionId: string) {
    try {
      const res = await fetch(
        `/api/agent/chats/${encodeURIComponent(sessionId)}`,
        { method: "DELETE" },
      );
      if (!res.ok) return;
      setChatList((prev) => prev.filter((c) => c.session_id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
        setMessages([]);
      }
    } catch {
      /* best-effort */
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isSending) return;

    setError(null);
    setIsSending(true);
    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height =
        window.innerWidth < 768 ? "48px" : "56px";
    }

    const outgoingMessages = messages;
    setMessages((prev) => {
      const next = [...prev, { role: "user" as const, content: trimmed }];
      if (chatMode === "think") {
        next.push({ role: "assistant", content: "" });
      }
      return next;
    });

    try {
      if (chatMode === "normal") {
        const res = await fetch("/api/agent/fast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: trimmed,
            context: agentContext?.context ?? {},
            historySummary: agentContext?.historySummary ?? "",
            recentMessages: outgoingMessages,
          }),
        });

        const data = (await res.json()) as AgentApiResponse;
        if (!res.ok) throw new Error(data.error || "Failed to get response.");

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.answer || "No response received." },
        ]);
        setIncludeUserProfile(false);
        return;
      }

      const res = await fetch("/api/agent/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          sessionId: activeSessionId || undefined,
          includeUserProfile,
          context: agentContext?.context,
          historySummary: agentContext?.historySummary,
        }),
      });

      if (!res.ok) {
        let errMsg = "Failed to get response.";
        try {
          const errData = await res.json();
          if (errData.error) errMsg = errData.error;
        } catch {
          /* ignore */
        }
        throw new Error(errMsg);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No response stream.");

      const decoder = new TextDecoder();
      let buffer = "";
      const processEvent = (chunk: string) => {
        const lines = chunk.split(/\r?\n/);
        let eventName = "message";
        const dataLines: string[] = [];

        for (const line of lines) {
          if (line.startsWith("event:")) {
            eventName = line.slice(6).trim();
          } else if (line.startsWith("data:")) {
            dataLines.push(line.slice(5).trimStart());
          }
        }

        if (!dataLines.length) return;

        let parsed = "";
        try {
          parsed = JSON.parse(dataLines.join("\n")) as string;
        } catch {
          return;
        }

        if (eventName === "session" && parsed) {
          setActiveSessionId(parsed);
        } else if (eventName === "token" && parsed) {
          setMessages((prev) => {
            const updated = [...prev];
            const last = updated[updated.length - 1];
            if (last?.role === "assistant") {
              updated[updated.length - 1] = {
                ...last,
                content: last.content + parsed,
              };
            }
            return updated;
          });
        } else if (eventName === "error") {
          throw new Error(parsed || "Stream error");
        }
      };

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const events = buffer.split(/\r?\n\r?\n/);
        buffer = events.pop() || "";

        for (const eventChunk of events) {
          processEvent(eventChunk);
        }
      }
      if (buffer.trim()) {
        processEvent(buffer);
      }

      setIncludeUserProfile(false);

      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant" && !last.content.trim()) {
          return [
            ...prev.slice(0, -1),
            { role: "assistant" as const, content: "No response received." },
          ];
        }
        return prev;
      });

      fetchChatList();
    } catch (err) {
      if (chatMode === "think") {
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant" && !last.content.trim()) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      } else {
        setMessage(trimmed);
      }
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
    const baseHeight = window.innerWidth < 768 ? 48 : 56;
    e.target.style.height = baseHeight + "px";
    const scrollHeight = e.target.scrollHeight;
    e.target.style.height = Math.min(scrollHeight, 200) + "px";
  }

  function formatTime(ts: number) {
    const d = new Date(ts * 1000);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffDays = Math.floor(diffMs / 86_400_000);
    if (diffDays === 0)
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }

  return (
    <main className="flex h-[calc(100dvh-64px)] w-full overflow-hidden bg-white text-black selection:bg-black selection:text-white dark:bg-black dark:text-white dark:selection:bg-white dark:selection:text-black font-sans relative">
      {/* Ambient Background for Chat Area */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-[20%] left-[30%] w-[500px] h-[500px] bg-neutral-200/40 dark:bg-neutral-800/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[30%] w-[400px] h-[400px] bg-neutral-200/40 dark:bg-neutral-800/20 rounded-full blur-[100px]" />
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={cn(
          "absolute md:relative z-20 h-full flex flex-col border-r border-black/10 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-black/90",
          "transition-transform duration-200 ease-out md:transition-all md:duration-300 md:ease-in-out",
          sidebarOpen
            ? "w-full md:w-80 translate-x-0"
            : "w-full md:w-0 -translate-x-full md:translate-x-0 md:overflow-hidden md:border-r-0",
        )}
      >
        <div className="flex h-[56px] md:h-[68px] items-center justify-between gap-2 border-b border-black/10 px-5 dark:border-white/10 shrink-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500">
            Active Sessions
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={startNewChat}
              className="p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded hover:bg-black/5 dark:hover:bg-white/5"
              title="New Session"
            >
              <MessageSquarePlus className="size-4" />
            </button>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-2 text-neutral-500 hover:text-black dark:hover:text-white transition-colors cursor-pointer rounded hover:bg-black/5 dark:hover:bg-white/5"
              title="Close Sidebar"
            >
              <PanelLeftClose className="size-4" />
            </button>
          </div>
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
                <div
                  key={chat.session_id}
                  className={cn(
                    "w-[calc(100%-16px)] mx-2 mb-1 px-4 py-3 rounded-xl text-left transition-colors group relative",
                    chat.session_id === activeSessionId
                      ? "bg-black/[0.04] dark:bg-white/[0.08]"
                      : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]",
                  )}
                >
                  {chat.session_id === activeSessionId && (
                    <div className="absolute -left-2 top-2 bottom-2 w-1 bg-black dark:bg-white rounded-r-full" />
                  )}
                  <div className="flex items-start justify-between gap-2">
                    <button
                      onClick={() => loadChat(chat.session_id)}
                      className={cn(
                        "truncate text-left text-sm font-medium tracking-tight mb-1 flex-1 min-w-0 cursor-pointer",
                        chat.session_id === activeSessionId
                          ? "text-black dark:text-white"
                          : "text-neutral-700 dark:text-neutral-300 group-hover:text-black dark:group-hover:text-white",
                      )}
                    >
                      {chat.preview || "New Session"}
                    </button>
                    <button
                      onClick={() => deleteChat(chat.session_id)}
                      className="shrink-0 p-1 rounded text-neutral-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all cursor-pointer"
                      title="Delete chat"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => loadChat(chat.session_id)}
                    className="block text-left text-[10px] font-mono uppercase tracking-widest text-neutral-400 cursor-pointer"
                  >
                    {formatTime(chat.last_update)}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* ── Main chat area ── */}
      <div className="flex flex-1 flex-col relative z-10 w-full min-w-0">
        {/* Top bar */}
        <div className="flex h-[48px] md:h-[68px] items-center gap-3 md:gap-4 border-b border-black/10 px-3 md:px-6 bg-white/80 dark:bg-black/80 backdrop-blur-md shrink-0">
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
              Aevio
            </h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              System Online
            </span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex rounded-xl border border-black/10 bg-white/60 p-1 shadow-sm dark:border-white/10 dark:bg-black/60">
              {(["normal", "think"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setChatMode(mode)}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-[10px] font-mono uppercase tracking-widest transition-colors cursor-pointer",
                    chatMode === mode
                      ? "bg-black text-white dark:bg-white dark:text-black"
                      : "text-neutral-500 hover:text-black dark:hover:text-white",
                  )}
                  title={
                    mode === "normal"
                      ? "Fast direct Gemini mode"
                      : "Slower ADK thinking mode"
                  }
                >
                  {mode === "normal" ? "Normal" : "Think"}
                </button>
              ))}
            </div>
            {activeSessionId && (
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-widest text-neutral-500 border border-black/10 dark:border-white/10 rounded-lg px-2.5 py-1 bg-white/50 dark:bg-black/50 shadow-sm">
                ID: {activeSessionId.slice(0, 8)}...
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 md:px-6 py-4 md:py-8 custom-scrollbar">
          <div className="mx-auto flex max-w-3xl flex-col gap-4 md:gap-6">
            <AnimatePresence mode="popLayout">
              {historyLoading ? (
                <motion.div
                  key="history-loading"
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
                        i % 2 === 0
                          ? "self-end items-end"
                          : "self-start items-start",
                      )}
                    >
                      <Skeleton className="h-3 w-16 bg-neutral-200 dark:bg-neutral-800" />
                      <Skeleton
                        className={cn(
                          "h-20 bg-neutral-200 dark:bg-neutral-800",
                          i % 2 === 0 ? "w-[280px]" : "w-[320px]",
                        )}
                      />
                    </div>
                  ))}
                </motion.div>
              ) : messages.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center justify-center py-10 md:py-20 text-center gap-4 md:gap-6"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-white/5 flex items-center justify-center rounded-2xl shadow-sm">
                    <Brain className="w-6 h-6 md:w-8 md:h-8 text-neutral-400" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h2 className="text-sm font-bold uppercase tracking-tight">
                      Initiate Sequence
                    </h2>
                    <p className="text-xs text-neutral-500 leading-relaxed font-mono">
                      Aevio is ready. Ask about your nutrition goals
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={`${suggestion || "suggestion"}-${index}`}
                        onClick={() => setMessage(suggestion)}
                        className="px-4 py-2 rounded-full border border-black/10 dark:border-white/10 text-[10px] font-mono uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors cursor-pointer shadow-sm"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : (
                messages
                  .filter((e) => e.role !== "assistant" || e.content)
                  .map((entry, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key={`${entry.role}-${index}`}
                      className={cn(
                        "flex flex-col gap-1.5 max-w-[85%] md:max-w-[80%]",
                        entry.role === "user"
                          ? "self-end items-end"
                          : "self-start items-start",
                      )}
                    >
                      <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                        {entry.role === "user" ? (
                          <>
                            You <User className="w-3 h-3" />
                          </>
                        ) : (
                          <>
                            <Brain className="w-3 h-3" /> Aevio
                          </>
                        )}
                      </div>
                      <div
                        className={cn(
                          "px-5 py-4 text-[13px] md:text-sm leading-relaxed shadow-md",
                          entry.role === "user"
                            ? "bg-black text-white dark:bg-white dark:text-black rounded-2xl rounded-br-sm whitespace-pre-wrap"
                            : "bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 dark:border-white/5 rounded-2xl rounded-bl-sm",
                        )}
                      >
                        {entry.role === "assistant" ? (
                          <ReactMarkdown
                            components={{
                              p: ({ children }) => (
                                <p className="mb-3 last:mb-0">{children}</p>
                              ),
                              ul: ({ children }) => (
                                <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">
                                  {children}
                                </ul>
                              ),
                              ol: ({ children }) => (
                                <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">
                                  {children}
                                </ol>
                              ),
                              li: ({ children }) => (
                                <li className="pl-1">{children}</li>
                              ),
                              strong: ({ children }) => (
                                <strong className="font-semibold text-black dark:text-white">
                                  {children}
                                </strong>
                              ),
                            }}
                          >
                            {entry.content}
                          </ReactMarkdown>
                        ) : (
                          entry.content
                        )}
                      </div>
                    </motion.div>
                  ))
              )}
              {isSending &&
                (chatMode === "normal" ||
                  !messages.length ||
                  !messages[messages.length - 1]?.content) && (
                  <motion.div
                    key="assistant-loading"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col gap-1.5 max-w-[85%] self-start items-start"
                  >
                    <div className="flex items-center gap-1.5 px-1 text-[10px] font-mono uppercase tracking-widest text-neutral-500">
                      <Brain className="w-3 h-3" /> Aevio
                    </div>
                    <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md border border-black/5 dark:border-white/5 px-5 py-4 flex items-center gap-2 shadow-md rounded-2xl rounded-bl-sm">
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
        <div className="shrink-0 bg-gradient-to-t from-white via-white to-white/50 dark:from-black dark:via-black dark:to-black/50 backdrop-blur-sm pt-1 md:pt-2">
          <div className="mx-auto max-w-3xl px-3 md:px-6 pb-3 md:pb-6">
            {error && (
              <div className="mb-3 flex items-center gap-2 border border-red-200 bg-red-50/80 px-4 py-2.5 text-xs text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-400 backdrop-blur-sm rounded-xl shadow-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="relative flex items-end shadow-lg rounded-2xl bg-white dark:bg-[#0a0a0a] border border-black/10 dark:border-white/10 focus-within:border-black/30 focus-within:ring-1 focus-within:ring-black/30 dark:focus-within:border-white/30 dark:focus-within:ring-white/30 transition-all"
            >
              <textarea
                ref={textareaRef}
                value={message}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Ask about your diet, request an analysis, or set a goal..."
                className="w-full resize-none bg-transparent pl-5 pr-14 py-3 md:py-4 text-base md:text-sm focus:outline-none placeholder:text-neutral-400 custom-scrollbar h-[48px] md:h-[56px] min-h-[48px] md:min-h-[56px] max-h-[200px]"
              />
              <button
                type="submit"
                disabled={isSending || !message.trim()}
                className="absolute right-2 bottom-2 w-10 h-10 flex items-center justify-center bg-black dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group rounded-xl"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </form>
            <div className="mt-1.5 md:mt-3 text-center">
              <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-400">
                AI can make mistakes. Verify important dietary information.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Global styles for custom scrollbar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
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
      `,
        }}
      />
    </main>
  );
}
