import { prisma } from "@/lib/prisma";
import ProjectManager from "@/components/admin/ProjectManager";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await isAuthenticatedAdmin())) {
    redirect("/admin/login");
  }

  const [projects, submissions] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.contactSubmission.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <ProjectManager
      initialProjects={projects}
      submissions={submissions}
    />
  );
}
