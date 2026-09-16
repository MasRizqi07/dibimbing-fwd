import { prisma } from "@/lib/prisma";
import ProjectManager from "@/components/admin/ProjectManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
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
