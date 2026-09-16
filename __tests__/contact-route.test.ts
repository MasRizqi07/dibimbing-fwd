import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    contactSubmission: {
      create: vi.fn(),
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/resend", () => ({
  resend: null,
}));

describe("POST /api/contact Route Handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return 400 if body is invalid JSON", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: "not a json",
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
  });

  it("should return 400 if validation fails", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "A",
        email: "invalid-email",
        message: "short",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.success).toBe(false);
    expect(data.details).toBeDefined();
  });

  it("should return 400 if honeypot is filled by bot", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Bot Name",
        email: "bot@test.com",
        message: "Valid looking message longer than 10 chars.",
        honeypot: "spam content",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe("Bot submission detected.");
  });

  it("should return 400 if submitted in less than 2 seconds", async () => {
    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Fast Submitter",
        email: "fast@test.com",
        message: "Valid looking message longer than 10 chars.",
        renderTime: Date.now() - 500, // only 0.5s ago
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain("terlalu cepat");
  });

  it("should save submission to DB and return 200 on valid submission", async () => {
    (prisma.contactSubmission.create as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
      id: "mock-id-123",
      name: "Rizqi Pratama",
      email: "rizqi@test.com",
      message: "Halo kami ingin membuat website baru bersama Nexa Studio.",
      emailSent: false,
    });

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Rizqi Pratama",
        email: "rizqi@test.com",
        message: "Halo kami ingin membuat website baru bersama Nexa Studio.",
        renderTime: Date.now() - 4000,
        honeypot: "",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.id).toBe("mock-id-123");
    expect(prisma.contactSubmission.create).toHaveBeenCalledTimes(1);
  });
});
