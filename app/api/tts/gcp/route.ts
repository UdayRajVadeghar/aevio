import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { ensureGoogleCredentials } from "@/lib/google/credentials";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

ensureGoogleCredentials();

const clientCache = new Map<string, GoogleGenAI>();

function getGenAI(location: string = "global"): GoogleGenAI {
  const cached = clientCache.get(location);
  if (cached) return cached;

  const project = process.env.GCP_PROJECT_ID;
  if (!project) throw new Error("GCP_PROJECT_ID is not configured");

  const client = new GoogleGenAI({
    vertexai: true,
    project,
    location,
  });

  clientCache.set(location, client);
  return client;
}

function addWavHeader(
  pcmBase64: string,
  sampleRate: number,
  channels: number,
  bitsPerSample: number,
): string {
  const pcm = Buffer.from(pcmBase64, "base64");
  const byteRate = (sampleRate * channels * bitsPerSample) / 8;
  const blockAlign = (channels * bitsPerSample) / 8;
  const header = Buffer.alloc(44);

  header.write("RIFF", 0);
  header.writeUInt32LE(36 + pcm.length, 4);
  header.write("WAVE", 8);
  header.write("fmt ", 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM
  header.writeUInt16LE(channels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write("data", 36);
  header.writeUInt32LE(pcm.length, 40);

  return Buffer.concat([header, pcm]).toString("base64");
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user || session.user.email !== "udayraj.vadeghar@gmail.com") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { text, voiceName, model } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json(
        { error: "Text is required and must be a string" },
        { status: 400 },
      );
    }

    const ttsModel = model || "gemini-2.5-flash-preview-tts";
    const voice = voiceName || "Kore";

    const validModels = [
      "gemini-2.5-flash-preview-tts",
      "gemini-2.5-pro-preview-tts",
      "gemini-3.1-flash-tts-preview",
    ];

    if (!validModels.includes(ttsModel)) {
      return NextResponse.json(
        {
          error: "Invalid TTS model",
          details: `Model "${ttsModel}" is not supported. Valid models: ${validModels.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const ai = getGenAI("global");

    const response = await ai.models.generateContent({
      model: ttsModel,
      contents: [{ role: "user", parts: [{ text }] }],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const audioData =
      response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!audioData) {
      return NextResponse.json(
        { error: "No audio content generated" },
        { status: 500 },
      );
    }

    const wavBase64 = addWavHeader(audioData, 24000, 1, 16);

    return NextResponse.json({
      success: true,
      audioBase64: wavBase64,
      mimeType: "audio/wav",
      voice,
      model: ttsModel,
    });
  } catch (error) {
    console.error("Gemini TTS Error:", error);
    return NextResponse.json(
      {
        error: "Failed to synthesize speech",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
