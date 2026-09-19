"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/admin-session";

export async function updateSubmissionStatusAction(
  id: string,
  status: "new" | "read" | "replied" | "archived"
) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  await prisma.contactSubmission.update({
    where: { id },
    data: { status },
  });

  revalidatePath("/admin");
}
