# Phase 2 implementation and release status

Updated 2026-09-23. This document records the current code and local checks. It does not certify a deployment.

| Workstream | Implemented in this checkout | Remaining release evidence |
| --- | --- | --- |
| Project images | Admin route decodes JPEG/PNG/WebP/AVIF, re-encodes to WebP, scans through ClamAV in production, and stores in an S3-compatible bucket. Public media is served by `/api/media/[filename]`. The old `/uploads/` paths remain accepted for existing records. | Configure a private S3/R2 bucket and ClamAV service, then prove upload, reload, and retrieval in staging. No cloud account is configured in this workspace. |
| Lead webhook | Separate database outbox with atomic claim, lease, retry, signed payload, and stable idempotency key. Generic, Slack, and Discord payload shapes are available. Email delivery remains independent. | Configure endpoint and secret, run migration, prove receiver deduplication and retries against the chosen service in staging. The five-minute cron schedule requires deployment support. |
| Admin MFA | Production login requires a Base32 TOTP secret. Accepted time steps are consumed atomically in PostgreSQL to reject replay; password and login rate limits remain. | Enroll the owner, store and rotate the secret through deployment secret management, run migration, then prove valid/invalid/replayed login on staging. |
| ID/EN | Cookie-backed server locale and client store cover public pages, forms, error states, and the admin UI. Browser checks cover locale persistence across routes. | Stored project/lead content is not translated automatically. English legal pages are marked as drafts and need legal review. Cookie-based rendering makes pages dynamic; assess caching and SEO before release. |

## Local verification

- The initial baseline at `a8410dc` passed lint, typecheck, and 51/51 unit tests.
- After the current changes, lint, typecheck, 66/66 unit tests, and a production build passed locally. The build compiled, but did not deploy or migrate the remote Neon database.
- A fresh local PostgreSQL database `dibimbing_fwd_phase2_codex_20260922` on port 5433 accepted all seven migrations and the three-project seed. The database is isolated from `.env.local`'s remote Neon target.
- Browser E2E without isolated DB: 11 passed, 6 skipped on an earlier checkpoint. The current isolated-DB aggregate run passed 20/20 scenarios, including automated accessibility checks, replayed TOTP rejection, persisted admin mutations, concurrency/idempotency, and EN routes. Next logged `The destination stream closed early` when Playwright navigated away from a streamed page; a focused contact rerun still passed 6/6. Treat this as an observed test-navigation cancellation, not a clean-log claim.

## Configuration and rollout

1. Apply the two new migrations through the deployment migration stage, using staging credentials first.
2. Set `PROJECT_MEDIA_BUCKET`, region, and either AWS identity credentials or S3-compatible endpoint credentials. Set `CLAMAV_SOCKET_PATH` or a private `CLAMAV_HOST`/port. ClamAV TCP has no authentication or encryption; keep it on a trusted private network.
3. Set a random `ADMIN_TOTP_SECRET` in Base32 and enroll the administrator before enabling the new build. Production admin login fails closed without it.
4. Set `NOTIFICATION_WEBHOOK_URL`, `NOTIFICATION_WEBHOOK_SECRET`, and `NOTIFICATION_WEBHOOK_KIND` (`generic`, `slack`, `discord`) if external alerts are desired. The receiver should deduplicate on `Idempotency-Key`; retries can otherwise duplicate side effects after an ambiguous timeout.
5. Verify exact commit CI, staging migration and browser flows, provider behavior, backup/restore, and production smoke independently. No such evidence is recorded here.

Use `npm run phase2:enroll-totp -- owner "Nexa Studio"` to create a new authenticator enrollment value, and run `npm run phase2:check-config` in an environment containing deployment variables. The validator reports names of missing variables without printing secret values.

Prototype figures and wordmarks are now explicitly labeled as illustrations; concept pages no longer present unverified business KPIs, testimonials, or live links. Pricing, privacy/legal assertions, and accessibility conformance still need owner and specialist review. An automated axe result on selected pages does not establish full WCAG conformance. No production Core Web Vitals measurements were collected in this change.

## Complexity and trade-offs

Image decoding, scanning, and object upload consume **O(B)** time and memory per upload for an image of B bytes, with a hard 5 MB input limit and 24 million pixel decode cap. The S3-compatible bucket avoids dependence on an instance's writable filesystem, while adding a storage provider and a scanner service. Each webhook claim is an indexed status query; a batch of n due items performs **O(n)** sends and updates. The persistent outbox adds schema and scheduler operations in exchange for auditable retries. Single-owner TOTP state is one row; moving to multiple admins would require per-user state and session identities.
