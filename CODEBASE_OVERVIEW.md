# Nexa Studio — Codebase Architecture & Technical Audit Overview

**Document Classification**: Technical Architecture & Quality Assurance Reference  
**Target Audience**: Principal Reviewers, Security Auditors, QA Engineers, and Technical Leads  
**Codebase Version**: historical architecture snapshot. Several route, rendering, and content descriptions below no longer match current code; see [PHASE2_STATUS.md](./PHASE2_STATUS.md) and source for the current implementation and evidence.
**Framework**: Next.js 16.3.5 (App Router, Turbopack) • React 19 • TypeScript 5 • Prisma 6  

---

## 1. Executive Summary & Purpose

This document serves as the **official technical audit dossier and conceptual architectural overview** for the Nexa Studio digital agency platform. It establishes end-to-end traceability between:
1. Visual prototypes, layout markup, and tokens defined in `Design/`.
2. Component hierarchy and Server/Client boundaries in `app/` and `components/`.
3. Backend data pipelines, idempotency guarantees, and outbox delivery in `lib/`.
4. Security hardening mechanisms (Magic-byte upload inspection, RFC 6238 TOTP 2FA, anti-spam tokens).
5. Automated verification gates (Vitest unit tests, Playwright E2E suites, Axe-core WCAG checks).

---

## 2. Design-to-Code Traceability Matrix

The Nexa Studio frontend was translated directly from visual references and prototype markup located in `Design/code.html` and `Design/Design-Review.png`. The following matrix details how prototype artifacts map to production Next.js 16 components:

