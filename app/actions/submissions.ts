"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { submissionStatusSchema, type SubmissionStatus } from "@/lib/submission-status";

export async function updateSubmissionStatusAction(
  id: string,
  status: SubmissionStatus
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const validId = idSchema.parse(id);
  const validStatus = submissionStatusSchema.parse(status);
  await prisma.contactSubmission.update({
    where: { id: validId },
    data: { status: validStatus },
  });

  revalidatePath("/admin");
}

const idSchema = z.string().min(1).max(128);
