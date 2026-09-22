import { PrismaClient } from "@prisma/client";

const days = Number(process.env.CONTACT_RETENTION_DAYS);
if (!Number.isSafeInteger(days) || days < 1) {
  throw new Error("Set CONTACT_RETENTION_DAYS to a positive whole number.");
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const databaseName = decodeURIComponent(new URL(process.env.DATABASE_URL).pathname.slice(1));
const apply = process.argv.includes("--apply");
const confirmedName = process.argv.find((arg) => arg.startsWith("--confirm-database="))?.split("=").slice(1).join("=");
if (apply && (!databaseName || confirmedName !== databaseName)) {
  throw new Error("--apply requires --confirm-database=<database name from DATABASE_URL>.");
}

const cutoff = new Date(Date.now() - days * 24 * 60 * 60_000);
const prisma = new PrismaClient();
try {
  const where = { createdAt: { lt: cutoff } };
  const count = await prisma.contactSubmission.count({ where });
  if (!apply) {
    console.log(JSON.stringify({ mode: "dry-run", database: databaseName, cutoff: cutoff.toISOString(), matchingRows: count }));
  } else {
    const result = await prisma.contactSubmission.deleteMany({ where });
    console.log(JSON.stringify({ mode: "applied", database: databaseName, cutoff: cutoff.toISOString(), deletedRows: result.count }));
  }
} finally {
  await prisma.$disconnect();
}