| Prototype Reference (`Design/`) | Production Component | Rendering Paradigm | Functional Role & Implementation Notes |
| :--- | :--- | :--- | :--- |
| `code.html` (Header & Navigation) | [`components/SiteNav.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/components/SiteNav.tsx) | Client (`'use client'`) | Translucent sticky header, mobile drawer with focus trap, keyboard navigation (Escape, Tab), and dynamic i18n switcher. |
| `code.html` (Hero Section) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`#top`) | Server Component (RSC) | Editorial headline and SVG chart; figures are labeled illustrative. |
| `code.html` (Growth Card) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`.growth-card`) | Server Component (RSC) | Vector financial metric card (+24.8% YoY, Rp 84.6jt) with dual floating micro-cards (`+38% new customers`). |
| `code.html` (Client Logos Strip) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`.logo-strip`) | Server Component (RSC) | Typographic wordmark concepts, without a verified client relationship claim. |
| `code.html` (Services Catalog) | [`components/ServiceCatalog.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/components/ServiceCatalog.tsx) | Client (`'use client'`) | Category filter pills, debounced live text search, ARIA live region status indicator, and reset trigger. |
| `code.html` (Portfolio Grid) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`#work`) | Dynamic Server Component | Database project cards; only known concept titles link to detail routes. |
| Conceptual Prototype | [`app/work/[slug]/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/work/[slug]/page.tsx) | Dynamic Server Component | Bilingual visual concept gallery with explicit provenance and no unverified outcomes. |
| `code.html` (Process 4-Step) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`#process`) | Server Component (RSC) | 4-step delivery pipeline (Discovery, Design Architecture, Engineering & Quality, Launch & Growth). |
| `code.html` (Pricing Matrix) | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`#pricing`) | Server Component (RSC) | 3-tier pricing cards: Starter (Rp 3,5jt), Growth (Rp 7,5jt, featured navy container), and Enterprise Custom. |
| `code.html` (Contact Section) | [`components/ContactForm.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/components/ContactForm.tsx) | Client (`'use client'`) | High-conversion dark navy anchor (`#102A31`) with honeypot, anti-spam token, UUID idempotency key, and status alerts. |
| Interactive Brief Modal | [`app/start/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/start/page.tsx) | Client (`'use client'`) | 4-step wizard: (1) Scope pills, (2) Budget tiers & timeline slider, (3) Company info, (4) Contact validation. |
| Footer | [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) (`<footer>`) | Server Component (RSC) | Editorial sitemap, legal anchors (`/privacy`, `/terms`), social links, and copyright notices. |

---

## 3. Component Boundary Architecture

The architecture adheres strictly to **Next.js 16 App Router Server/Client separation principles**:

```mermaid
graph TD
    subgraph Server_Component_Boundary [Server Components - Zero Client JS]
        Layout["app/layout.tsx<br/>(SEO, JSON-LD, Fonts)"]
        Home["app/page.tsx<br/>(Hero, Logos, Process, Pricing, Footer)"]
        CaseStudy["app/work/[slug]/page.tsx<br/>(Dynamic Bilingual Concepts)"]
        Legal["app/privacy & app/terms<br/>(Dynamic Bilingual Drafts)"]
        AdminLayout["app/admin/layout.tsx<br/>(Admin Wrapper)"]
    end

    subgraph Client_Component_Boundary [Client Components - Interactive Islands]
        Provider["lib/i18n/context.tsx<br/>(LanguageProvider Store)"]
        Nav["components/SiteNav.tsx<br/>(Menu Drawer, i18n Toggle)"]
        Catalog["components/ServiceCatalog.tsx<br/>(Debounced Search & Filter)"]
        Contact["components/ContactForm.tsx<br/>(Idempotent Lead Capture)"]
        Wizard["app/start/page.tsx<br/>(4-Step Interactive Brief)"]
        AdminUI["components/admin/*<br/>(Project Form, Uploader, Lead Drawer)"]
    end

    Layout --> Provider
    Provider --> Home
    Provider --> CaseStudy
    Provider --> Legal
    Home --> Nav
    Home --> Catalog
    Home --> Contact
```

### Architectural Rules Enforced:
1. **Server Components by Default**: Pages, layouts, and data fetchers execute on the server. Reading the locale cookie makes public routes dynamic in the current build.
2. **Selective Client Islands**: `'use client'` is applied exclusively to components requiring event handlers, browser storage APIs, or dynamic input state.
3. **Hydration Isolation**: The `LanguageProvider` wraps children using React 19's `useSyncExternalStore` so client-side language switching does not trigger hydration mismatches or cascade re-renders.

---

## 4. Deep-Dive System Sequence Diagrams

### Flow 1: Zero-Loss Contact Lead Ingestion & Outbox Delivery

```mermaid
sequenceDiagram
    autonumber
    actor User as Prospective Client
    participant Form as ContactForm (Client)
    participant API as POST /api/contact
    participant Redis as RateLimiter (Upstash/Memory)
    participant Token as Anti-Spam Verifier
    participant DB as PostgreSQL (Neon)
    participant Webhook as Webhook Dispatcher
    participant Cron as Cron Notification Worker
    participant Resend as Resend Mail Service

    User->>Form: Enters Name, Email, Message & Submits
    Form->>API: Submits with honeypot="", antiSpamToken, and idempotencyKey
    API->>Redis: Check client IP request rate
    alt Rate Limit Exceeded
        Redis-->>Form: 429 Too Many Requests
    end
    API->>Token: Validate signed HMAC token (age > 2s & < 1hr)
    alt Invalid or Expired Token
        Token-->>Form: 400 Bad Request (Anti-spam failed)
    end
    API->>API: Compute SHA-256 payloadHash
    API->>DB: Upsert ContactSubmission with idempotencyKey
    alt Same Key, Different Payload
        DB-->>Form: 409 Conflict
    else Valid New Submission
        DB-->>API: 200 Persisted Successfully
        API-)Webhook: Non-blocking Webhook Trigger (5s timeout)
        API-->>Form: 200 OK (Instant User Success Message)
    end

    Note over DB,Cron: Asynchronous Outbox Worker
    Cron->>DB: Claim pending submissions via atomic lease (limit 20)
    Cron->>Resend: Dispatch notification email with idempotency key
    alt Email Sent Successfully
        Cron->>DB: Update notificationStatus = 'sent', emailSent = true
    else Email Service Unavailable
        Cron->>DB: Increment notificationAttempts, schedule nextAttemptAt with backoff
    end
```

### Flow 2: Secure Image Uploading Pipeline (Magic Bytes)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Studio Administrator
    participant UI as ProjectForm.tsx
    participant API as POST /api/admin/upload
    participant Auth as isAuthenticatedAdmin()
    participant Inspector as Image Decoder and ClamAV
    participant FS as S3-compatible Object Storage

    Admin->>UI: Selects image file (JPEG / PNG / WebP / AVIF)
    UI->>API: Multi-part FormData (File + Admin Session Cookie)
    API->>Auth: Verify HMAC signature of session cookie
    alt Unauthorized Session
        Auth-->>UI: 401 Unauthorized
    end
    API->>API: Require Content-Length and check 5 MB upload limit
    alt File Size > 5MB
        API-->>UI: 413 Payload Too Large
    end
    API->>Inspector: Decode full image, normalize WebP, and scan
    alt Invalid or Infected File
        Inspector-->>UI: 400 Rejected Image
    end
    API->>FS: Generate crypto.randomUUID() object key and upload
    API-->>UI: 201 Created { url: "/api/media/uuid.webp" }
    UI->>UI: Updates Project thumbnail preview immediately
```

### Flow 3: Multi-Factor Authentication (RFC 6238 TOTP 2FA)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Studio Administrator
    participant Login as /admin/login
    participant Action as loginAdminAction (Server Action)
    participant Bcrypt as Bcrypt Comparator
    participant TOTP as lib/totp.ts Engine
    participant Cookie as Session Cookie Issuer

    Admin->>Login: Submits password and 6-digit TOTP code when enabled
    Login->>Action: Executes server action with payload
    Action->>Bcrypt: Compare submitted password against ADMIN_PASSWORD hash
    alt Password Mismatch
        Bcrypt-->>Login: Returns error "Password atau kode 2FA tidak valid"
    end
    alt ADMIN_TOTP_SECRET Configured in Env
        Action->>TOTP: verifyTotpToken(code, ADMIN_TOTP_SECRET)
        Note over TOTP: Computes HMAC-SHA1 for steps (T-1, T, T+1)<br/>Constant-time crypto.timingSafeEqual comparison
        alt Invalid 2FA Code
            TOTP-->>Login: Returns error "Kode 2FA tidak valid atau sudah kedaluwarsa"
        end
    end
    Action->>Cookie: Sign HMAC timestamped session token
    Action-->>Login: Redirects to /admin with HttpOnly Secure Cookie
```

---

## 5. Security Threat Modeling & Countermeasure Matrix

| Threat Category (STRIDE) | Attack Vector | Technical Countermeasure in Nexa Studio |
| :--- | :--- | :--- |
| **Spoofing** | Forged Admin Session | Timestamped HMAC-SHA256 cookie signatures with constant-time verification; session revocation on secret rotation. |
| **Tampering** | Parameter Tampering & Polyglot Uploads | Byte-level **Magic Bytes** verification in `/api/admin/upload`; payload SHA-256 fingerprinting for contact form idempotency. |
| **Repudiation** | Denied Form Submissions | Database write is guaranteed prior to mailer invocation; audit logs with timestamps and unique UUID idempotency keys. |
| **Information Disclosure** | Database Credentials / Stack Trace Leak | Strict separation of `NEXT_PUBLIC_*` variables; generic client errors; health probe returns `503 Service Unavailable` without leaking error details. |
| **Denial of Service (DoS)** | Request Flooding / Large Payloads | Distributed sliding-window rate limiting via Upstash Redis (with per-process memory fallback); 32KB hard body limit on contact submissions. |
| **Elevation of Privilege** | Path Traversal & Unauthorized Mutation | Admin operations are protected by multi-layer authorization (Proxy route guard + Server Action guard + session check); uploads restricted to `/public/uploads/`. |
| **Brute Force & Timing** | Password / OTP Guessing | Bcrypt hashing with cost factor 10; `crypto.timingSafeEqual` for all token, session, and 2FA comparisons; rate-limited login endpoints. |

---

## 6. Database Schema & Data Integrity

The persistence layer is managed via **Prisma 6** connecting to **PostgreSQL (Neon Serverless)**:

```prisma
model Project {
  id          String   @id @default(uuid())
  title       String
  type        String
  result      String
  imagePath   String
  className   String   @default("")
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([order])
}

model ContactSubmission {
  id                   String    @id @default(uuid())
  name                 String
  email                String
  message              String
  emailSent            Boolean   @default(false)
  idempotencyKey       String?   @unique
  payloadHash          String?
  notificationStatus   String    @default("pending") // pending | sending | sent | failed
  notificationAttempts Int       @default(0)
  notificationNextAt   DateTime? @default(now())
  notificationLeaseAt  DateTime?
  notificationError    String?
  createdAt            DateTime  @default(now())

  @@index([createdAt])
  @@index([notificationStatus, notificationNextAt])
}
```

### Key Schema Design Decisions:
1. **Idempotency Key Uniqueness**: `idempotencyKey` has a `@unique` constraint to enforce that duplicate retries from flaky mobile connections never create duplicate records.
2. **Compound Index for Outbox Worker**: `@@index([notificationStatus, notificationNextAt])` ensures that the scheduled outbox query executes in $O(\log N)$ time without table scans.
3. **Atomic Lease Expiration**: The outbox worker sets `notificationLeaseAt` to prevent concurrent workers from claiming the same notification in multi-container deployments.

---

## 7. Automated Quality Gates & Compliance Results

The following is a local snapshot. CI on this changed commit, staging, and production have not been verified:

```text
================================================================================
QUALITY GATE VERIFICATION REPORT
================================================================================
1. ESLint (Code Quality & Hooks)            : PASSED (0 errors, 0 warnings)
2. TypeScript (Strict Typecheck)            : PASSED (0 type errors)
3. Vitest Unit & Integration Suites         : PASSED locally (20 suites, 66 tests on 2026-09-23)
4. Turbopack Production Compilation         : PASSED locally
5. Axe-core selected automated rules        : PASSED on tested pages
6. Playwright with isolated local DB         : PASSED (17 tests)
================================================================================
RELEASE STATUS                              : UNVERIFIED
================================================================================
```

### Detailed Breakdown of Unit Tests (`Vitest`):
- `__tests__/totp.test.ts` (4/4): Tests token generation, time-drift tolerance, and invalid secret handling.
- `__tests__/i18n.test.ts` (4/4): Tests complete dictionary parity between `ID` and `EN` across all section keys.
- `__tests__/contact-notification.test.ts` (5/5): Tests atomic outbox lease, exponential retry scheduling, and webhook alerts.
- `__tests__/contact-route.test.ts` (7/7): Tests size limits, honeypot rejection, anti-spam validation, idempotency conflict handling, and database persistence.
- `__tests__/rate-limit-redis.test.ts` & `rate-limit-capacity.test.ts` (2/2): Tests distributed Redis limiter and graceful memory fallback.
- `__tests__/admin-session.test.ts` (4/4): Tests HMAC cookie generation, expiration, and tampering detection.
- `__tests__/auth-action.test.ts` (1/1): Tests login action state, password verification, and session creation.
- `__tests__/health-route.test.ts` (2/2): Tests database readiness probe and information disclosure protection.
- `__tests__/validation.test.ts` & `project-validation.test.ts` (7/7): Tests Zod schema constraints on input fields.
- `__tests__/hardening-p0-p3.test.ts` (13/13): Tests core architectural boundaries and security constraints.

---

## 8. Auditor Step-by-Step Verification Runbook

For a comprehensive 10-minute technical evaluation by reviewers or auditors:

```bash
# Step 1: Install dependencies cleanly
npm ci

# Step 2: Validate code style and React hook rules
npm run lint

# Step 3: Verify TypeScript compiler zero-error policy
npx tsc --noEmit

# Step 4: Run full unit & integration test suites
npm test

# Step 5: Build optimized production bundles with Turbopack
npm run build

# Step 6: Verify automated WCAG accessibility standards (320px to 1440px)
npx playwright test e2e/accessibility.spec.ts

# Step 7: Verify responsive layout and public user experience
npx playwright test e2e/public-ui.spec.ts
```

---

## 9. Review status

No named reviewer or auditor sign-off is recorded for this Phase 2 checkout. See [PHASE2_STATUS.md](./PHASE2_STATUS.md) for remaining release checks.
