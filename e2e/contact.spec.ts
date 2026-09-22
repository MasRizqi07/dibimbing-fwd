import { test, expect } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

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

  test("submission persists, survives refresh, and status mutation persists", async ({ page }) => {
    test.skip(process.env.E2E_TEST_MODE !== "1", "Isolated test database required");
    const visitorName = `E2E Visitor ${crypto.randomUUID().slice(0, 8)}`;
    await page.goto("/");
    await page.getByLabel("Nama Lengkap").fill(visitorName);
    await page.getByLabel("Alamat Email").fill("visitor@example.test");
    await page.getByLabel("Ceritakan Kebutuhan Proyek").fill("Saya ingin mendiskusikan studi desain website baru.");
    await page.waitForTimeout(2100);
    await page.getByRole("button", { name: /Kirim Pesan Sekarang/ }).click();
    await expect(page.getByRole("heading", { name: "Pesan Tersimpan!" })).toBeVisible();

    await page.goto("/admin/login");
    await page.getByLabel("Password Admin").fill("ci-e2e-password");
    await page.getByRole("button", { name: /Masuk ke Dashboard/ }).click();
    const row = page.locator(".admin-submission-list li").filter({ hasText: visitorName });
    await expect(row).toBeVisible();
    await row.getByRole("button", { name: "Dibaca" }).click();
    await page.reload();
    await expect(page.locator(".admin-submission-list li").filter({ hasText: visitorName }).locator(".admin-status")).toHaveText("read");
  });

  test("parallel retries persist one row and a changed payload gets conflict", async ({ request }) => {
    test.skip(process.env.E2E_TEST_MODE !== "1", "Isolated test database required");
    const db = new PrismaClient({ datasources: { db: { url: process.env.TEST_DATABASE_URL! } } });
    const key = crypto.randomUUID();
    try {
      const tokenResponse = await request.get("/api/anti-spam");
      const { token } = await tokenResponse.json();
      await new Promise((resolve) => setTimeout(resolve, 2100));
      const body = { name: "Parallel Visitor", email: "parallel@example.test", message: "Satu pesan yang dikirim secara paralel ke database.", honeypot: "", antiSpamToken: token, idempotencyKey: key };
      const responses = await Promise.all(Array.from({ length: 25 }, () => request.post("/api/contact", { data: body, headers: { "x-real-ip": "203.0.113.88" } })));
      expect(responses.some((response) => response.status() === 200)).toBe(true);
      expect(responses.every((response) => [200, 429].includes(response.status()))).toBe(true);
      expect(await db.contactSubmission.count({ where: { idempotencyKey: key } })).toBe(1);
      const conflict = await request.post("/api/contact", { data: { ...body, message: "Payload berbeda dengan kunci yang sama." }, headers: { "x-real-ip": "203.0.113.89" } });
      expect(conflict.status()).toBe(409);
      expect(await db.contactSubmission.count({ where: { idempotencyKey: key } })).toBe(1);
    } finally {
      await db.$disconnect();
    }
  });
});
