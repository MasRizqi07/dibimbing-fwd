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
