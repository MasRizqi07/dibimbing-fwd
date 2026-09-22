export function isIsolatedE2ERuntime(): boolean {
  if (process.env.E2E_TEST_MODE !== "1"
    || process.env.VERCEL === "1"
    || !process.env.TEST_DATABASE_URL
    || process.env.DATABASE_URL !== process.env.TEST_DATABASE_URL) return false;
  try {
    return ["localhost", "127.0.0.1", "[::1]"].includes(new URL(process.env.TEST_DATABASE_URL).hostname);
  } catch {
    return false;
  }
}
