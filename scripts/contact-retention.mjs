import { PrismaClient } from "@prisma/client";

const days = Number(process.env.CONTACT_RETENTION_DAYS);
if (!Number.isSafeInteger(days) || days < 1) {
  throw new Error("Set CONTACT_RETENTION_DAYS to a positive whole number.");
}
if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required.");

const databaseUrl = new URL(process.env.DATABASE_URL);
const databaseName = decodeURIComponent(databaseUrl.pathname.slice(1));
const target = `${databaseUrl.host}/${databaseName}?schema=${databaseUrl.searchParams.get("schema") || "public"}`;
const apply = process.argv.includes("--apply");
const confirmedTarget = process.argv.find((arg) => arg.startsWith("--confirm-target="))?.slice("--confirm-target=".length);
if (apply && (!databaseName || confirmedTarget !== target)) {
  throw new Error(`--apply requires --confirm-target=${target}. Run a dry-run first.`);
}

const cutoff = new Date(Date.now() - days * 24 * 60 * 60_000);
const prisma = new PrismaClient();
try {
  const where = { createdAt: { lt: cutoff } };
  const count = await prisma.contactSubmission.count({ where });
  if (!apply) {
    console.log(JSON.stringify({ mode: "dry-run", target, cutoff: cutoff.toISOString(), matchingRows: count }));
  } else {
    const result = await prisma.contactSubmission.deleteMany({ where });
    console.log(JSON.stringify({ mode: "applied", target, cutoff: cutoff.toISOString(), deletedRows: result.count }));
  }
} finally {
  await prisma.$disconnect();
}
