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
    journaling: z
      .object({
        journalingStyle: z.string().optional().default(""),
        journalingTimeOfDay: z.string().optional().default(""),
        moodTrackingEnabled: z.boolean().default(false),
      })
      .optional()
      .default({
        journalingStyle: "",
        journalingTimeOfDay: "",
        moodTrackingEnabled: false,
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
      .max(200, "Goal must be less than 200 characters")
      .optional()
      .default(""),
    caloriesIntake: z
      .number()
      .int("Calories intake must be a whole number")
      .min(500, "Calories intake must be between 500 and 10000")
      .max(10000, "Calories intake must be between 500 and 10000")
      .optional(),
    calorieGoalEndDate: z.coerce.date().optional(),
  })
  .optional();
