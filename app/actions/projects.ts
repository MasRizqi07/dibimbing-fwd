"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { isAuthenticatedAdmin } from "@/lib/admin-session";

export async function createProjectAction(formData: FormData) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const title = (formData.get("title") as string)?.trim();
  const type = (formData.get("type") as string)?.trim();
  const result = (formData.get("result") as string)?.trim();
  const className = (formData.get("className") as string)?.trim() || "project-coffee";
  const imagePath = (formData.get("imagePath") as string)?.trim() || null;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  if (!title || !type || !result) {
    throw new Error("Judul, tipe, dan hasil harus diisi.");
  }

  await prisma.project.create({
    data: {
      title,
      type,
      result,
      className,
      imagePath,
      order: isNaN(order) ? 0 : order,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin");
}

export async function updateProjectAction(id: string, formData: FormData) {
  const isAuth = await isAuthenticatedAdmin();
  if (!isAuth) {
    throw new Error("Unauthorized: Anda harus login sebagai admin.");
  }

  const title = (formData.get("title") as string)?.trim();
  const type = (formData.get("type") as string)?.trim();
  const result = (formData.get("result") as string)?.trim();
  const className = (formData.get("className") as string)?.trim() || null;
  const imagePath = (formData.get("imagePath") as string)?.trim() || null;
  const order = parseInt((formData.get("order") as string) || "0", 10);

  if (!title || !type || !result) {
    throw new Error("Judul, tipe, dan hasil harus diisi.");
  }

  await prisma.project.update({
    where: { id },
    data: {
      title,
      type,
      result,
      className,
      imagePath,
      order: isNaN(order) ? 0 : order,
    },
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
