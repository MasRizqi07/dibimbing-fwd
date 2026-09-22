ALTER TABLE "ContactSubmission"
  ADD COLUMN "payloadHash" TEXT,
  ADD COLUMN "notificationStatus" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN "notificationAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "notificationLeaseUntil" TIMESTAMP(3),
  ADD COLUMN "notificationNextAttempt" TIMESTAMP(3);

UPDATE "ContactSubmission"
SET "notificationStatus" = 'sent'
WHERE "emailSent" = true;

-- Historical failures are ambiguous: avoid sending old leads on the first
-- scheduler run without an operator reviewing them.
UPDATE "ContactSubmission"
SET "notificationStatus" = 'review'
WHERE "emailSent" = false;

CREATE INDEX "ContactSubmission_notificationStatus_notificationNextAttempt_idx"
  ON "ContactSubmission"("notificationStatus", "notificationNextAttempt");

-- Replace only the three seeded example claims. Operator-authored projects
-- and any edited result are left untouched.
UPDATE "Project" SET "result" = 'Studi konsep identitas dan website untuk kedai kopi'
WHERE "title" = 'Kopi Koma' AND "result" = '+38% online orders';
UPDATE "Project" SET "result" = 'Studi konsep katalog digital untuk brand fashion'
WHERE "title" = 'Sora Studio' AND "result" = '2.4x conversion rate';
UPDATE "Project" SET "result" = 'Studi konsep landing page untuk layanan wellness'
WHERE "title" = 'Ruang Pulih' AND "result" = 'Booked out in 12 days';
