import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session.user.email !== "udayraj.vadeghar@gmail.com") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { text, voice = "alloy", model = "tts-1-hd", instructions } = await req.json();

  if (!text?.trim()) {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  try {
    const params: Parameters<typeof openai.audio.speech.create>[0] = {
      model,
      voice,
      input: text,
      response_format: "mp3",
    };

    if (instructions && model === "gpt-4o-mini-tts") {
      (params as Record<string, unknown>).instructions = instructions;
    }

    const response = await openai.audio.speech.create(params);

    const arrayBuffer = await response.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    return NextResponse.json({ audioBase64: base64, format: "mp3" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to synthesize speech";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
