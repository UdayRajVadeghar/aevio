import { forwardToAdk } from "@/lib/adk-upstream";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const upstream = await forwardToAdk(
      `/chats/${encodeURIComponent(session.user.id)}`,
    );

    let data: unknown;
    try {
      data = await upstream.json();
    } catch {
      console.error(
        "ADK /chats returned non-JSON response, status:",
        upstream.status,
      );
      return NextResponse.json({ chats: [] });
    }

    if (!upstream.ok) {
      console.error("ADK /chats error:", upstream.status, data);
      return NextResponse.json({ chats: [] });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to load agent chats:", error);
    return NextResponse.json({ chats: [] });
  }
}
