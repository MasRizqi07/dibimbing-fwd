# Nexa Studio — Modern Digital Agency Platform

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma 6](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Vitest-5.0-6E9F18?style=flat-square&logo=vitest)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E-2EAD33?style=flat-square&logo=playwright)](https://playwright.dev/)
[![Accessibility checks](https://img.shields.io/badge/Accessibility-automated_checks-blue?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Nexa Studio** is a Next.js 16 digital agency website with a project CMS and persisted lead intake. The local code checks are distinct from staging and production verification. Read [PHASE2_STATUS.md](./PHASE2_STATUS.md) before making a release claim.

---

## 📑 Table of Contents
1. [System Context & Core Value Proposition](#-system-context--core-value-proposition)
2. [Feature Architecture & Application Surfaces](#-feature-architecture--application-surfaces)
3. [Key Architectural Innovations](#-key-architectural-innovations)
4. [Design-to-Code Token Synchronization](#-design-to-code-token-synchronization)
5. [Repository Structure](#-repository-structure)
6. [Security & Compliance Posture](#-security--compliance-posture)
7. [Environment Configuration Matrix](#-environment-configuration-matrix)
8. [Local Development & Setup](#-local-development--setup)
9. [Quality Gates & Verification](#-quality-gates--verification)
10. [Reviewer & Auditor Quick Guide](#-reviewer--auditor-quick-guide)

---

## 🏛 System Context & Core Value Proposition

Nexa Studio bridges the gap between high-converting creative agency presentation and strict software engineering discipline:

- **Server-rendered public site**: Next.js Server Components and optimized images; field Core Web Vitals have not been measured here.
- **Persisted lead capture**: Database persistence is separate from email and webhook delivery, with idempotency and retry state.
- **Design Prototype Fidelity**: Exact translation of visual mockups in `Design/` into accessible, responsive markup (320px to 1440px desktop max-width).
- **Security controls**: HMAC sessions, image decode and re-encoding, configurable malware scan, rate limiting, and TOTP with replay protection.
- **Interface localization**: ID/EN switching covers public pages, forms, error states, and admin controls. User-authored project and lead content remains in its stored language.

---

## 🚀 Feature Architecture & Application Surfaces

### 1. Public Creative Surfaces
- **Hero & Growth Illustration**: Editorial headline and a vector chart with figures explicitly labeled as illustrative rather than measured client results.
- **Wordmark Concepts**: Typographic logo strip labeled as visual exploration, without implying client relationships.
- **Interactive Service Catalog (`ServiceCatalog.tsx`)**: Client-side categorization pills, debounced search filtering, ARIA live region status announcements, and empty-state reset workflows.
- **Visual Concept Showcase**: Project cards link to concept details only when their titles match an available route. Prototype images do not imply client work or measured KPIs.
- **Concept Details (`/work/[slug]`)**: Dynamic bilingual pages show supplied mockups with an explicit provenance note and no unverified metrics, testimonials, or live links.
- **Process & Pricing Matrix**: 4-step horizontal delivery roadmap and a transparent 3-tier pricing matrix (Starter, Growth [Featured Navy Card], Enterprise Custom).
- **High-Conversion Contact Anchor (`ContactForm.tsx`)**: Dark navy high-contrast container with dual idempotency guards, honeypot traps, signed anti-spam tokens, and instant feedback.
- **Guided Project Wizard (`/start`)**: 4-step questionnaire covering service scope, budget tiers, timeline choices, company brief, and business contact info.
- **Legal Information (`/privacy`, `/terms`)**: Bilingual pages describe data handling and service terms. English text is visibly marked as a draft pending legal review.
- **Error Boundaries**: Branded `/not-found` (404) with search navigation and `/error` global error boundaries with incident tracking identifiers.

### 2. CMS Management Portal (`/admin`)
- **Single-Owner Session Security**: Authenticated administrative dashboard guarded by HMAC-signed timestamped cookies and bcrypt hash verification.
- **Project CMS Manager**: Full CRUD capabilities for studio projects with visual order sorting, live publication toggles, and vetted asset selection.
- **Project image uploads (`/api/admin/upload`)**: Authenticated upload, full image decode, WebP normalization, optional local or required production ClamAV scan, and S3-compatible object storage.
- **Lead CRM Slide-Over Drawer**: Interactive lead inspection displaying submission payload, idempotency fingerprint, direct WhatsApp link generator (`wa.me`), and manual email retry triggers.
- **Multi-Factor Authentication (TOTP 2FA)**: Required in production, with one-time step consumption stored in PostgreSQL.

---

## ⚙️ Key Architectural Innovations

### 1. Persisted Lead Outbox & Idempotency Pipeline
Contact submissions never depend directly on external email delivery SLA. The submission lifecycle follows an ACID transactional pattern:

```mermaid
sequenceDiagram
    autonumber
    actor Client as Visitor Browser
    participant API as /api/contact
    participant Redis as Upstash / Local Memory
    participant DB as PostgreSQL (Neon)
    participant Worker as Background Outbox / Cron
    participant Ext as Webhook & Resend Email

    Client->>API: POST /api/contact (Signed Token, Idempotency-Key, Payload)
    API->>Redis: Check Rate Limit (IP-based)
    API->>API: Verify Signed Token & Honeypot Check
    API->>API: Validate Zod Schema & Compute SHA-256 Payload Hash
    API->>DB: Upsert ContactSubmission (Atomically claim or detect 409 conflict)
    API-->>Client: 200 OK (Accepted & Persisted in DB)
    Worker->>DB: Claim due email and webhook states with separate leases
    Worker->>Ext: Send email and signed webhook with stable idempotency keys
    Worker->>DB: Mark sent or schedule retry per channel
```

### 2. Project image processing
The admin upload route limits actual received bytes, scans the input, decodes a JPEG, PNG, WebP, or AVIF image within a pixel cap, re-encodes to WebP, scans the result, and writes to an S3-compatible bucket. Production uploads fail closed if required services are unavailable.

### 3. Reactive Internationalization (i18n) Engine
Built upon React 19's `useSyncExternalStore`:
- A cookie supplies the server-rendered locale and `useSyncExternalStore` supplies the client locale; browser tests cover reload and cross-page persistence.
- Public pages and admin controls are bilingual. Stored project/lead content is unchanged, and legal drafts need review.
- Cross-tab synchronization through the native browser `storage` event bus.
- The locale cookie is the server source of truth; `localStorage` broadcasts changes across tabs.

---

## 🎨 Design-to-Code Token Synchronization

All styling maps directly to design tokens extracted from visual references in `Design/` and configured in `app/globals.css`:

| Token Name | CSS Custom Property | Hex Value | Purpose / Role |
| :--- | :--- | :--- | :--- |
| **Canvas Cream** | `--canvas-cream` | `#F7F8F4` | Primary body background and high-clarity canvas |
| **Surface Navy** | `--surface-navy` / `--navy` | `#102A31` | High-impact cards, dark contact container, footer, admin |
| **High-Conversion Lime** | `--accent-lime` | `#C3F35B` | Primary interactive buttons, KPI highlights, badges |
| **Deep Ink** | `--ink-primary` | `#102027` | High-contrast editorial typography and headings |
| **Muted Ink** | `--ink-muted` | `#5C6E6D` | Subtitles, helper text, and secondary metadata |
| **Line Border** | `--border-line` | `#DFE6E4` | Crisp, architectural layout borders and dividers |
| **Semantic Success** | `--success` | `#2D9D78` | Successful submission states and live status pills |
| **Semantic Warning** | `--warning` | `#E59A32` | Attention indicators and retry warnings |
| **Semantic Danger** | `--danger` | `#E05252` | Validation errors, rate limit flags, and critical alerts |

---

## 📂 Repository Structure

```text
dibimbing-fwd/
├── app/                              # Next.js 16 App Router surfaces
│   ├── actions/auth.ts               # Authenticated server actions (login, logout, TOTP)
│   ├── admin/                        # CMS administrative portal & login view
│   ├── api/
│   │   ├── admin/upload/route.ts     # Secure image upload endpoint (magic byte validation)
│   │   ├── anti-spam/route.ts        # Cryptographic anti-spam token generator
│   │   ├── contact/route.ts          # Zero-loss contact submission endpoint
│   │   ├── cron/notifications/       # Outbox email retry processor
│   │   ├── health/route.ts           # Neon PostgreSQL readiness probe
│   │   └── live/route.ts             # Container / runtime liveness probe
│   ├── privacy/page.tsx              # Editorial Privacy Policy
│   ├── start/page.tsx                # Multi-step interactive project brief wizard
│   ├── terms/page.tsx                # Editorial Terms of Service
│   ├── work/[slug]/page.tsx          # Dynamic visual concept route
│   ├── globals.css                   # Design tokens & responsive utility classes
│   ├── layout.tsx                    # Root layout with JSON-LD, SEO, and LanguageProvider
│   └── page.tsx                      # Modular homepage Server Component
├── components/                       # Client & server UI component library
│   ├── admin/                        # Admin project forms, drawers, and status indicators
│   ├── ContactForm.tsx               # Client contact form with idempotency & token handling
│   ├── ServiceCatalog.tsx            # Searchable catalog with debounced filtering
│   └── SiteNav.tsx                   # Sticky nav with mobile drawer & i18n switcher
├── Design/                           # Original visual prototypes & markup specifications
├── e2e/                              # Playwright end-to-end browser test suites
│   ├── accessibility.spec.ts         # Axe-core automated WCAG 2.1 AA/AAA test suite
│   ├── admin.spec.ts                 # CMS authentication & CRUD E2E tests
│   ├── contact.spec.ts               # Contact submission, rate limit, & deduplication E2E
│   └── public-ui.spec.ts             # Public layout, responsive 320px–1440px, & menu tests
├── lib/                              # Infrastructure, domain models, and utilities
│   ├── i18n/                         # Types, dictionaries (ID/EN), and useSyncExternalStore
│   ├── admin-session.ts              # HMAC signed session cookie verification
│   ├── case-studies.ts               # Prototype concept definitions & route resolver
│   ├── contact-notification.ts       # Outbox leasing, Resend dispatcher, & webhook alert
│   ├── prisma.ts                     # Neon PostgreSQL Prisma 6 client instance
│   ├── rate-limit.ts                 # Upstash Redis distributed & in-memory sliding window
│   └── totp.ts                       # RFC 6238 TOTP generator & constant-time verifier
├── prisma/                           # Schema definitions, migrations, and seed scripts
└── __tests__/                        # Vitest unit & integration tests
```

---

## 🔒 Security & Compliance Posture

| Domain | Mechanism | Implementation Details |
| :--- | :--- | :--- |
| **Authentication** | HMAC Signed Cookies + Bcrypt | Constant-time HMAC verification with timestamp validation; bcrypt password hashes. |
| **Multi-Factor Auth** | RFC 6238 TOTP 2FA | SHA1 HMAC algorithm, 30s window, ±1 step drift tolerance, `crypto.timingSafeEqual` comparison. |
| **File Uploads** | Image normalization and scan | 5 MB input limit, full decode, WebP re-encoding, and ClamAV scan in production. |
| **Abuse & Spam** | Signed Anti-Spam Tokens | Tokens signed with timestamp to enforce minimum interaction threshold and automatic expiration. |
| **DDoS & Flooding** | Distributed Rate Limiting | Upstash Redis sliding window with in-memory fallback per instance; trusted reverse proxy headers. |
| **Idempotency** | UUID Key + SHA-256 Hash | Prevents duplicate contact submissions; mismatching payload with duplicate key yields `409 Conflict`. |
| **Data Privacy** | Retention and disclosure | Privacy policy and explicit purge script; legal compliance needs specialist review and deployed infrastructure evidence. |
| **Accessibility** | Automated checks | Axe checks selected pages and rules; manual screen reader and keyboard review remains required. |

---

## ⚙️ Environment Configuration Matrix

Copy `.env.example` to `.env.local` for local execution. Configure the following keys:

| Environment Variable | Category | Required? | Default / Example | Purpose |
| :--- | :--- | :---: | :--- | :--- |
| `DATABASE_URL` | Database | **Yes** | `postgresql://...` | Connection URI for Neon PostgreSQL database. |
| `ADMIN_PASSWORD` | Security | **Yes** | `\$2b\$10\$...` | Bcrypt hash for admin login (escape `$` in `.env.local`). |
| `ADMIN_SESSION_SECRET` | Security | **Yes** | `32+ char secret` | Secret used to sign admin session cookies and anti-spam tokens. |
| `ADMIN_TOTP_SECRET` | Security | **Production required** | `Base32 string` | Single-owner TOTP secret; enroll before release. |
| `NOTIFICATION_WEBHOOK_URL`, `NOTIFICATION_WEBHOOK_SECRET`, `NOTIFICATION_WEBHOOK_KIND` | Integration | Optional pair | `generic` / `slack` / `discord` | Signed persisted webhook delivery when configured. |
| `PROJECT_MEDIA_BUCKET`, `PROJECT_MEDIA_REGION`, `PROJECT_MEDIA_ENDPOINT` | Storage | Upload required | S3-compatible bucket | Object storage for new project images. |
| `CLAMAV_SOCKET_PATH` or `CLAMAV_HOST` | Security | **Production uploads required** | Private scanner | Malware scan before storage. |
| `RESEND_API_KEY` | Email | Optional | `re_...` | API key for automated contact notification emails. |
| `CONTACT_EMAIL_TO` | Email | Optional | `admin@nexastudio.com` | Destination inbox for new lead notifications. |
| `RESEND_FROM_EMAIL` | Email | Optional | `onboarding@resend.dev` | Verified sender email address. |
| `CRON_SECRET` | Ops | Optional | `random-secret` | Bearer token authorization for `/api/cron/notifications`. |
| `UPSTASH_REDIS_REST_URL` | Limiter | Optional | `https://...upstash.io` | Upstash Redis REST endpoint for distributed rate limiting. |
| `UPSTASH_REDIS_REST_TOKEN` | Limiter | Optional | `AX...` | Upstash Redis REST token. |
| `NEXT_PUBLIC_SITE_URL` | Public | Optional | `http://localhost:3000` | Canonical site URL for Open Graph metadata and sitemaps. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER`| Public | Optional | `6281234567890` | WhatsApp consultation destination number. |

The included Vercel schedule runs once daily to remain compatible with the Hobby plan. If lead notifications must be delivered sooner, configure Vercel Pro or an external scheduler to call the same authenticated endpoint at the required interval.

---

## 🛠 Local Development & Setup

### 1. Prerequisites
- **Node.js**: v22.12.0 or higher
- **npm**: v10.0.0 or higher
- **PostgreSQL**: Local PostgreSQL or remote Neon database

### 2. Quick Start

```bash
# 1. Clone repository & install dependencies
git clone <repository-url>
cd dibimbing-fwd
npm ci

# 2. Configure environment
cp .env.example .env.local
# Edit .env.local with your database URL and secrets

# Generate an authenticator enrollment secret (do not commit the output)
npm run phase2:enroll-totp -- owner "Nexa Studio"

# After loading deployment variables into the process environment, validate
# the Phase 2 contract without printing secret values
npm run phase2:check-config

# 3. Apply database schema & seed initial visual concepts
npm run db:migrate
node --experimental-strip-types prisma/seed.ts

# 4. Start development server with Turbopack
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application. The admin portal is available at `/admin`.

---

## 🧪 Quality Gates & Verification

Run these local gates, then verify exact-commit CI and staging separately:

```bash
# 1. Static Analysis & Linting (ESLint + Next.js rules)
npm run lint

# 2. Static Type Checking (TypeScript 5 strict mode)
npx tsc --noEmit

# 3. Unit and integration tests
npm test

# 4. Production Compilation (Turbopack)
npm run build

# 5. Automated accessibility checks (selected rules and pages)
npx playwright test e2e/accessibility.spec.ts

# 6. Full End-to-End Browser Tests (Desktop, Tablet, Mobile)
npx playwright test
```

### Test Suite Summary
- **Unit & Integration (`Vitest`)**: The current Phase 2 local run passed 66 tests in 20 files.
- **End-to-End (`Playwright`)**: 20 scenarios exist. Database mutation and MFA replay scenarios require `E2E_TEST_MODE=1` with an isolated local `TEST_DATABASE_URL`.

---

## 🔍 Reviewer & Auditor Quick Guide

To rapidly audit and verify the technical implementation of Nexa Studio:

1. **Verify Security Contracts**:
   - Check magic-byte image validation in [`app/api/admin/upload/route.ts`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/api/admin/upload/route.ts).
   - Check RFC 6238 TOTP verification in [`lib/totp.ts`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/lib/totp.ts).
   - Check anti-spam cryptographic signing in [`lib/anti-spam.ts`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/lib/anti-spam.ts).
2. **Inspect Rendering & Boundary Architecture**:
   - Check Server Component root in [`app/page.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/app/page.tsx) with selective client boundaries.
   - Check `useSyncExternalStore` implementation in [`lib/i18n/context.tsx`](file:///d:/MY%20CODE/VS%20CODE/dibimbing-fwd/lib/i18n/context.tsx).
3. **Inspect Prototype-to-Code Fidelity**:
   - Compare `app/page.tsx` and `components/SiteNav.tsx` directly against `Design/code.html` and visual mockups in `Design/`.
4. **Execute Clean Verification**:
   - Run `npm test` and `npm run build` to confirm zero warnings, zero type errors, and zero test regressions.

---

## 📄 License & Credits
- Built with pride by the **Nexa Studio Engineering Team**.
- Portfolio photography sourced from Unsplash artists (Nathan Dumlao, Alyssa Strohmann, Engin Akyurt) for concept illustration purposes.
