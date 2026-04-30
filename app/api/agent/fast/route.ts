import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 15;

const FAST_MODEL_ID = "gemini-2.5-flash";
const MAX_RECENT_MESSAGES = 8;

type RecentMessage = {
  role: "user" | "assistant";
  content: string;
};

type FastChatPayload = {
  message?: unknown;
  recentMessages?: unknown;
  context?: unknown;
  historySummary?: unknown;
};

let cachedClient: GoogleGenAI | null = null;

function getVertexLocation(modelId: string): string {
  if (modelId.includes("3.1-pro") || modelId.includes("3-pro")) {
    return "global";
  }
  return process.env.GCP_LOCATION ?? "us-central1";
}

function getGenAI(): GoogleGenAI {
  if (cachedClient) return cachedClient;

  const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;
  if (apiKey) {
    cachedClient = new GoogleGenAI({ apiKey });
    return cachedClient;
  }

  const project = process.env.GCP_PROJECT_ID;
  if (!project) {
    throw new Error("GEMINI_API_KEY or GCP_PROJECT_ID is not configured");
  }

  cachedClient = new GoogleGenAI({
    vertexai: true,
    project,
    location: getVertexLocation(FAST_MODEL_ID),
  });

  return cachedClient;
}

function parseRecentMessages(value: unknown): RecentMessage[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((entry): entry is RecentMessage => {
      if (!entry || typeof entry !== "object") return false;
      const c = entry as Record<string, unknown>;
      return (
        (c.role === "user" || c.role === "assistant") &&
        typeof c.content === "string" &&
        c.content.trim().length > 0
      );
    })
    .slice(-MAX_RECENT_MESSAGES)
    .map((e) => ({ role: e.role, content: e.content.trim().slice(0, 2000) }));
}

function buildPrompt(
  message: string,
  context: Record<string, unknown>,
  historySummary: string,
  recentMessages: RecentMessage[],
): string {
  return [
    "You are Aevio Coach, a fast, practical nutrition and wellness assistant.",
    "Use the nutrition data below. Prefer the user's real numbers over generic advice.",
    "Be concise, specific, non-judgmental, and useful. If important data is missing, say what is missing.",
    "Return markdown with one short guidance paragraph and 2-3 concrete next actions.",
    "",
    "User nutrition context:",
    JSON.stringify(context),
    "",
    ...(historySummary ? ["History summary:", historySummary, ""] : []),
    "",
    ...(recentMessages.length
      ? ["Recent chat messages:", JSON.stringify(recentMessages), ""]
      : []),
    "User message:",
    message,
  ].join("\n");
}

export async function POST(req: NextRequest) {
  let payload: FastChatPayload;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";
  if (!message) {
    return NextResponse.json(
      { error: "Missing 'message' in body" },
      { status: 400 },
    );
  }

  const context =
    payload.context && typeof payload.context === "object"
      ? (payload.context as Record<string, unknown>)
      : {};
  const historySummary =
    typeof payload.historySummary === "string" ? payload.historySummary : "";

  const recentMessages = parseRecentMessages(payload.recentMessages);

  try {
    const response = await getGenAI().models.generateContent({
      model: FAST_MODEL_ID,
      config: {
        temperature: 0.3,
        maxOutputTokens: 1200,
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: buildPrompt(
                message,
                context,
                historySummary,
                recentMessages,
              ),
            },
          ],
        },
      ],
    });

    const answer = response.text?.trim();
    if (!answer) {
      throw new Error("Gemini returned an empty response");
    }

    return NextResponse.json({
      answer,
      model: FAST_MODEL_ID,
      advisor: "aevio-fast-coach",
    });
  } catch (error) {
    console.error("Fast agent request failed:", error);
    return NextResponse.json(
      { error: "Fast chat request failed" },
      { status: 502 },
    );
  }
}
