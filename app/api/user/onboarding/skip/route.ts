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
    // console.log("userId", userId);
    const onBoardingStatus = await db.onBoardingStatus.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        onBoardingStatus: true,
      },
    });

    // console.log("onBoardingStatus from the database", onBoardingStatus);

    if (!onBoardingStatus || onBoardingStatus.id === null) {
      await db.onBoardingStatus.create({
        data: {
          userId: userId,
          onBoardingStatus: "incomplete",
        },
        select: {
          id: true,
          onBoardingStatus: true,
        },
      });

      return NextResponse.json(
        { message: "Onboarding skipped successfully" },
        { status: 200 }
      );
    }

    const status = onBoardingStatus.onBoardingStatus
      .toLowerCase()
      .toString()
      .trim();

    if (status === "completed") {
      return NextResponse.json({
        message: "Onbaording is already finished",
      });
    }

    const updatedOnboardingStatus = await db.onBoardingStatus.update({
      where: {
        id: onBoardingStatus.id,
      },
      data: {
        onBoardingStatus: "skipped",
      },
    });

    return NextResponse.json({
      message: "Onboarding skipped successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to skip onboarding",
      },
      { status: 500 }
    );
  }
}
