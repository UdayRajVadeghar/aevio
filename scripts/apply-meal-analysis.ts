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
  "createdAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt"  TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "meal_analysis_userId_createdAt_idx"
  ON "meal_analysis" ("userId", "createdAt");
`;

async function main() {
  const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
  try {
    await pool.query(SQL);
    console.log("meal_analysis table ready");
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
