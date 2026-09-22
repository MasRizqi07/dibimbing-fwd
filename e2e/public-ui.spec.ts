import { expect, test } from "@playwright/test";

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
