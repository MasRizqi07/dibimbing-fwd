ALTER TABLE "ContactSubmission"
  ADD COLUMN "webhookStatus" TEXT NOT NULL DEFAULT 'pending',
  ADD COLUMN "webhookAttempts" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "webhookLeaseUntil" TIMESTAMP(3),
  ADD COLUMN "webhookNextAttempt" TIMESTAMP(3);

-- Historical leads must not be sent to a newly configured external service.
UPDATE "ContactSubmission" SET "webhookStatus" = 'disabled';

CREATE INDEX "ContactSubmission_webhookStatus_webhookNextAttempt_idx"
  ON "ContactSubmission"("webhookStatus", "webhookNextAttempt");
