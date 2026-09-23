import { z } from "zod";
import { projectAssets } from "@/lib/project-assets";

const assetPaths = projectAssets.map((asset) => asset.path) as [
  (typeof projectAssets)[number]["path"],
  ...(typeof projectAssets)[number]["path"][],
];

const uploadPathRegex = /^\/uploads\/[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp|avif)$/;
const mediaPathRegex = /^\/api\/media\/[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/i;

export const projectFormSchema = z.object({
  title: z.string().trim().min(2).max(120),
  type: z.string().trim().min(2).max(120),
  result: z.string().trim().min(2).max(240),
  className: z.enum(["project-coffee", "project-fashion", "project-wellness"]).nullable(),
  imagePath: z
    .union([z.enum(assetPaths), z.string().refine((path) => uploadPathRegex.test(path) || mediaPathRegex.test(path))])
    .nullable(),
  order: z.number().int().min(0).max(100_000),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
