import "dotenv/config";
import pg from "pg";

const SQL = `
CREATE TABLE IF NOT EXISTS "meal_analysis" (
  "id"         TEXT PRIMARY KEY,
  "userId"     TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "imageUrl"   TEXT NOT NULL,
  "gcsUri"     TEXT NOT NULL,
  "status"     TEXT NOT NULL DEFAULT 'PENDING',
  "calories"   DOUBLE PRECISION,
  "protein"    DOUBLE PRECISION,
  "carbs"      DOUBLE PRECISION,
  "fat"        DOUBLE PRECISION,
  "foodItems"  JSONB,
  "errorMsg"   TEXT,
  "loggedAtIst" TIMESTAMP(3),
  "loggedDateIst" TEXT,
  "loggedTimezone" TEXT,
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "meal_analysis"
  ADD COLUMN IF NOT EXISTS "loggedAtIst" TIMESTAMP(3);
ALTER TABLE "meal_analysis"
  ADD COLUMN IF NOT EXISTS "loggedDateIst" TEXT;
ALTER TABLE "meal_analysis"
  ADD COLUMN IF NOT EXISTS "loggedTimezone" TEXT;

CREATE INDEX IF NOT EXISTS "meal_analysis_userId_createdAt_idx"
  ON "meal_analysis" ("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "meal_analysis_userId_loggedDateIst_idx"
  ON "meal_analysis" ("userId", "loggedDateIst");

CREATE TABLE IF NOT EXISTS "user_daily_calories" (
  "id"            TEXT PRIMARY KEY,
  "userId"        TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "dateKey"       TEXT NOT NULL,
  "timezone"      TEXT NOT NULL,
  "totalCalories" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"     TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "user_daily_calories_userId_dateKey_key"
  ON "user_daily_calories" ("userId", "dateKey");

CREATE TABLE IF NOT EXISTS "coach_contexts" (
  "id" TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "historySummary" TEXT NOT NULL,
  "threeMonthsContext" JSONB NOT NULL,
  "twoMonthsContext" JSONB NOT NULL,
  "oneMonthContext" JSONB NOT NULL,
  "twoWeeksContext" JSONB NOT NULL,
  "oneWeekContext" JSONB NOT NULL,
  "todayContext" JSONB NOT NULL,
  "source" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE UNIQUE INDEX IF NOT EXISTS "coach_contexts_userId_key"
  ON "coach_contexts" ("userId");
CREATE INDEX IF NOT EXISTS "coach_contexts_updatedAt_idx"
  ON "coach_contexts" ("updatedAt");
`;

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(SQL);
    console.log("meal analysis and coach context tables ready");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
