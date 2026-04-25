import { forwardToAdk } from "@/lib/adk-upstream";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Proxies to FastAPI `POST /chat`.
 * Body: same JSON as ChatRequest in services/adk-api (userId, message, historySummary, context).
 * Auth/validation can be added here later; FastAPI is currently open on the host.
 */
export async function POST(req: NextRequest) {
  let body: string;
  try {
    body = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const upstream = await forwardToAdk("/chat", {
      method: "POST",
      headers: {
        "content-type": req.headers.get("content-type") || "application/json",
      },
      body: body || "{}",
    });
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") || "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "ADK service is unavailable" },
      { status: 502 },
    );
  }
}
