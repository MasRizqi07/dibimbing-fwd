-- Add indexes used by the public portfolio and admin inbox ordering queries.
CREATE INDEX "Project_order_idx" ON "Project"("order");
CREATE INDEX "ContactSubmission_createdAt_idx" ON "ContactSubmission"("createdAt");
