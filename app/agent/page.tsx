"use client";

import { FormEvent, useState } from "react";

type AgentApiResponse = {
  answer?: string;
  error?: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export default function AgentPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** First message after opening this page: server loads & sends `userProfile` to the ADK; then off until next visit. */
  const [includeUserProfile, setIncludeUserProfile] = useState(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isSending) {
      return;
    }

    setError(null);
    setIsSending(true);
    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setMessage("");

    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          includeUserProfile,
        }),
      });

      const data = (await response.json()) as AgentApiResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to get response from AI coach.");
      }

      setIncludeUserProfile(false);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.answer || "No response received." },
      ]);
    } catch (submitError) {
      const msg =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while sending your message.";
      setError(msg);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 py-8 text-black dark:bg-black dark:text-white sm:px-6">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">AI Coach</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Each message uses your stored{" "}
          <code className="text-xs">CoachContext</code> from the database (first
          send builds it if missing). Your profile is attached on the first
          message in this visit only; the coach still receives windowed history
          every time.
        </p>

        <div className="min-h-[280px] rounded-lg border border-black/10 bg-neutral-50 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-3">
            {messages.length === 0 ? (
              <p className="text-sm text-neutral-500">
                Start by asking something like: What should I focus on this
                week?
              </p>
            ) : (
              messages.map((entry, index) => (
                <div
                  key={`${entry.role}-${index}`}
                  className={
                    entry.role === "user"
                      ? "self-end max-w-[85%] rounded-md bg-black px-3 py-2 text-sm text-white dark:bg-white dark:text-black"
                      : "self-start max-w-[85%] rounded-md border border-black/10 bg-white px-3 py-2 text-sm dark:border-white/10 dark:bg-black"
                  }
                >
                  {entry.content}
                </div>
              ))
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Ask your AI coach..."
            className="h-24 w-full resize-none rounded-md border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:border-black/40 dark:border-white/10 dark:bg-black dark:focus:border-white/40"
          />
          <div className="flex items-center justify-between gap-3">
            {error ? (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            ) : (
              <span className="text-xs text-neutral-500">POST `/api/agent`</span>
            )}
            <button
              type="submit"
              disabled={isSending || !message.trim()}
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
