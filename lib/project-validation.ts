import { z } from "zod";
import { projectAssets } from "@/lib/project-assets";

const assetPaths = projectAssets.map((asset) => asset.path) as [
  (typeof projectAssets)[number]["path"],
  ...(typeof projectAssets)[number]["path"][],
];

const uploadPathRegex = /^\/uploads\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp|avif)$/;

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  type: z.string().trim().min(2).max(120),
  result: z.string().trim().min(2).max(240),
  className: z.enum(["project-coffee", "project-fashion", "project-wellness"]).nullable(),
  imagePath: z
    .union([z.enum(assetPaths), z.string().regex(uploadPathRegex)])
    .nullable(),
  order: z.number().int().min(0).max(100_000),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
