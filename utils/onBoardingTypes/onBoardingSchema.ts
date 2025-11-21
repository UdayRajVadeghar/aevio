import { z } from "zod";

export const onBoardingDataSchema = z
  .object({
    basicProfile: z.object({
      name: z
        .string()
        .min(1, "Please enter your name")
        .max(100, "Name must be less than 100 characters"),
      dob: z.coerce.date(),
      gender: z.string().min(1, "Please select a gender"),
    }),
    healthWellness: z.object({
      height: z
        .number()
        .min(120, "Height must be between 120 and 220 cm")
        .max(220, "Height must be between 120 and 220 cm"),
      weight: z
        .number()
        .min(30, "Weight must be between 30 and 200 kg")
        .max(200, "Weight must be between 30 and 200 kg"),
      activityLevel: z.string().min(1, "Please select an activity level"),
      primaryGoal: z.string().min(1, "Please select a primary goal"),
      dietaryPreference: z.string().optional(),
    }),
    journaling: z.object({
      journalingStyle: z.string().min(1, "Please select a journaling style"),
      journalingTimeOfDay: z
        .string()
        .min(1, "Please select a journaling time of day"),
      moodTrackingEnabled: z.boolean().default(false),
    }),
    habits: z.array(
      z
        .object({
          name: z.string().min(1, "Please select a habit name"),
          type: z.string(),
          target: z.number(),
          unit: z.string(),
          enabled: z.boolean(),
        })
        .optional()
    ),
    healthConditions: z.array(z.string()).optional(),
    consent: z.boolean().default(false),
    goal: z
      .string()
      .min(1, "Please enter your 30 day goal")
      .max(200, "Goal must be less than 200 characters"),
  })
  .optional();
