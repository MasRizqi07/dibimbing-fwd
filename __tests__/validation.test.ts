import { describe, it, expect } from "vitest";
import { contactFormSchema } from "@/lib/validation";

describe("Contact Form Validation Schema", () => {
  it("should validate correct form payload successfully", () => {
    const validData = {
      name: "Rizqi Pratama",
      email: "rizqi@example.com",
      message: "Halo, kami ingin membuat website baru untuk brand lokal kami.",
      honeypot: "",
      renderTime: Date.now() - 3000,
    };

    const result = contactFormSchema.safeParse(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.name).toBe("Rizqi Pratama");
      expect(result.data.email).toBe("rizqi@example.com");
    }
  });

  it("should reject name that is too short (< 2 chars)", () => {
    const data = {
      name: "R",
      email: "rizqi@example.com",
      message: "Halo ini pesan yang cukup panjang.",
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.name).toContain("Nama minimal 2 karakter.");
    }
  });

  it("should reject invalid email format", () => {
    const data = {
      name: "Rizqi",
      email: "bukan-email-valid",
      message: "Halo ini pesan yang cukup panjang.",
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.email).toContain("Format email tidak valid.");
    }
  });

  it("should reject message that is too short (< 10 chars)", () => {
    const data = {
      name: "Rizqi",
      email: "rizqi@example.com",
      message: "Pendek",
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.message).toContain("Pesan minimal 10 karakter.");
    }
  });

  it("should reject submission if honeypot is filled", () => {
    const data = {
      name: "Spam Bot",
      email: "bot@spam.com",
      message: "This is spam message for you.",
      honeypot: "http://spam-link.com",
    };

    const result = contactFormSchema.safeParse(data);
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors;
      expect(errors.honeypot).toContain("Bot submission detected.");
    }
  });
});
