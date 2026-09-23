import { describe, expect, it } from "vitest";
import { projectFormSchema } from "@/lib/project-validation";

const validProject = {
  title: "Kopi Koma",
  type: "F&B",
  result: "+38% online orders",
  className: "project-coffee" as const,
  imagePath: "/projects/kopi-koma.jpg",
  order: 1,
};

describe("projectFormSchema", () => {
  it("accepts a valid local project image path", () => {
    expect(projectFormSchema.safeParse(validProject).success).toBe(true);
  });

  it("rejects protocol-relative external image paths", () => {
    expect(
      projectFormSchema.safeParse({
        ...validProject,
        imagePath: "//attacker.example/image.jpg",
      }).success
    ).toBe(false);
  });

  it("accepts only the generated media URL shape", () => {
    expect(projectFormSchema.safeParse({ ...validProject, imagePath: "/api/media/550e8400-e29b-41d4-a716-446655440000.webp" }).success).toBe(true);
    expect(projectFormSchema.safeParse({ ...validProject, imagePath: "/api/media/../../secret.webp" }).success).toBe(false);
  });
});
