import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { PrismaClient } from "@prisma/client";
import { generateTOTP } from "../lib/totp";

async function expectAccessible(page: Page) {
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  expect(result.violations.map((item) => ({ id: item.id, impact: item.impact, nodes: item.nodes.map((node) => node.target) }))).toEqual([]);
}

test("public surfaces pass automated WCAG checks", async ({ page }) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    await expectAccessible(page);
  }
  await page.goto("/privacy");
  await expectAccessible(page);
  await page.goto("/admin/login");
  await expectAccessible(page);
});

test("admin dashboard passes automated WCAG checks", async ({ page }) => {
  test.skip(process.env.E2E_TEST_MODE !== "1", "Isolated test database required");
  await page.setExtraHTTPHeaders({ "x-real-ip": "203.0.113.204" });
  const db = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL! } } });
  await db.adminTotpState.deleteMany();
  await db.$disconnect();
  await page.goto("/admin/login");
  await page.getByLabel("Password Admin").fill("ci-e2e-password");
  await page.getByLabel(/Kode 2FA/).fill(generateTOTP("JBSWY3DPEHPK3PXP"));
  await page.getByRole("button", { name: /Masuk ke Dashboard/ }).click();
  await expect(page).toHaveURL(/\/admin$/);
  await expectAccessible(page);
});
