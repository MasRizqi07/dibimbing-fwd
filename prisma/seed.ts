import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProjects = [
  {
    title: "Kopi Koma",
    type: "F&B · Branding + Website",
    result: "Studi konsep identitas dan website untuk kedai kopi",
    className: "project-coffee",
    imagePath: "/projects/kopi-koma.jpg",
    order: 1,
  },
  {
    title: "Sora Studio",
    type: "Fashion · E-commerce",
    result: "Studi konsep katalog digital untuk brand fashion",
    className: "project-fashion",
    imagePath: "/projects/sora-studio.jpg",
    order: 2,
  },
  {
    title: "Ruang Pulih",
    type: "Wellness · Landing page",
    result: "Studi konsep landing page untuk layanan wellness",
    className: "project-wellness",
    imagePath: "/projects/ruang-pulih.jpg",
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
      console.log(`Skipped existing project: ${project.title}`);
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
