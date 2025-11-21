import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const onBoardingStatus = await db.onBoardingStatus.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        onBoardingStatus: true,
      },
    });

    // If no record exists, onboarding is incomplete
    if (!onBoardingStatus || onBoardingStatus.id === null) {
      return NextResponse.json({
        onBoardingStatus: "incomplete",
      });
    }

    return NextResponse.json({
      onBoardingStatus: onBoardingStatus.onBoardingStatus,
    });
  } catch (error) {
    console.error("Error fetching onboarding status:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch onboarding status",
      },
      { status: 500 }
    );
  }
}
