import { defineConfig, devices } from "@playwright/test";
import bcrypt from "bcryptjs";

const integrationMode = process.env.E2E_TEST_MODE === "1";
if (integrationMode && !process.env.TEST_DATABASE_URL) {
  throw new Error("E2E_TEST_MODE requires an isolated TEST_DATABASE_URL.");
}
if (integrationMode && !["localhost", "127.0.0.1", "[::1]"].includes(new URL(process.env.TEST_DATABASE_URL!).hostname)) {
  throw new Error("E2E_TEST_MODE only accepts a local test database host.");
}

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: process.env.PLAYWRIGHT_TEST_BASE_URL
    ? undefined
    : {
        command: integrationMode ? "npm run build && npm run start" : "npm run start",
        url: "http://localhost:3000",
        reuseExistingServer: !integrationMode,
        timeout: 120_000,
        env: integrationMode ? {
          DATABASE_URL: process.env.TEST_DATABASE_URL!,
          TEST_DATABASE_URL: process.env.TEST_DATABASE_URL!,
          E2E_ADMIN_PASSWORD_HASH: bcrypt.hashSync("ci-e2e-password", 10),
          ADMIN_SESSION_SECRET: "test-only-admin-session-secret-do-not-deploy",
          ADMIN_TOTP_SECRET: "JBSWY3DPEHPK3PXP",
          E2E_TEST_MODE: "1",
          TRUSTED_PROXY_IP_HEADER: "x-real-ip",
          RESEND_API_KEY: "",
          CONTACT_EMAIL_TO: "",
          NEXT_PUBLIC_WHATSAPP_NUMBER: "",
          NEXT_PUBLIC_CONTACT_EMAIL: "",
        } : undefined,
      },
});
