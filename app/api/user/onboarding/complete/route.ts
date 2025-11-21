import { onBoardingDataSchema } from "@/app/utils/onBoardingTypes/onBoardingSchema";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, onBoardingData } = await req.json();

    if (!userId || !onBoardingData) {
      return NextResponse.json(
        { error: "User ID and onBoardingData are required" },
        { status: 400 }
      );
    }

    const result = onBoardingDataSchema.safeParse(onBoardingData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: "Invalid onboarding data" },
        { status: 400 }
      );
    }

    const {
      basicProfile,
      healthWellness,
      journaling,
      habits,
      healthConditions,
      consent,
      goal,
    } = result.data;

    console.log(result.data);

    const onBoardingStatus = await db.onBoardingStatus.findUnique({
      where: {
        userId: userId,
      },
      select: {
        id: true,
        onBoardingStatus: true,
      },
    });

    if (!onBoardingStatus || onBoardingStatus.id === null) {
      return NextResponse.json(
        { error: "Onboarding status not found" },
        { status: 404 }
      );
    }

    const status = onBoardingStatus.onBoardingStatus
      .toLowerCase()
      .toString()
      .trim();

    if (status === "completed") {
      return NextResponse.json(
        { message: "Onboarding is already completed" },
        { status: 400 }
      );
    }

    // Calculate age from date of birth
    const calculateAge = (dob: Date): number => {
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const monthDiff = today.getMonth() - dob.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && today.getDate() < dob.getDate())
      ) {
        age--;
      }
      return age;
    };

    // Use a transaction to ensure all operations succeed or fail together
    await db.$transaction(async (tx) => {
      // Upsert UserProfile (create or update)
      const userProfile = await tx.userProfile.upsert({
        where: { userId: userId },
        create: {
          userId: userId,
          // Basic Profile
          dateOfBirth: basicProfile.dob,
          age: calculateAge(basicProfile.dob),
          gender: basicProfile.gender,
          // Health & Wellness
          height: healthWellness.height,
          weight: healthWellness.weight,
          activityLevel: healthWellness.activityLevel,
          primaryGoal: healthWellness.primaryGoal,
          dietaryPreference: healthWellness.dietaryPreference,
          // Journaling
          journalingStyle: journaling.journalingStyle,
          journalingTimeOfDay: journaling.journalingTimeOfDay,
          moodTrackingEnabled: journaling.moodTrackingEnabled,
          // Health Conditions
          healthConditions: healthConditions || [],
          // Consent & Goals
          dataUsageConsent: consent,
          thirtyDayGoal: goal,
          // Onboarding Status
          onboardingCompleted: true,
        },
        update: {
          // Basic Profile
          dateOfBirth: basicProfile.dob,
          age: calculateAge(basicProfile.dob),
          gender: basicProfile.gender,
          // Health & Wellness
          height: healthWellness.height,
          weight: healthWellness.weight,
          activityLevel: healthWellness.activityLevel,
          primaryGoal: healthWellness.primaryGoal,
          dietaryPreference: healthWellness.dietaryPreference,
          // Journaling
          journalingStyle: journaling.journalingStyle,
          journalingTimeOfDay: journaling.journalingTimeOfDay,
          moodTrackingEnabled: journaling.moodTrackingEnabled,
          // Health Conditions
          healthConditions: healthConditions || [],
          // Consent & Goals
          dataUsageConsent: consent,
          thirtyDayGoal: goal,
          // Onboarding Status
          onboardingCompleted: true,
        },
      });

      // Update user name if provided
      if (basicProfile.name) {
        await tx.user.update({
          where: { id: userId },
          data: { name: basicProfile.name },
        });
      }

      // Delete existing habits for this profile to avoid duplicates
      await tx.habit.deleteMany({
        where: { profileId: userProfile.id },
      });

      // Create new habits if provided
      if (habits && habits.length > 0) {
        const validHabits = habits.filter(
          (habit): habit is NonNullable<typeof habit> => habit !== undefined
        );
        if (validHabits.length > 0) {
          await tx.habit.createMany({
            data: validHabits.map((habit) => ({
              profileId: userProfile.id,
              name: habit.name,
              type: habit.type,
              target: habit.target,
              unit: habit.unit,
              enabled: habit.enabled,
            })),
          });
        }
      }

      // Update onboarding status to completed
      await tx.onBoardingStatus.update({
        where: { id: onBoardingStatus.id },
        data: { onBoardingStatus: "completed" },
      });
    });

    return NextResponse.json(
      { message: "Onboarding completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to complete onboarding" },
      { status: 500 }
    );
  }
}
