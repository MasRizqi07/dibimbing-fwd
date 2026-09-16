"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { projectFormSchema } from "@/lib/project-validation";

function parseProjectFormData(formData: FormData) {
  const result = projectFormSchema.safeParse({
    title: formData.get("title"),
    type: formData.get("type"),
    result: formData.get("result"),
    className: formData.get("className") || null,
    imagePath: formData.get("imagePath") || null,
    order: Number(formData.get("order") || 0),
  });

  if (!result.success) {
    throw new Error("Data project tidak valid. Periksa kembali semua field.");
  }

  return result.data;
}

export async function createProjectAction(formData: FormData) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const data = parseProjectFormData(formData);

  await prisma.project.create({
    data,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const data = parseProjectFormData(formData);

  await prisma.project.update({
    where: { id },
    data,
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function deleteProjectAction(id: string) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  await prisma.project.delete({
    where: { id },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}
