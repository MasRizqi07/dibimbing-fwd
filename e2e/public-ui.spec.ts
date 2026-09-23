import { expect, test } from "@playwright/test";

test("agency homepage labels illustrations and shows package content", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".hero-proof")).toContainText("Ilustrasi potensi pertumbuhan");
  await expect(page.locator(".growth-card")).toContainText("+24.8%");
  await expect(page.locator(".growth-card")).toContainText("Rp 84.6jt");
  await expect(page.locator(".floating-card-top")).toContainText("+38%new customers");
  await expect(page.locator(".logo-strip")).toContainText("Contoh wordmark");
  await expect(page.locator(".pricing-card").nth(0)).toContainText("Rp 3,5 jt");
  await expect(page.locator(".pricing-card").nth(1)).toContainText("Rp 7,5 jt");
  await expect(page.locator(".pricing-card").nth(2)).toContainText("Let's talk");
});

test("public layout fits target widths and menu works with keyboard", async ({ page }) => {
  for (const width of [320, 375, 768, 1440]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `horizontal overflow at ${width}px`).toBe(true);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }

  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Tutup menu" })).toHaveAttribute("aria-expanded", "true");
  await page.locator("#mobile-navigation").getByRole("link", { name: "Layanan" }).click();
  await expect(page).toHaveURL(/#services$/);
  await expect(page.getByRole("button", { name: "Menu" })).toHaveAttribute("aria-expanded", "false");
});

test("service search and reduced motion retain usable feedback", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("searchbox", { name: "Cari layanan" }).fill("tidak-ada-layanan-xyz");
  await expect(page.getByRole("status")).toContainText("Belum menemukan layanan");
  await page.getByRole("button", { name: "Reset pencarian" }).click();
  await expect(page.locator(".service-result-count")).toHaveText("3 layanan tersedia");
  const duration = await page.locator(".button-primary").first().evaluate((element) => getComputedStyle(element).transitionDuration);
  expect(duration.split(",").every((value) => parseFloat(value) <= 0.001)).toBe(true);
});

test("site navigation remains visible after scrolling", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await expect(page.locator(".site-nav")).toBeInViewport();
});

test("language choice updates homepage copy and persists after reload", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.getByRole("heading", { name: "Measurable Digital Growth for Ambitious Businesses" })).toBeVisible();
  await expect(page.getByLabel("Full Name")).toBeVisible();
  await page.reload();
  await expect(page.getByRole("heading", { name: "Measurable Digital Growth for Ambitious Businesses" })).toBeVisible();
  await page.getByRole("button", { name: "ID", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("lang", "id");
  await expect(page.getByRole("heading", { name: "Transformasi Digital Terukur untuk Bisnis yang Siap Tumbuh" })).toBeVisible();
});

test("English language covers legal drafts, concept pages, and project brief", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "EN", exact: true }).click();
  await page.goto("/privacy");
  await expect(page.getByRole("heading", { name: "Privacy & Data Policy" })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("Pending legal review");
  await page.goto("/terms");
  await expect(page.getByRole("heading", { name: "Terms & Conditions" })).toBeVisible();
  await expect(page.getByRole("note")).toContainText("Pending legal review");
  await page.goto("/work/nomad-coffee-roasters");
  await expect(page.getByText("Design Exploration")).toBeVisible();
  await expect(page.getByText(/does not establish a client engagement/)).toBeVisible();
  await page.goto("/start");
  await expect(page.getByRole("heading", { name: "Choose Your Services" })).toBeVisible();
  await page.getByRole("button", { name: "Continue →" }).click();
  await expect(page.getByRole("heading", { name: "Budget Range and Timeline" })).toBeVisible();
  await page.goto("/admin/login");
  await expect(page.getByLabel("Admin Password")).toBeVisible();
  await expect(page.getByLabel("2FA / TOTP Code")).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
});
