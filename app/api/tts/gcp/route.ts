import { auth } from "@/lib/auth";
import { ensureGoogleCredentials } from "@/lib/google/credentials";
import { GoogleGenAI } from "@google/genai";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

const SAMPLE_RATE = 24000;
const CHANNELS = 1;
const BITS_PER_SAMPLE = 16;

const TARGET_CHUNK_LENGTH = 80;
const MAX_CHUNK_LENGTH = 150;

function splitIntoChunks(text: string): string[] {
  // Split on sentence boundaries, emotion tags, commas, semicolons, colons, and newlines
  const segments = text.split(/(?<=[.!?])\s+|(?<=\n)\s*|(?<=[\]\)])\s+(?=\[)/);

  if (segments.length <= 1 && text.length > MAX_CHUNK_LENGTH) {
    // Fallback: split on commas, semicolons, colons, or mid-sentence pauses
    const fallback = text.split(/(?<=[,;:])\s+|(?<=\])\s*/);
    return mergeSegments(fallback);
  }

  return mergeSegments(segments);
}

function mergeSegments(segments: string[]): string[] {
  const chunks: string[] = [];
  let current = "";

  for (const seg of segments) {
    const trimmed = seg.trim();
    if (!trimmed) continue;

    const combined = current ? current + " " + trimmed : trimmed;

    if (current && combined.length > TARGET_CHUNK_LENGTH) {
      chunks.push(current);
      current = trimmed;
    } else {
      current = combined;
    }
  }
  if (current) chunks.push(current);

  // If we still ended up with a single huge chunk, force-split on any whitespace near midpoint
  if (chunks.length === 1 && chunks[0].length > MAX_CHUNK_LENGTH) {
    return forceSplit(chunks[0]);
  }

  return chunks.length > 0 ? chunks : [segments.join(" ")];
}

function forceSplit(text: string): string[] {
  const words = text.split(/\s+/);
  const chunks: string[] = [];
  let current = "";
  for (const word of words) {
    if (current && (current + " " + word).length > TARGET_CHUNK_LENGTH) {
      chunks.push(current);
      current = word;
    } else {
      current = current ? current + " " + word : word;
    }
  }
  if (current) chunks.push(current);
  return chunks;
}

async function generateChunkAudio(
  ai: GoogleGenAI,
  ttsModel: string,
  voice: string,
  text: string,
): Promise<string | null> {
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
  return (
    response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data ?? null
  );
}

const validModels = [
  "gemini-2.5-flash-preview-tts",
  "gemini-2.5-pro-preview-tts",
  "gemini-3.1-flash-tts-preview",
];

async function authorize() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user || session.user.email !== "udayraj.vadeghar@gmail.com") {
    return null;
  }
  return session;
}

function parseAndValidateBody(body: {
  text?: string;
  voiceName?: string;
  model?: string;
  stream?: boolean;
}) {
  const { text, voiceName, model, stream } = body;

  if (!text || typeof text !== "string") {
    return { error: "Text is required and must be a string" };
  }

  const ttsModel = model || "gemini-2.5-flash-preview-tts";
  const voice = voiceName || "Kore";

  if (!validModels.includes(ttsModel)) {
    return {
      error: `Invalid TTS model. Valid: ${validModels.join(", ")}`,
    };
  }

  return { text, ttsModel, voice, stream: !!stream };
}

export async function POST(request: NextRequest) {
  try {
    const session = await authorize();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = parseAndValidateBody(body);

    if ("error" in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const { text, ttsModel, voice, stream } = parsed;
    const ai = getGenAI("global");

    if (stream) {
      return handleStreaming(ai, ttsModel, voice, text);
    }

    const audioData = await generateChunkAudio(ai, ttsModel, voice, text);

    if (!audioData) {
      return NextResponse.json(
        { error: "No audio content generated" },
        { status: 500 },
      );
    }

    const wavBase64 = addWavHeader(
      audioData,
      SAMPLE_RATE,
      CHANNELS,
      BITS_PER_SAMPLE,
    );

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

function handleStreaming(
  ai: GoogleGenAI,
  ttsModel: string,
  voice: string,
  text: string,
) {
  const chunks = splitIntoChunks(text);
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "info",
              totalChunks: chunks.length,
              voice,
              model: ttsModel,
            }) + "\n",
          ),
        );

        const CONCURRENCY = 5;
        const results: (string | null)[] = new Array(chunks.length).fill(null);
        let nextToSend = 0;

        async function tryFlush() {
          while (nextToSend < results.length && results[nextToSend] !== null) {
            const pcmBase64 = results[nextToSend]!;
            const wavBase64 = addWavHeader(
              pcmBase64,
              SAMPLE_RATE,
              CHANNELS,
              BITS_PER_SAMPLE,
            );
            controller.enqueue(
              encoder.encode(
                JSON.stringify({
                  type: "chunk",
                  index: nextToSend,
                  audioBase64: wavBase64,
                }) + "\n",
              ),
            );
            nextToSend++;
          }
        }

        // Process chunks with bounded concurrency, preserving order for output
        let nextToStart = 0;
        const inFlight = new Set<Promise<void>>();

        while (nextToStart < chunks.length || inFlight.size > 0) {
          while (inFlight.size < CONCURRENCY && nextToStart < chunks.length) {
            const idx = nextToStart++;
            const p = (async () => {
              const audio = await generateChunkAudio(
                ai,
                ttsModel,
                voice,
                chunks[idx],
              );
              results[idx] = audio || "";
              await tryFlush();
            })();
            inFlight.add(p);
            p.then(() => inFlight.delete(p));
          }
          if (inFlight.size > 0) {
            await Promise.race(inFlight);
          }
        }

        controller.enqueue(
          encoder.encode(JSON.stringify({ type: "done" }) + "\n"),
        );
        controller.close();
      } catch (err) {
        controller.enqueue(
          encoder.encode(
            JSON.stringify({
              type: "error",
              error: err instanceof Error ? err.message : "Unknown error",
            }) + "\n",
          ),
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}
