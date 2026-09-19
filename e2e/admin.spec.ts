import { test, expect } from "@playwright/test";

test.describe("E2E — Admin Login & CMS Protection", () => {
  test("should redirect unauthenticated user to login page when accessing /admin", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/.*\/admin\/login.*/);
    const loginHeading = page.locator("h1, h2");
    await expect(loginHeading.first()).toBeVisible();
  });

  test("should show error when submitting incorrect password", async ({ page }) => {
    await page.goto("/admin/login");
    const passwordInput = page.locator('input[name="password"]');
    const submitBtn = page.locator('button[type="submit"]');

    await passwordInput.fill("salah-password-12345");
    await submitBtn.click();

    const alert = page.locator('[role="alert"], .error, p');
    await expect(alert.filter({ hasText: /salah|ditolak/i })).toBeVisible({ timeout: 5000 });
  });

  test("should have responsive layout on mobile viewport (320px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto("/admin/login");
    const brand = page.locator(".brand");
    await expect(brand).toBeVisible();
  });
});
