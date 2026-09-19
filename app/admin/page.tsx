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
  const parsedPage = Number(resolvedParams.page);
  const page = Number.isSafeInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const pageSize = 20;
  const statusFilter = resolvedParams.status;

  const validStatuses = ["new", "read", "replied", "archived"];
  const whereClause =
    statusFilter && validStatuses.includes(statusFilter)
      ? { status: statusFilter }
      : undefined;

  const [projects, rawSubmissions, totalSubmissions] = await Promise.all([
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

  const submissions = rawSubmissions.map((sub) => ({
    ...sub,
    status: (sub as { status?: string }).status || "new",
  }));

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
