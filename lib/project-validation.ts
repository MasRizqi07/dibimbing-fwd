import { z } from "zod";

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  type: z.string().trim().min(2).max(120),
  result: z.string().trim().min(2).max(240),
  className: z.enum(["project-coffee", "project-fashion", "project-wellness"]).nullable(),
  imagePath: z
    .string()
    .trim()
    .max(500)
    .refine((value) => value === "" || /^\/(?!\/)/.test(value), {
      message: "Path gambar harus berupa path lokal yang dimulai dengan '/'.",
    })
    .nullable(),
  order: z.number().int().min(0).max(100_000),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
