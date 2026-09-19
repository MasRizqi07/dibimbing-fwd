import { test, expect } from "@playwright/test";

test.describe("E2E — Contact Form Flow", () => {
  test("should load landing page and display contact section", async ({ page }) => {
    await page.goto("/");
    const contactHeading = page.locator("#contact h2, #contact .section-heading");
    await expect(contactHeading).toBeVisible();

    const nameInput = page.locator('input[name="name"]');
    const emailInput = page.locator('input[name="email"]');
    const messageInput = page.locator('textarea[name="message"]');
    const submitBtn = page.locator('#contact button[type="submit"]');

    await expect(nameInput).toBeVisible();
    await expect(emailInput).toBeVisible();
    await expect(messageInput).toBeVisible();
    await expect(submitBtn).toBeVisible();
  });

  test("should display validation error on client if inputs are empty or invalid", async ({ page }) => {
    await page.goto("/");
    const submitBtn = page.locator('#contact button[type="submit"]');
    await submitBtn.click();

    // HTML5 validation or form status
    const nameInput = page.locator('input[name="name"]');
    const isInvalid = await nameInput.evaluate((el: HTMLInputElement) => !el.checkValidity());
    expect(isInvalid).toBe(true);
  });

  test("should fetch anti-spam token on page load", async ({ page }) => {
    const tokenPromise = page.waitForResponse(
      (response) => response.url().includes("/api/anti-spam") && response.status() === 200
    );
    await page.goto("/");
    const response = await tokenPromise;
    const body = await response.json();
    expect(body.token).toBeDefined();
    expect(typeof body.token).toBe("string");
  });
});
