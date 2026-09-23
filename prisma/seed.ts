import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const initialProjects = [
  {
    title: "Nomad Coffee Roasters",
    type: "F&B · Branding + Website",
    result: "Konsep visual",
    className: "project-coffee",
    imagePath: "/projects/nomad-coffee.png",
    order: 1,
  },
  {
    title: "Aura Studio",
    type: "Fashion · E-commerce",
    result: "Konsep visual",
    className: "project-fashion",
    imagePath: "/projects/aura-studio.png",
    order: 2,
  },
  {
    title: "Ruang Pulih",
    type: "Wellness · Landing page",
    result: "Konsep visual",
    className: "project-wellness",
    imagePath: "/projects/ruang-pulih.png",
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
