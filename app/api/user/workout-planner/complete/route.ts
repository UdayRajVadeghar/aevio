import { db } from "@/lib/db";
import { Prisma } from "@/lib/generated/prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for workout planner data validation
const workoutPlannerDataSchema = z.object({
  trainingExperience: z.string().optional(),
  motivationStyle: z.string().optional(),
  bodyFatPercentage: z.number().nullable().optional(),
  waistCircumference: z.number().nullable().optional(),
  hipCircumference: z.number().nullable().optional(),
  restingHeartRate: z.number().nullable().optional(),
  workType: z.string().optional(),
  stressLevel: z.number().min(1).max(5).optional(),
  sleepHours: z.number().nullable().optional(),
  stepCount: z.number().nullable().optional(),
  workoutDays: z.number().min(1).max(7).optional(),
  workoutDuration: z.number().optional(),
  trainingStyle: z.array(z.string()).optional(),
  targetBodyParts: z.array(z.string()).optional(),
  equipmentAvailable: z.array(z.string()).optional(),
  exerciseDislikes: z.array(z.string()).optional(),
  injuries: z
    .array(z.object({ description: z.string() }))
    .nullable()
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId, workoutPlannerData } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Validate the workout planner data
    const result = workoutPlannerDataSchema.safeParse(workoutPlannerData);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = result.data;

    // Check if user profile exists
    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      select: {
        id: true,
        workoutPlannerCompleted: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found. Please complete onboarding first." },
        { status: 404 }
      );
    }

    if (userProfile.workoutPlannerCompleted) {
      return NextResponse.json(
        { error: "Workout planner is already completed" },
        { status: 400 }
      );
    }

    // Convert equipmentAvailable array to JSON format for the schema
    const equipmentJson =
      data.equipmentAvailable && data.equipmentAvailable.length > 0
        ? data.equipmentAvailable.reduce((acc, item) => {
            acc[item] = true;
            return acc;
          }, {} as Record<string, boolean>)
        : Prisma.JsonNull;

    // Update the user profile with workout planner data
    await db.userProfile.update({
      where: { userId },
      data: {
        // Experience & Motivation
        trainingExperience: data.trainingExperience || null,
        motivationStyle: data.motivationStyle || null,

        // Body Composition
        bodyFatPercentage: data.bodyFatPercentage ?? null,
        waistCircumference: data.waistCircumference ?? null,
        hipCircumference: data.hipCircumference ?? null,
        restingHeartRate: data.restingHeartRate ?? null,

        // Lifestyle
        workType: data.workType || null,
        stressLevel: data.stressLevel ?? null,
        sleepHours: data.sleepHours ?? null,
        stepCount: data.stepCount ?? null,

        // Schedule
        workoutDays: data.workoutDays ?? null,
        workoutDuration: data.workoutDuration ?? null,

        // Preferences
        trainingStyle: data.trainingStyle || [],
        targetBodyParts: data.targetBodyParts || [],
        equipmentAvailable: equipmentJson,
        exerciseDislikes: data.exerciseDislikes || [],

        // Safety
        injuries: data.injuries ?? Prisma.JsonNull,

        // Mark workout planner as completed
        workoutPlannerCompleted: true,
      },
    });

    return NextResponse.json(
      { message: "Workout planner completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Workout planner error:", error);
    return NextResponse.json(
      { error: "Failed to complete workout planner" },
      { status: 500 }
    );
  }
}

// GET endpoint to check workout planner status
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

    const userProfile = await db.userProfile.findUnique({
      where: { userId },
      select: {
        workoutPlannerCompleted: true,
      },
    });

    if (!userProfile) {
      return NextResponse.json(
        { error: "User profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { completed: userProfile.workoutPlannerCompleted },
      { status: 200 }
    );
  } catch (error) {
    console.error("Workout planner status check error:", error);
    return NextResponse.json(
      { error: "Failed to check workout planner status" },
      { status: 500 }
    );
  }
}
