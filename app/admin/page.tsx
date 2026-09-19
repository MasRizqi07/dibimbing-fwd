import { prisma } from "@/lib/prisma";
import ProjectManager from "@/components/admin/ProjectManager";
import { isAuthenticatedAdmin } from "@/lib/admin-session";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface AdminPageProps {
  searchParams?: Promise<{
    page?: string;
    status?: string;
  }>;
}

export default async function AdminPage({ searchParams }: AdminPageProps) {
  if (!(await isAuthenticatedAdmin())) {
    redirect("/admin/login");
  }

  const resolvedParams = searchParams ? await searchParams : {};
  const page = Math.max(1, Number(resolvedParams.page) || 1);
  const pageSize = 20;
  const statusFilter = resolvedParams.status;

  const whereClause =
    statusFilter && ["new", "read", "replied", "archived"].includes(statusFilter)
      ? { status: statusFilter }
      : {};

  const [projects, submissions, totalSubmissions] = await Promise.all([
    prisma.project.findMany({
      orderBy: { order: "asc" },
    }),
    prisma.contactSubmission.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
      take: pageSize,
      skip: (page - 1) * pageSize,
    }),
    prisma.contactSubmission.count({
      where: whereClause,
    }),
  ]);

  return (
    <ProjectManager
      initialProjects={projects}
      submissions={submissions}
      totalSubmissions={totalSubmissions}
      currentPage={page}
      pageSize={pageSize}
      currentStatusFilter={statusFilter || "all"}
    />
  );
}
