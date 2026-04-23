import { GoogleGenAI } from "@google/genai";

export type FoodItem = {
  name: string;
  portion: string;
  calories: number;
};

export type MealAnalysisResult = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  foodItems: FoodItem[];
  confidence: "low" | "medium" | "high";
};

export type MealAnalysisResponse = {
  result: MealAnalysisResult;
  rawText: string;
};

const MODEL_ID = process.env.GEMINI_MODEL_ID ?? "gemini-3.1-pro-preview";

function getModelLocation(modelId: string): string {
  if (
    modelId === "gemini-3.1-pro-preview" ||
    modelId === "gemini-3-pro-preview"
  ) {
    return "global";
  }

  return process.env.GCP_LOCATION ?? "us-central1";
}

const SYSTEM_PROMPT = `You are a precise nutrition analyst. Given a single photo of food, identify every distinct item on the plate and estimate its portion size and calories.

Rules:
- Numbers must be best-effort numeric estimates, never strings or ranges.
- "protein", "carbs", and "fat" are grams for the entire meal.
- "calories" is total kcal for the entire meal.
- "foodItems[].calories" must sum approximately to the total "calories".
- "portion" is a short human-readable string like "1 cup", "~150g", "2 slices".
- "confidence" reflects how clearly identifiable the meal is: "high" for clearly plated single dishes, "medium" for mixed plates, "low" for blurry or ambiguous shots.
- If the image contains no food, return all zeros and an empty foodItems array with confidence "low".
- Output ONLY the JSON object, no prose, no markdown.`;

const RESPONSE_JSON_SCHEMA = {
  type: "object",
  properties: {
    calories: { type: "number" },
    protein: { type: "number" },
    carbs: { type: "number" },
    fat: { type: "number" },
    foodItems: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          portion: { type: "string" },
          calories: { type: "number" },
        },
        required: ["name", "portion", "calories"],
      },
    },
    confidence: {
      type: "string",
      enum: ["low", "medium", "high"],
    },
  },
  required: ["calories", "protein", "carbs", "fat", "foodItems", "confidence"],
} as const;

let cachedClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI {
  if (cachedClient) return cachedClient;
  const project = process.env.GCP_PROJECT_ID;
  const location = getModelLocation(MODEL_ID);
  if (!project) throw new Error("GCP_PROJECT_ID is not configured");
  cachedClient = new GoogleGenAI({
    vertexai: true,
    project,
    location,
  });
  return cachedClient;
}

function isValidResult(v: unknown): v is MealAnalysisResult {
  if (!v || typeof v !== "object") return false;
  const r = v as Record<string, unknown>;
  const numeric = ["calories", "protein", "carbs", "fat"] as const;
  for (const k of numeric) {
    if (typeof r[k] !== "number" || !Number.isFinite(r[k])) return false;
  }
  if (!Array.isArray(r.foodItems)) return false;
  for (const item of r.foodItems) {
    if (!item || typeof item !== "object") return false;
    const it = item as Record<string, unknown>;
    if (typeof it.name !== "string") return false;
    if (typeof it.portion !== "string") return false;
    if (typeof it.calories !== "number" || !Number.isFinite(it.calories))
      return false;
  }
  if (
    r.confidence !== "low" &&
    r.confidence !== "medium" &&
    r.confidence !== "high"
  ) {
    return false;
    1;
  }
  return true;
}

export async function analyzeMealFromGcs(
  gcsUri: string,
  mimeType: string,
): Promise<MealAnalysisResponse> {
  const resp = await getGenAI().models.generateContent({
    model: MODEL_ID,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      responseJsonSchema: RESPONSE_JSON_SCHEMA,
      systemInstruction: SYSTEM_PROMPT,
    },
    contents: [
      {
        role: "user",
        parts: [
          { fileData: { fileUri: gcsUri, mimeType } },
          {
            text: "Analyze this meal photo and return the nutrition JSON per the schema.",
          },
        ],
      },
    ],
  });

  const rawText = resp.text?.trim() ?? "";
  if (!rawText) {
    throw new Error("Gemini returned an empty response");
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    throw new Error(
      `Gemini returned non-JSON output: ${rawText.slice(0, 200)}`,
    );
  }

  if (!isValidResult(parsed)) {
    throw new Error(
      `Gemini response did not match schema: ${JSON.stringify(parsed).slice(0, 300)}`,
    );
  }

  return { result: parsed, rawText };
}
