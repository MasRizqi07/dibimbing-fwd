-- AlterTable
ALTER TABLE "ContactSubmission" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'new',
ADD COLUMN "idempotencyKey" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ContactSubmission_idempotencyKey_key" ON "ContactSubmission"("idempotencyKey");

-- CreateIndex
CREATE INDEX "ContactSubmission_status_idx" ON "ContactSubmission"("status");
