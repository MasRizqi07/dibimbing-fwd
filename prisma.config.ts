import { defineConfig, env } from "prisma/config";
import fs from "node:fs";
import path from "node:path";

if (!process.env.DATABASE_URL) {
  try {
    if (typeof process.loadEnvFile === "function") {
      process.loadEnvFile(".env.local");
    } else {
      const envPath = path.resolve(process.cwd(), ".env.local");
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, "utf-8");
        for (const line of content.split("\n")) {
          const trimmed = line.trim();
          if (trimmed && !trimmed.startsWith("#") && trimmed.includes("=")) {
            const [key, ...rest] = trimmed.split("=");
            const val = rest.join("=").replace(/^["']|["']$/g, "");
            if (key && !process.env[key.trim()]) {
              process.env[key.trim()] = val.trim();
            }
          }
        }
      }
    }
  } catch {
    // Ignored in environments where process.env is injected directly (e.g. Vercel)
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "node --env-file=.env.local --experimental-strip-types prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});

