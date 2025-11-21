import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Fetch user with profile and habits
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        profile: {
          select: {
            id: true,
            dateOfBirth: true,
            age: true,
            gender: true,
            height: true,
            weight: true,
            activityLevel: true,
            primaryGoal: true,
            dietaryPreference: true,
            journalingStyle: true,
            journalingTimeOfDay: true,
            moodTrackingEnabled: true,
            healthConditions: true,
            thirtyDayGoal: true,
            onboardingCompleted: true,
            habits: {
              select: {
                id: true,
                name: true,
                type: true,
                target: true,
                unit: true,
                enabled: true,
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.profile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    // Transform the data to match the profile page structure
    const profileData = {
      basicProfile: {
        name: user.name,
        dob: user.profile.dateOfBirth,
        gender: user.profile.gender,
      },
      healthWellness: {
        height: user.profile.height,
        weight: user.profile.weight,
        activityLevel: user.profile.activityLevel,
        primaryGoal: user.profile.primaryGoal,
        dietaryPreference: user.profile.dietaryPreference,
      },
      journaling: {
        journalingStyle: user.profile.journalingStyle,
        journalingTimeOfDay: user.profile.journalingTimeOfDay,
        moodTrackingEnabled: user.profile.moodTrackingEnabled,
      },
      habits: user.profile.habits,
      healthConditions: user.profile.healthConditions,
      goal: user.profile.thirtyDayGoal,
    };

    return NextResponse.json(profileData, { status: 200 });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
