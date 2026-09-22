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
    const submitBtn = page.getByRole("button", { name: /Masuk ke Dashboard/ });

    await passwordInput.fill("salah-password-12345");
    await submitBtn.click();

    const alert = page.locator('[role="alert"], .error, p');
    await expect(alert.filter({ hasText: /salah|ditolak/i })).toBeVisible({ timeout: 5000 });
  });

  test("should have responsive layout on mobile viewport (320px)", async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 600 });
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Nexa Studio CMS" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("project create, edit, image selection and delete persist after reload", async ({ page }) => {
    test.skip(process.env.E2E_TEST_MODE !== "1", "Isolated test database required");
    await page.goto("/admin/login");
    await page.getByLabel("Password Admin").fill("ci-e2e-password");
    await page.getByRole("button", { name: /Masuk ke Dashboard/ }).click();
    await expect(page).toHaveURL(/\/admin$/);

    await page.getByRole("button", { name: /Tambah Project/ }).click();
    await page.getByLabel("Nama Project / Brand").fill("E2E Studio");
    await page.getByLabel("Tipe / Kategori").fill("Konsep visual");
    await page.getByLabel("Hasil / Keterangan").fill("Studi desain E2E");
    await page.getByLabel("Gambar portfolio yang disetujui").selectOption("/projects/kopi-koma.jpg");
    await page.getByRole("button", { name: "Simpan Project" }).click();
    await expect(page.getByText("E2E Studio").first()).toBeVisible();
    await page.reload();
    await expect(page.getByText("E2E Studio").first()).toBeVisible();
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "E2E Studio" })).toBeVisible();
    await expect(page.locator('img[alt*="E2E Studio"]')).toHaveAttribute("src", /kopi-koma/);

    await page.goto("/admin");
    const row = page.locator(".admin-project-list li").filter({ hasText: "E2E Studio" });
    await row.getByRole("button", { name: "Edit" }).click();
    await page.getByLabel("Nama Project / Brand").fill("E2E Studio Updated");
    await page.getByRole("button", { name: "Simpan Perubahan" }).click();
    await page.reload();
    await expect(page.getByText("E2E Studio Updated").first()).toBeVisible();

    page.once("dialog", (dialog) => dialog.accept());
    await page.locator(".admin-project-list li").filter({ hasText: "E2E Studio Updated" }).getByRole("button", { name: "Hapus" }).click();
    await expect(page.getByText("E2E Studio Updated")).toHaveCount(0);
    await page.reload();
    await expect(page.getByText("E2E Studio Updated")).toHaveCount(0);
  });
});
