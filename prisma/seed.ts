import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProjects = [
  {
    title: "Kopi Koma",
    type: "F&B · Branding + Website",
    result: "+38% online orders",
    className: "project-coffee",
    order: 1,
  },
  {
    title: "Sora Studio",
    type: "Fashion · E-commerce",
    result: "2.4x conversion rate",
    className: "project-fashion",
    order: 2,
  },
  {
    title: "Ruang Pulih",
    type: "Wellness · Landing page",
    result: "Booked out in 12 days",
    className: "project-wellness",
    order: 3,
  },
];

async function main() {
  console.log("Seeding initial projects...");

  for (const project of initialProjects) {
    const existing = await prisma.project.findFirst({
      where: { title: project.title },
    });

    if (!existing) {
      await prisma.project.create({
        data: project,
      });
      console.log(`Created project: ${project.title}`);
    } else {
      await prisma.project.update({
        where: { id: existing.id },
        data: project,
      });
      console.log(`Updated project: ${project.title}`);
    }
  }

  const count = await prisma.project.count();
  console.log(`Seeding finished. Total projects in DB: ${count}`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
