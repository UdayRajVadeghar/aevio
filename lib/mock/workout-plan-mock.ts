import { WorkoutPlan } from "@/lib/types/workout";

/**
 * Mock workout plan data for testing and development
 * This is a complete 4-week beginner program focused on stress reduction
 */
export const mockWorkoutPlan: WorkoutPlan = {
  id: "wrk_3avjbrs7",
  version: 1,
  generatedAt: "2025-12-02T19:51:38Z",
  planType: "program",
  name: "Beginner Stress-Reduction & Strength (4 Weeks)",
  description:
    "A 4-week program designed for beginner athletes with hypertension, focusing on stress reduction through a mix of strength, HIIT, and calisthenics. Targets back, legs, and abs using bands and dumbbells.",
  durationWeeks: 4,
  difficulty: "beginner",
  goal: "reduce_stress",
  aiContext: {
    userProfileSnapshot: {
      userId: "cmi8t0t5i0000yhkblzr9repl",
      age: 25,
      gender: "male",
      height: 170.0,
      weight: 70.0,
      activityLevel: "athlete",
      primaryGoal: "reduce_stress",
      dietaryPreference: "vegetarian",
      healthConditions: ["hypertension"],
      trainingExperience: "beginner",
      equipmentAvailable: ["bands", "dumbbells"],
      workoutDaysPerWeek: 5,
      preferredDuration: 90,
      trainingStyles: ["strength", "hiit", "calisthenics"],
      targetBodyParts: ["back", "legs", "abs"],
      exerciseDislikes: [],
      injuries: [],
      motivationStyle: "encouraging",
    },
    generationPrompt:
      "Generate a workout plan for a beginner athlete (male, 25, 170cm/70kg) with hypertension. Primary goal is stress reduction. Equipment: bands, dumbbells. Prefers 5 workouts/week, 90 mins, strength, HIIT, calisthenics. Targets back, legs, abs. No dislikes/injuries. Motivated by encouragement.",
    modelVersion: "1.0",
  },
  phases: [
    {
      id: "phase_1_zzg6pw2u",
      name: "Foundational Stress-Reduction & Strength",
      objective:
        "Build consistent training habits, improve fundamental strength, and reduce stress through varied workouts.",
      weekStart: 1,
      weekEnd: 4,
      weeks: [
        {
          weekNumber: 1,
          focus: "Technique & Consistency",
          isDeload: false,
          days: [
            {
              id: "w1_d1_sutkoiwb",
              dayNumber: 1,
              name: "Upper Body & Core Strength",
              targetDuration: 75,
              muscleGroups: ["back", "chest", "shoulders", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_3sn4zb39",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_04klanu1",
                      name: "Dumbbell Bent-Over Row",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back"],
                        secondary: ["biceps", "rear_delts"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 12,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Rows"],
                      cues: [
                        "Maintain a flat back",
                        "Squeeze shoulder blades",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Rounding the back",
                        "Using too much momentum",
                      ],
                    },
                    {
                      id: "ex_v5r2ctpx",
                      name: "Dumbbell Floor Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["chest"],
                        secondary: ["triceps", "shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 12,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Push-ups (band assisted)"],
                      cues: [
                        "Elbows at 45 degrees",
                        "Control the descent",
                        "Drive through the dumbbells",
                      ],
                      commonMistakes: [
                        "Flaring elbows too wide",
                        "Bouncing off the floor",
                      ],
                    },
                    {
                      id: "ex_g1prn44x",
                      name: "Dumbbell Bicep Curl",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["biceps"],
                        secondary: ["forearms"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 7.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 7.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Bicep Curls"],
                      cues: [
                        "Keep elbows tucked",
                        "Squeeze at the top",
                        "Control the eccentric",
                      ],
                      commonMistakes: [
                        "Swinging the weights",
                        "Using shoulders to lift",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_245ufvin",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_oiwcnuyw",
                      name: "Push-ups (Band Assisted)",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["chest", "triceps"],
                        secondary: ["shoulders", "core"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: ["Knee Push-ups"],
                      cues: [
                        "Maintain a straight line from head to heels",
                        "Control the movement",
                      ],
                      commonMistakes: ["Sagging hips", "Flaring elbows"],
                    },
                    {
                      id: "ex_m86f574q",
                      name: "Banded Face Pulls",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["rear_delts", "upper_back"],
                        secondary: ["biceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Rear Delt Flyes"],
                      cues: [
                        "Pull towards your face",
                        "Squeeze shoulder blades",
                        "External rotation",
                      ],
                      commonMistakes: ["Using momentum", "Shrugging shoulders"],
                    },
                    {
                      id: "ex_ixs16ngo",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Brace abs",
                        "Don't let hips sag",
                      ],
                      commonMistakes: [
                        "Hips too high or too low",
                        "Rounding the back",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w1_d2_djg10v07",
              dayNumber: 2,
              name: "Lower Body & Abs Strength",
              targetDuration: 75,
              muscleGroups: ["legs", "glutes", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_luxkvunz",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_62yn22v8",
                      name: "Goblet Squat (Dumbbell)",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["quads", "glutes"],
                        secondary: ["hamstrings", "core"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 12,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Squats"],
                      cues: [
                        "Keep chest up",
                        "Knees out over toes",
                        "Go as deep as comfortable",
                      ],
                      commonMistakes: ["Rounding back", "Knees caving in"],
                    },
                    {
                      id: "ex_wi0ayazw",
                      name: "Dumbbell Romanian Deadlift",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["hamstrings", "glutes"],
                        secondary: ["lower_back"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 12,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Good Mornings (Banded)"],
                      cues: [
                        "Keep a slight bend in knees",
                        "Push hips back",
                        "Feel stretch in hamstrings",
                      ],
                      commonMistakes: [
                        "Rounding back",
                        "Squatting instead of hinging",
                      ],
                    },
                    {
                      id: "ex_lzqgnqar",
                      name: "Banded Glute Bridge",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Hip Thrusts (bodyweight)"],
                      cues: [
                        "Squeeze glutes at the top",
                        "Push knees out against band",
                      ],
                      commonMistakes: [
                        "Arching lower back",
                        "Not fully extending hips",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_m8s27cxp",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_754y0a00",
                      name: "Dumbbell Calf Raises",
                      equipment: ["dumbbells"],
                      muscleGroups: { primary: ["calves"], secondary: [] },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: ["Bodyweight Calf Raises"],
                      cues: ["Go to full extension", "Control the negative"],
                      commonMistakes: [
                        "Rushing the movement",
                        "Not going full range of motion",
                      ],
                    },
                    {
                      id: "ex_ljmb3a60",
                      name: "Leg Raises",
                      equipment: [],
                      muscleGroups: {
                        primary: ["abs"],
                        secondary: ["hip_flexors"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Knee Tucks"],
                      cues: [
                        "Keep lower back pressed to floor",
                        "Control the descent",
                      ],
                      commonMistakes: ["Arching lower back", "Using momentum"],
                    },
                    {
                      id: "ex_t9yw0zim",
                      name: "Banded Side Walk",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hip_flexors"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Clamshells"],
                      cues: [
                        "Stay in a semi-squat position",
                        "Lead with the knee",
                        "Keep tension on the band",
                      ],
                      commonMistakes: [
                        "Standing too upright",
                        "Not maintaining band tension",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w1_d3_xmcn6mzk",
              dayNumber: 3,
              name: "HIIT & Calisthenics Circuit",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_cismao0c",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_abibm4dl",
                      name: "Jumping Jacks",
                      equipment: [],
                      muscleGroups: { primary: ["full_body"], secondary: [] },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                        },
                      ],
                      restBetweenSets: 15,
                      alternatives: ["Step Jacks"],
                      cues: ["Maintain a rhythmic pace", "Light on your feet"],
                      commonMistakes: ["Slouching shoulders"],
                    },
                    {
                      id: "ex_1zqu04hf",
                      name: "Bodyweight Squats",
                      equipment: [],
                      muscleGroups: {
                        primary: ["quads", "glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 15 }],
                      restBetweenSets: 15,
                      alternatives: ["Box Squats"],
                      cues: ["Chest up, hips back", "Knees out"],
                      commonMistakes: ["Knees caving in", "Rounding back"],
                    },
                    {
                      id: "ex_ap8a4ced",
                      name: "Mountain Climbers",
                      equipment: [],
                      muscleGroups: {
                        primary: ["abs", "core"],
                        secondary: ["shoulders", "quads"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                        },
                      ],
                      restBetweenSets: 15,
                      alternatives: ["Plank knee to elbow"],
                      cues: ["Keep hips stable", "Drive knees to chest"],
                      commonMistakes: [
                        "Raising hips too high",
                        "Too much bouncing",
                      ],
                    },
                    {
                      id: "ex_x3e0d75z",
                      name: "Burpees (Modified)",
                      equipment: [],
                      muscleGroups: {
                        primary: ["full_body"],
                        secondary: ["core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 10 }],
                      restBetweenSets: 60,
                      alternatives: ["Squat Thrusts"],
                      cues: [
                        "Step back instead of jumping",
                        "Maintain control",
                      ],
                      commonMistakes: ["Sacrificing form for speed"],
                    },
                  ],
                },
                {
                  id: "block_2_mj8kheqs",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_hyl2w2qr",
                      name: "High Knees",
                      equipment: [],
                      muscleGroups: {
                        primary: ["legs", "core"],
                        secondary: [],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                        },
                      ],
                      restBetweenSets: 15,
                      alternatives: ["Marching in place"],
                      cues: ["Drive knees up high", "Light on feet"],
                      commonMistakes: ["Shuffling feet"],
                    },
                    {
                      id: "ex_k9lnks1c",
                      name: "Glute Bridges (Bodyweight)",
                      equipment: [],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 20 }],
                      restBetweenSets: 15,
                      alternatives: ["Single Leg Glute Bridge"],
                      cues: ["Squeeze glutes at top", "Lift hips high"],
                      commonMistakes: ["Arching lower back"],
                    },
                  ],
                },
              ],
            },
            {
              id: "w1_d4_k22tsmgw",
              dayNumber: 4,
              name: "Upper Body & Abs Focus",
              targetDuration: 75,
              muscleGroups: ["back", "shoulders", "triceps", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_2twas5jd",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_6z64skh2",
                      name: "Dumbbell Overhead Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["shoulders"],
                        secondary: ["triceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 12,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 7.5,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 7.5,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Overhead Press"],
                      cues: [
                        "Brace core",
                        "Press straight up",
                        "Control the descent",
                      ],
                      commonMistakes: [
                        "Arching back excessively",
                        "Using legs to drive",
                      ],
                    },
                    {
                      id: "ex_ljalg2u9",
                      name: "Dumbbell Pullover",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back", "chest"],
                        secondary: ["triceps", "serratus_anterior"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Pull-aparts"],
                      cues: [
                        "Keep slight bend in elbows",
                        "Feel stretch in lats",
                        "Controlled movement",
                      ],
                      commonMistakes: [
                        "Bending arms too much",
                        "Using momentum",
                      ],
                    },
                    {
                      id: "ex_0mdob01l",
                      name: "Dumbbell Tricep Extension (overhead)",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["triceps"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 7.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 7.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Tricep Pushdowns"],
                      cues: [
                        "Keep elbows close to head",
                        "Full extension",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Flaring elbows out",
                        "Using shoulders to assist",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_7iwb8i1m",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_kmewcjnf",
                      name: "Bird-Dog",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core"],
                        secondary: ["glutes", "lower_back"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 6,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 7,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: [],
                      cues: [
                        "Maintain neutral spine",
                        "Slow and controlled",
                        "Extend opposite arm and leg",
                      ],
                      commonMistakes: ["Arching back", "Losing balance"],
                    },
                    {
                      id: "ex_llxflzom",
                      name: "Side Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["obliques", "core"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Stack hips",
                        "Brace core",
                      ],
                      commonMistakes: ["Hips sagging", "Rounding shoulders"],
                    },
                  ],
                },
              ],
            },
            {
              id: "w1_d5_doh69kga",
              dayNumber: 5,
              name: "Full Body Calisthenics & Cardio",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_2mtx1ueb",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_4g7zrvy7",
                      name: "Jumping Jacks",
                      equipment: [],
                      muscleGroups: { primary: ["full_body"], secondary: [] },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                        },
                      ],
                      restBetweenSets: 15,
                      alternatives: ["Step Jacks"],
                      cues: ["Maintain a rhythmic pace", "Light on your feet"],
                      commonMistakes: ["Slouching shoulders"],
                    },
                    {
                      id: "ex_nianri01",
                      name: "Bodyweight Lunges",
                      equipment: [],
                      muscleGroups: {
                        primary: ["quads", "glutes", "hamstrings"],
                        secondary: ["core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 10 }],
                      restBetweenSets: 15,
                      alternatives: ["Split Squats"],
                      cues: [
                        "Step forward, knee over ankle",
                        "Keep torso upright",
                      ],
                      commonMistakes: [
                        "Knee collapsing inward",
                        "Leaning too far forward",
                      ],
                    },
                    {
                      id: "ex_guo4kl0v",
                      name: "Push-ups",
                      equipment: [],
                      muscleGroups: {
                        primary: ["chest", "triceps"],
                        secondary: ["shoulders", "core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 10 }],
                      restBetweenSets: 15,
                      alternatives: ["Knee Push-ups", "Incline Push-ups"],
                      cues: [
                        "Maintain a straight line",
                        "Control the movement",
                      ],
                      commonMistakes: ["Sagging hips", "Flaring elbows"],
                    },
                    {
                      id: "ex_h2xpzmll",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: ["Keep body in a straight line", "Brace abs"],
                      commonMistakes: ["Hips too high or too low"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          weekNumber: 2,
          focus: "Progressive Overload",
          isDeload: false,
          days: [
            {
              id: "w2_d1_mdi1z19e",
              dayNumber: 1,
              name: "Upper Body & Core Strength",
              targetDuration: 75,
              muscleGroups: ["back", "chest", "shoulders", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_g10pyg5n",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_yodtmbdz",
                      name: "Dumbbell Bent-Over Row",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back"],
                        secondary: ["biceps", "rear_delts"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Rows"],
                      cues: [
                        "Maintain a flat back",
                        "Squeeze shoulder blades",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Rounding the back",
                        "Using too much momentum",
                      ],
                    },
                    {
                      id: "ex_vqlu9n7c",
                      name: "Dumbbell Floor Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["chest"],
                        secondary: ["triceps", "shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Push-ups (band assisted)"],
                      cues: [
                        "Elbows at 45 degrees",
                        "Control the descent",
                        "Drive through the dumbbells",
                      ],
                      commonMistakes: [
                        "Flaring elbows too wide",
                        "Bouncing off the floor",
                      ],
                    },
                    {
                      id: "ex_47qfkhpl",
                      name: "Dumbbell Bicep Curl",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["biceps"],
                        secondary: ["forearms"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Bicep Curls"],
                      cues: [
                        "Keep elbows tucked",
                        "Squeeze at the top",
                        "Control the eccentric",
                      ],
                      commonMistakes: [
                        "Swinging the weights",
                        "Using shoulders to lift",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_x4joces5",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_qxiszio9",
                      name: "Push-ups (Band Assisted)",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["chest", "triceps"],
                        secondary: ["shoulders", "core"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: ["Knee Push-ups"],
                      cues: [
                        "Maintain a straight line from head to heels",
                        "Control the movement",
                      ],
                      commonMistakes: ["Sagging hips", "Flaring elbows"],
                    },
                    {
                      id: "ex_4v3fc9ph",
                      name: "Banded Face Pulls",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["rear_delts", "upper_back"],
                        secondary: ["biceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Rear Delt Flyes"],
                      cues: [
                        "Pull towards your face",
                        "Squeeze shoulder blades",
                        "External rotation",
                      ],
                      commonMistakes: ["Using momentum", "Shrugging shoulders"],
                    },
                    {
                      id: "ex_t1pucme9",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Brace abs",
                        "Don't let hips sag",
                      ],
                      commonMistakes: [
                        "Hips too high or too low",
                        "Rounding the back",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w2_d2_khmojhr9",
              dayNumber: 2,
              name: "Lower Body & Abs Strength",
              targetDuration: 75,
              muscleGroups: ["legs", "glutes", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_ks3r5ktl",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_5y42qgco",
                      name: "Goblet Squat (Dumbbell)",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["quads", "glutes"],
                        secondary: ["hamstrings", "core"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Squats"],
                      cues: [
                        "Keep chest up",
                        "Knees out over toes",
                        "Go as deep as comfortable",
                      ],
                      commonMistakes: ["Rounding back", "Knees caving in"],
                    },
                    {
                      id: "ex_p80so4gx",
                      name: "Dumbbell Romanian Deadlift",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["hamstrings", "glutes"],
                        secondary: ["lower_back"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Good Mornings (Banded)"],
                      cues: [
                        "Keep a slight bend in knees",
                        "Push hips back",
                        "Feel stretch in hamstrings",
                      ],
                      commonMistakes: [
                        "Rounding back",
                        "Squatting instead of hinging",
                      ],
                    },
                    {
                      id: "ex_k9nci5ft",
                      name: "Banded Glute Bridge",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Hip Thrusts (bodyweight)"],
                      cues: [
                        "Squeeze glutes at the top",
                        "Push knees out against band",
                      ],
                      commonMistakes: [
                        "Arching lower back",
                        "Not fully extending hips",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_j0achs76",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_z5j418p9",
                      name: "Dumbbell Calf Raises",
                      equipment: ["dumbbells"],
                      muscleGroups: { primary: ["calves"], secondary: [] },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: ["Bodyweight Calf Raises"],
                      cues: ["Go to full extension", "Control the negative"],
                      commonMistakes: [
                        "Rushing the movement",
                        "Not going full range of motion",
                      ],
                    },
                    {
                      id: "ex_trq2nf79",
                      name: "Leg Raises",
                      equipment: [],
                      muscleGroups: {
                        primary: ["abs"],
                        secondary: ["hip_flexors"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Knee Tucks"],
                      cues: [
                        "Keep lower back pressed to floor",
                        "Control the descent",
                      ],
                      commonMistakes: ["Arching lower back", "Using momentum"],
                    },
                    {
                      id: "ex_01r9n5dc",
                      name: "Banded Side Walk",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hip_flexors"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Clamshells"],
                      cues: [
                        "Stay in a semi-squat position",
                        "Lead with the knee",
                        "Keep tension on the band",
                      ],
                      commonMistakes: [
                        "Standing too upright",
                        "Not maintaining band tension",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w2_d3_30l1ie29",
              dayNumber: 3,
              name: "HIIT & Calisthenics Circuit",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_mxy2qb72",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_e3g7lf05",
                      name: "Jumping Jacks",
                      equipment: [],
                      muscleGroups: { primary: ["full_body"], secondary: [] },
                      sets: [{ setNumber: 1, type: "working", targetReps: 1 }],
                      restBetweenSets: 15,
                      alternatives: ["Step Jacks"],
                      cues: ["Maintain a rhythmic pace", "Light on your feet"],
                      commonMistakes: ["Slouching shoulders"],
                    },
                    {
                      id: "ex_6pst4n13",
                      name: "Bodyweight Squats",
                      equipment: [],
                      muscleGroups: {
                        primary: ["quads", "glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 15 }],
                      restBetweenSets: 15,
                      alternatives: ["Box Squats"],
                      cues: ["Chest up, hips back", "Knees out"],
                      commonMistakes: ["Knees caving in", "Rounding back"],
                    },
                    {
                      id: "ex_ae8zg9bk",
                      name: "Mountain Climbers",
                      equipment: [],
                      muscleGroups: {
                        primary: ["abs", "core"],
                        secondary: ["shoulders", "quads"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 1 }],
                      restBetweenSets: 15,
                      alternatives: ["Plank knee to elbow"],
                      cues: ["Keep hips stable", "Drive knees to chest"],
                      commonMistakes: [
                        "Raising hips too high",
                        "Too much bouncing",
                      ],
                    },
                    {
                      id: "ex_n91at33p",
                      name: "Burpees (Modified)",
                      equipment: [],
                      muscleGroups: {
                        primary: ["full_body"],
                        secondary: ["core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 12 }],
                      restBetweenSets: 60,
                      alternatives: ["Squat Thrusts"],
                      cues: [
                        "Step back instead of jumping",
                        "Maintain control",
                      ],
                      commonMistakes: ["Sacrificing form for speed"],
                    },
                  ],
                },
                {
                  id: "block_2_70fuijwz",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_0cj0se5b",
                      name: "High Knees",
                      equipment: [],
                      muscleGroups: {
                        primary: ["legs", "core"],
                        secondary: [],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 1 }],
                      restBetweenSets: 15,
                      alternatives: ["Marching in place"],
                      cues: ["Drive knees up high", "Light on feet"],
                      commonMistakes: ["Shuffling feet"],
                    },
                    {
                      id: "ex_cg43gta3",
                      name: "Glute Bridges (Bodyweight)",
                      equipment: [],
                      muscleGroups: {
                        primary: ["glutes"],
                        secondary: ["hamstrings"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 20 }],
                      restBetweenSets: 15,
                      alternatives: ["Single Leg Glute Bridge"],
                      cues: ["Squeeze glutes at top", "Lift hips high"],
                      commonMistakes: ["Arching lower back"],
                    },
                  ],
                },
              ],
            },
            {
              id: "w2_d4_kshj3hyk",
              dayNumber: 4,
              name: "Upper Body & Abs Focus",
              targetDuration: 75,
              muscleGroups: ["back", "shoulders", "triceps", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_6qqvfnl7",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_l0lvtyo0",
                      name: "Dumbbell Overhead Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["shoulders"],
                        secondary: ["triceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Overhead Press"],
                      cues: [
                        "Brace core",
                        "Press straight up",
                        "Control the descent",
                      ],
                      commonMistakes: [
                        "Arching back excessively",
                        "Using legs to drive",
                      ],
                    },
                    {
                      id: "ex_d9l90sn0",
                      name: "Dumbbell Pullover",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back", "chest"],
                        secondary: ["triceps", "serratus_anterior"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 12.5,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 12.5,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Pull-aparts"],
                      cues: [
                        "Keep slight bend in elbows",
                        "Feel stretch in lats",
                        "Controlled movement",
                      ],
                      commonMistakes: [
                        "Bending arms too much",
                        "Using momentum",
                      ],
                    },
                    {
                      id: "ex_2vgag6uq",
                      name: "Dumbbell Tricep Extension (overhead)",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["triceps"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Tricep Pushdowns"],
                      cues: [
                        "Keep elbows close to head",
                        "Full extension",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Flaring elbows out",
                        "Using shoulders to assist",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_epxho8fq",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_g1wrdd1a",
                      name: "Bird-Dog",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core"],
                        secondary: ["glutes", "lower_back"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: [],
                      cues: [
                        "Maintain neutral spine",
                        "Slow and controlled",
                        "Extend opposite arm and leg",
                      ],
                      commonMistakes: ["Arching back", "Losing balance"],
                    },
                    {
                      id: "ex_wid2pg37",
                      name: "Side Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["obliques", "core"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Stack hips",
                        "Brace core",
                      ],
                      commonMistakes: ["Hips sagging", "Rounding shoulders"],
                    },
                  ],
                },
              ],
            },
            {
              id: "w2_d5_moflhust",
              dayNumber: 5,
              name: "Full Body Calisthenics & Cardio",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_1mt987ud",
                  type: "circuit",
                  exercises: [
                    {
                      id: "ex_l3ktje31",
                      name: "Jumping Jacks",
                      equipment: [],
                      muscleGroups: { primary: ["full_body"], secondary: [] },
                      sets: [{ setNumber: 1, type: "working", targetReps: 1 }],
                      restBetweenSets: 15,
                      alternatives: ["Step Jacks"],
                      cues: ["Maintain a rhythmic pace", "Light on your feet"],
                      commonMistakes: ["Slouching shoulders"],
                    },
                    {
                      id: "ex_bldtwtp4",
                      name: "Bodyweight Lunges",
                      equipment: [],
                      muscleGroups: {
                        primary: ["quads", "glutes", "hamstrings"],
                        secondary: ["core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 12 }],
                      restBetweenSets: 15,
                      alternatives: ["Split Squats"],
                      cues: [
                        "Step forward, knee over ankle",
                        "Keep torso upright",
                      ],
                      commonMistakes: [
                        "Knee collapsing inward",
                        "Leaning too far forward",
                      ],
                    },
                    {
                      id: "ex_ljzbjxi9",
                      name: "Push-ups",
                      equipment: [],
                      muscleGroups: {
                        primary: ["chest", "triceps"],
                        secondary: ["shoulders", "core"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 12 }],
                      restBetweenSets: 15,
                      alternatives: ["Knee Push-ups", "Incline Push-ups"],
                      cues: [
                        "Maintain a straight line",
                        "Control the movement",
                      ],
                      commonMistakes: ["Sagging hips", "Flaring elbows"],
                    },
                    {
                      id: "ex_7gaih8h4",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [{ setNumber: 1, type: "working", targetReps: 1 }],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: ["Keep body in a straight line", "Brace abs"],
                      commonMistakes: ["Hips too high or too low"],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          weekNumber: 3,
          focus: "Intensity & Endurance",
          isDeload: false,
          days: [
            {
              id: "w3_d1_cdjp46ny",
              dayNumber: 1,
              name: "Upper Body & Core Strength",
              targetDuration: 75,
              muscleGroups: ["back", "chest", "shoulders", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_jdxg6z16",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_2mh7to27",
                      name: "Dumbbell Bent-Over Row",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back"],
                        secondary: ["biceps", "rear_delts"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 120,
                      alternatives: ["Banded Rows"],
                      cues: [
                        "Maintain a flat back",
                        "Squeeze shoulder blades",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Rounding the back",
                        "Using too much momentum",
                      ],
                    },
                    {
                      id: "ex_4v9ml3yd",
                      name: "Dumbbell Floor Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["chest"],
                        secondary: ["triceps", "shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 15,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 3,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 15,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 120,
                      alternatives: ["Push-ups (band assisted)"],
                      cues: [
                        "Elbows at 45 degrees",
                        "Control the descent",
                        "Drive through the dumbbells",
                      ],
                      commonMistakes: [
                        "Flaring elbows too wide",
                        "Bouncing off the floor",
                      ],
                    },
                    {
                      id: "ex_5tvhv8yl",
                      name: "Dumbbell Bicep Curl",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["biceps"],
                        secondary: ["forearms"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 10,
                          targetWeight: 10,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Banded Bicep Curls"],
                      cues: [
                        "Keep elbows tucked",
                        "Squeeze at the top",
                        "Control the eccentric",
                      ],
                      commonMistakes: [
                        "Swinging the weights",
                        "Using shoulders to lift",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_psai5um6",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_r7bol1i0",
                      name: "Push-ups",
                      equipment: [],
                      muscleGroups: {
                        primary: ["chest", "triceps"],
                        secondary: ["shoulders", "core"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 12,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 12,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 0,
                      alternatives: ["Knee Push-ups"],
                      cues: [
                        "Maintain a straight line from head to heels",
                        "Control the movement",
                      ],
                      commonMistakes: ["Sagging hips", "Flaring elbows"],
                    },
                    {
                      id: "ex_yu3pdpmf",
                      name: "Banded Face Pulls",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["rear_delts", "upper_back"],
                        secondary: ["biceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 20,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 20,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Rear Delt Flyes"],
                      cues: [
                        "Pull towards your face",
                        "Squeeze shoulder blades",
                        "External rotation",
                      ],
                      commonMistakes: ["Using momentum", "Shrugging shoulders"],
                    },
                    {
                      id: "ex_lp52vq5l",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 7,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 8,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Brace abs",
                        "Don't let hips sag",
                      ],
                      commonMistakes: [
                        "Hips too high or too low",
                        "Rounding the back",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w3_d2_d78sijh5",
              dayNumber: 2,
              name: "Lower Body & Abs Strength",
              targetDuration: 75,
              muscleGroups: ["legs", "glutes", "abs"],
              restDay: false,
              blocks: [],
            },
            {
              id: "w3_d3_kpzvrdk7",
              dayNumber: 3,
              name: "HIIT & Calisthenics Circuit",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [],
            },
            {
              id: "w3_d4_9gfs3df1",
              dayNumber: 4,
              name: "Upper Body & Abs Focus",
              targetDuration: 75,
              muscleGroups: ["back", "shoulders", "triceps", "abs"],
              restDay: false,
              blocks: [],
            },
            {
              id: "w3_d5_0p8oqr13",
              dayNumber: 5,
              name: "Full Body Calisthenics & Cardio",
              targetDuration: 60,
              muscleGroups: ["full_body", "core"],
              restDay: false,
              blocks: [],
            },
          ],
        },
        {
          weekNumber: 4,
          focus: "Active Recovery / Deload",
          isDeload: true,
          days: [
            {
              id: "w4_d1_7epprcgu",
              dayNumber: 1,
              name: "Upper Body & Core (Reduced Volume)",
              targetDuration: 60,
              muscleGroups: ["back", "chest", "shoulders", "abs"],
              restDay: false,
              blocks: [
                {
                  id: "block_1_0nvzyuhs",
                  type: "straight",
                  exercises: [
                    {
                      id: "ex_fzvums4s",
                      name: "Dumbbell Bent-Over Row",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["back"],
                        secondary: ["biceps", "rear_delts"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 7.5,
                          targetRpe: 5,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Banded Rows"],
                      cues: [
                        "Maintain a flat back",
                        "Squeeze shoulder blades",
                        "Control the negative",
                      ],
                      commonMistakes: [
                        "Rounding the back",
                        "Using too much momentum",
                      ],
                    },
                    {
                      id: "ex_r3eamr37",
                      name: "Dumbbell Floor Press",
                      equipment: ["dumbbells"],
                      muscleGroups: {
                        primary: ["chest"],
                        secondary: ["triceps", "shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "warmup",
                          targetReps: 10,
                          targetWeight: 5,
                        },
                        {
                          setNumber: 2,
                          type: "working",
                          targetReps: 8,
                          targetWeight: 7.5,
                          targetRpe: 5,
                        },
                      ],
                      restBetweenSets: 90,
                      alternatives: ["Push-ups (band assisted)"],
                      cues: [
                        "Elbows at 45 degrees",
                        "Control the descent",
                        "Drive through the dumbbells",
                      ],
                      commonMistakes: [
                        "Flaring elbows too wide",
                        "Bouncing off the floor",
                      ],
                    },
                  ],
                },
                {
                  id: "block_2_hxuuvzqx",
                  type: "superset",
                  exercises: [
                    {
                      id: "ex_dndxf9y0",
                      name: "Banded Face Pulls",
                      equipment: ["bands"],
                      muscleGroups: {
                        primary: ["rear_delts", "upper_back"],
                        secondary: ["biceps"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 15,
                          targetRpe: 5,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Dumbbell Rear Delt Flyes"],
                      cues: [
                        "Pull towards your face",
                        "Squeeze shoulder blades",
                        "External rotation",
                      ],
                      commonMistakes: ["Using momentum", "Shrugging shoulders"],
                    },
                    {
                      id: "ex_5ofkt8s4",
                      name: "Plank",
                      equipment: [],
                      muscleGroups: {
                        primary: ["core", "abs"],
                        secondary: ["shoulders"],
                      },
                      sets: [
                        {
                          setNumber: 1,
                          type: "working",
                          targetReps: 1,
                          targetRpe: 5,
                        },
                      ],
                      restBetweenSets: 60,
                      alternatives: ["Side Plank"],
                      cues: [
                        "Keep body in a straight line",
                        "Brace abs",
                        "Don't let hips sag",
                      ],
                      commonMistakes: [
                        "Hips too high or too low",
                        "Rounding the back",
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "w4_d2_5yrha9iw",
              dayNumber: 2,
              name: "Lower Body & Abs (Reduced Volume)",
              targetDuration: 60,
              muscleGroups: ["legs", "glutes", "abs"],
              restDay: false,
              blocks: [],
            },
            {
              id: "w4_d3_5l8hpic0",
              dayNumber: 3,
              name: "Active Recovery / Mobility",
              targetDuration: 45,
              muscleGroups: ["full_body"],
              restDay: true,
              blocks: [],
            },
            {
              id: "w4_d4_aunq7b3e",
              dayNumber: 4,
              name: "Rest Day",
              targetDuration: 0,
              muscleGroups: [],
              restDay: true,
              blocks: [],
            },
            {
              id: "w4_d5_5ri6ly8l",
              dayNumber: 5,
              name: "Rest Day",
              targetDuration: 0,
              muscleGroups: [],
              restDay: true,
              blocks: [],
            },
          ],
        },
      ],
    },
  ],
  progress: {
    currentWeek: 1,
    currentDay: 1,
    completedWorkouts: [],
    personalRecords: {},
    feedback: [],
  },
};
