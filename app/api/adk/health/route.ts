import { forwardToAdk } from "@/lib/adk-upstream";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Proxies to FastAPI `GET /health`. */
export async function GET() {
  try {
    const upstream = await forwardToAdk("/health");
    const body = await upstream.text();
    return new NextResponse(body, {
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
