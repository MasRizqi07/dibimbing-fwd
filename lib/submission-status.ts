import { z } from "zod";

export const submissionStatusSchema = z.enum(["new", "read", "replied", "archived"]);
export type SubmissionStatus = z.infer<typeof submissionStatusSchema>;
