import { defineConfig, env } from "prisma/config";

if (!process.env.DATABASE_URL) {
  try {
    process.loadEnvFile?.(".env.local");
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

