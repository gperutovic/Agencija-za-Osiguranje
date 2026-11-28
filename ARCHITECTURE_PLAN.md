# ARCHITECTURE & IMPLEMENTATION PLAN — VEDRO Digital Insurance Agency Platform

**Project Workspace:** `agencija-zivot-insurance` (deployed to Firebase project `agencija-za-osiguranje`)  
**Brand Identity:** **Vedro** (*Vedro d.o.o. za zastupanje u osiguranju* — fully configurable in `src/config/brand.ts`)  
**Regulatory Jurisdiction:** Republic of Croatia (*Zakon o osiguranju*, HANFA supervision, EU IDD 2016/97, GDPR/AZOP)  
**Design System:** Swiss-Editorial InsurTech (inspired by Lemonade.com: pure white `#FFFFFF` + warm off-white `#F7F7F5`, hairline `#E5E7EB`, deep ink `#111827`, single Signal Coral/Magenta accent `#FF006E`, editorial `Instrument Serif` + `Plus Jakarta Sans` with `tabular-nums`, bespoke thin-stroke monochrome line-art SVGs).

---

## 1. Phase 0 Live Audit Summary & Feature Migration Matrix

### Key Bugs Observed on Legacy Reference Sites
| Reference Site | Observed Issues (1440px Desktop & 390px Mobile) | Resolution in Ground-Up Rebuild |
|---|---|---|
| `agencija-zivot.web.app` (Dark Theme) | Fixed header clips hero badge at 390px; decorative glow containers cause horizontal overflow (`right: 439px`); transparent `Prijava / Portali` dropdown collides unreadably over Hero H1; dense 8-item top bar; floating robot FAB obscures CTAs; unauthenticated Admin Hub; repeated Firestore `Listen/channel` `net::ERR_ABORTED` errors. | Pure light Swiss-Editorial system (`overflow-x-hidden` safe by construction, zero glow blobs); single-row 5-item header; solid opaque menus; zero floating chat FABs; dedicated `/ai-savjetnik` route; role-gated `/moj-profil` & `/admin`; clean request-based repository layer with zero unauthenticated `onSnapshot` listeners. |
| `agencija-za-osiguranje.web.app` (Light Build) | Floating bottom-right `Trebate savjet?` widget overlaps partner bar on `/` and date picker on `/contact`; `/portal` and `/admin` pre-authenticated without login; corporate card grid lacks single focal conversion funnel; Firestore `Listen/channel` `ERR_ABORTED`. | Remove all floating widgets; adopt Lemonade's distraction-free centered hero + selectable bundle cards + 90-second flipped-funnel `/izracun`; enforce explicit auth gate (with clear demo-persona quick login inside sign-in view). |
| `lemonade.com` (Benchmark Role Model) | Strengths to adopt: serene `#FFFFFF` / `#F7F7F5` alternation, serif H1 (`Merriweather` -> `Instrument Serif`) + geometric sans (`Plus Jakarta Sans`), single magenta CTA accent, flanking thin-stroke monochrome line-art, selectable bundle cards with starting monthly prices, distraction-free one-question-per-screen onboarding (`chat.lemonade.com`), clean switching prompt, understated 4-column footer. | Translated natively to Croatian InsurTech agency business model (multi-carrier comparison across 7 Croatian insurers, OIB ISO 7064 validation, earthquake cover, IPID preview/download, HANFA IDD disclosures). |

### Feature Mapping: Current -> Target Action
| Current / Legacy Feature | Action | Implementation Target |
|---|---|---|
| Dark neon hero + Toyota VIP boxed widget + multi-CTA cluster | **Replace** | Centered editorial hero (`Instrument Serif`), quick product selector pills, single `#FF006E` CTA, flanking thin-stroke `HeroNeighborhoodScene` SVG, understated monochrome HANFA & partner bar. |
| Separate static calculator pages (`Auto`, `Dopunsko`, `Imovina`) | **Upgrade & Consolidate** | Unified 90-second **Flipped-Funnel Quote Engine** (`/izracun` & `/izracun/:product`) covering 7 lines (`auto`, `imovina`, `zdravstveno`, `zivotno`, `putno`, `ljubimci`, `poslovno`) + live multi-carrier comparison + real-time deductible/sum/add-on sliders + Policy 2.0 "Što je pokriveno / Što nije" drawer + IPID PDF download. |
| Multi-policy bundle messaging | **Add from Lemonade** | Interactive selectable **Bundle Showcase Cards** on `/` with live multi-policy discount calculation (up to 15%) carried seamlessly into `/izracun`. |
| Existing policy switching | **Add from Lemonade** | Dedicated **Switch & Save Policy Analyzer** (`/usporedi-policu`) with drag-and-drop PDF/JPG/PNG upload, Gemini AI structured JSON extraction + manual edit fallback, instant savings estimate, and *skadenca* expiry reminder scheduling. |
| Floating AI Chatbot / `Agent Savjetnik` modal | **Replace** | Full-page dedicated **AI Insurance Advisor** (`/ai-savjetnik`) powered by Gemini API (with domain fallback), inline structured Coverage Comparison & Quote cards, and `"Prebaci na ljudskog agenta"` escalation attaching the full transcript to the Admin queue. |
| Multi-step Claims Intake (FNOL) | **Upgrade** | Empathetic 5-step **Digital FNOL Concierge** (`/prijava-stete`) with drag-and-drop photo/European Accident Statement upload, instant reference (`STETA-2026-XXXX`), and live 4-stage status tracker (`Zaprimljeno` -> `U obradi kod osiguratelja` -> `Procjena` -> `Isplaćeno`). |
| Unauthenticated Client Portal (`/portal`) | **Upgrade** | Auth-gated **Moj Profil** (`/moj-profil`): KPI overview, Digital Policy Wallet (Policy PDF, Green Card, IPID downloads, 1-click renewal & modification requests), Claims History + extra document upload, and Advisor Message Center. |
| Unauthenticated Admin Dashboard (`/admin`) | **Upgrade** | Role-protected **Lean Agency Ops Portal** (`/admin`): KPI bar (conversion, GWP, est. commission, response time), Lead/Quote/Switch/AI-Escalation Kanban & Table pipeline, 60/30/15-day **Renewal Radar (*Skadencar*)**, Claims Triage Queue with photo inspection & live stage updates, and Complaints Register. |
| Croatian OIB / Phone / Postal / Plate Validation | **Keep & Upgrade** | Strict `src/utils/croatianValidators.ts` (ISO 7064 Mod 11,10 OIB, Croatian license plates `ZG-1234-AB`, `+385` phone, `10000–53296` postal codes, `HR` IBAN) with full Vitest unit test coverage. |
| Legal, Privacy, Cookies & Art. 401 Complaints | **Keep & Upgrade** | Dedicated `/pravne-informacije`, `/privatnost`, `/kolacici`, `/prigovori` routes with HANFA Registry link, partner insurers list, commission remuneration disclosure, Art. 401 protocol IDs (`PRIG-2026-XXXX`), and logged GDPR/IPID consent timestamps on every submission. |

---

## 2. Folder Structure

```text
agencija-zivot-insurance/
├── ARCHITECTURE_PLAN.md
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── vitest.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── firebase.json
├── .firebaserc
├── firestore.rules                # Authored via firestore-rules-author subagent
├── firestore.indexes.json
├── storage.rules
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── styles/
    │   ├── tokens.css             # Single-source CSS variables (accent, surfaces, typography)
    │   └── index.css              # Tailwind directives + tabular-nums + reduced-motion rules
    ├── config/
    │   └── brand.ts               # Configurable agency brand, HANFA ID, partner insurers, accent
    ├── i18n/
    │   ├── translations.ts        # Native HR + EN dictionary
    │   └── LanguageContext.tsx    # HR/EN toggle provider
    ├── types/
    │   └── domain.ts              # Strict TypeScript domain models (zero `any`)
    ├── utils/
    │   ├── croatianValidators.ts  # ISO 7064 OIB, plates, phone, postal, IBAN
    │   ├── croatianValidators.test.ts
    │   ├── formatters.ts          # hr-HR EUR currency, dates, countdowns
    │   ├── pricingEngine.ts       # Multi-carrier actuarial quote & bundle pricing engine
    │   ├── pricingEngine.test.ts
    │   └── documentGenerator.ts   # Zero-corrupt UTF-8 Croatian PDF/HTML IPID, Green Card & Quote downloads
    ├── services/
    │   ├── firebase.ts            # Firebase Auth, Firestore, Storage initialization
    │   ├── seedData.ts            # Realistic Croatian demo policies, quotes, claims, messages
    │   ├── agencyRepository.ts    # Unified Firestore + REST (`/api/*`) + local persistence layer
    │   └── aiService.ts           # Gemini API text & policy-document extraction + deterministic fallback
    ├── context/
    │   └── AuthContext.tsx        # Firebase Auth + explicit role-gated demo account sign-in
    ├── components/
    │   ├── illustrations/
    │   │   └── EditorialIllustrations.tsx  # Bespoke charcoal + accent thin-stroke SVGs
    │   ├── layout/
    │   │   ├── Header.tsx         # Single-row sticky header + editorial mega-menu + clean mobile drawer
    │   │   ├── Footer.tsx         # HANFA-compliant 4-column footer
    │   │   ├── CookieBanner.tsx   # Subtle non-occluding GDPR consent bar
    │   │   └── Layout.tsx
    │   ├── ui/
    │   │   ├── Button.tsx
    │   │   ├── Input.tsx
    │   │   ├── Badge.tsx
    │   │   ├── Drawer.tsx
    │   │   ├── Modal.tsx
    │   │   ├── ProgressBar.tsx
    │   │   └── Toast.tsx
    │   └── quote/
    │       ├── CoverageDrawer.tsx # Plain-language "Što je pokriveno / Što nije" + IPID download
    │       └── QuoteCheckoutModal.tsx # OIB/IBAN + GDPR/IPID consent + quote confirmation
    └── pages/
        ├── HomePage.tsx
        ├── QuoteEnginePage.tsx    # Flipped-funnel 90s onboarding + live multi-carrier customizer
        ├── SwitchAndSavePage.tsx  # Policy PDF/Image upload + Gemini parser + skadenca reminder
        ├── AiAdvisorPage.tsx      # Dedicated AI Advisor + structured cards + human escalation
        ├── ClaimsFnolPage.tsx     # 5-step guided FNOL + photo upload + live status tracker
        ├── ClientPortalPage.tsx   # Auth-gated Moj Profil (wallet, claims, endorsements, messages)
        ├── AdminOpsPage.tsx       # Role-protected Agency Ops (Kanban, Skadencar, Claims Triage, Complaints)
        ├── AboutPage.tsx
        └── LegalPages.tsx         # /pravne-informacije, /privatnost, /kolacici, /prigovori
```

---

## 3. Core TypeScript Domain Models (`src/types/domain.ts`)

- `ProductLine = 'auto' | 'imovina' | 'zdravstveno' | 'zivotno' | 'putno' | 'ljubimci' | 'poslovno'`
- `UserRole = 'client' | 'agent' | 'admin'`
- `UserProfile`: `{ uid, email, fullName, role, phone, oib?, city?, postalCode?, createdAt }`
- `ConsentRecord`: `{ ipidAcknowledged: boolean; gdprEssential: boolean; gdprMarketing: boolean; timestamp: string; policyVersion: string }`
- `QuoteInput`: discriminated union per `ProductLine` (`AutoQuoteInput`, `PropertyQuoteInput`, `HealthQuoteInput`, `LifeQuoteInput`, `TravelQuoteInput`, `PetQuoteInput`, `BusinessQuoteInput`) + `bundleProducts: ProductLine[]` + `customization: CoverageCustomization` (`deductible`, `coverageLimit`, `billingCycle`, `addons`).
- `CarrierOffer`: `{ carrierId, carrierName, tierLabel, monthlyPrice, annualPrice, bundleDiscountPercent, deductible, coverageLimit, coveredItems, excludedItems, ipidCode, highlightBadge? }`
- `QuoteSubmission`: `{ id, referenceNumber, userId?, productLine, bundleProducts, inputs, selectedOffer, customer, consents, status: 'new' | 'quoted' | 'bound' | 'lost', assignedAgent?, source: 'quote_engine' | 'switch_save' | 'ai_escalation', notes?, createdAt, updatedAt }`
- `SwitchAnalysisRecord`: `{ id, userId?, fileName, extractedPolicy: { insurer, productLine, expiryDate, currentAnnualPremium, bonusPercent?, deductible? }, estimatedAnnualSavings, reminderScheduledFor, customerEmail?, customerPhone?, status, createdAt }`
- `PolicyRecord`: `{ id, policyNumber, userId, clientName, clientOib, productLine, carrierName, status: 'active' | 'expiring_soon' | 'expired' | 'pending_renewal', startDate, expiryDate, annualPremium, monthlyPremium, deductible, coverageLimit, vehiclePlate?, propertyAddress?, greenCardNumber?, ipidCode, renewalReminderSentAt?, endorsements: PolicyEndorsement[] }`
- `ClaimStage = 'received' | 'insurer_review' | 'assessment' | 'paid'`
- `ClaimRecord`: `{ id, referenceNumber, userId?, policyNumber, productLine, carrierName, claimantName, claimantOib, claimantEmail, claimantPhone, incidentDate, incidentTime, incidentLocation, description, policeReportFiled, attachments: ClaimAttachment[], stage: ClaimStage, stageHistory, consents, estimatedAmount?, createdAt, updatedAt }`
- `AdvisorMessage`: `{ id, threadUserId, senderRole: 'client' | 'agent', senderName, text, createdAt }`
- `AiEscalationRecord`: `{ id, referenceNumber, userId?, customerName, customerEmail, customerPhone, topic, transcript, status, assignedAgent?, createdAt }`
- `ComplaintRecord`: `{ id, protocolNumber, fullName, oib, email, phone, address, policyNumber?, subject, description, status: 'received' | 'in_review' | 'resolved', statutoryDeadlineDate, createdAt }`

---

## 4. Design Token System (`src/styles/tokens.css`)

```css
:root {
  --color-canvas: #FFFFFF;
  --color-canvas-warm: #F7F7F5;
  --color-border: #E5E7EB;
  --color-border-strong: #D1D5DB;
  --color-ink: #111827;
  --color-ink-secondary: #4B5563;
  --color-ink-muted: #6B7280;
  --color-accent: #FF006E;
  --color-accent-hover: #D9005D;
  --color-accent-soft: #FFF0F6;
  --color-success: #059669;
  --color-warning: #D97706;
  --color-danger: #DC2626;
  --font-display: 'Instrument Serif', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
}
```
Re-theming the entire brand accent or typography requires editing only `src/styles/tokens.css` and `src/config/brand.ts`.

---

## 5. API & Firestore Schema

All collections support both Firestore (when Firebase is configured/authenticated) and optional REST endpoints (`VITE_API_BASE_URL` -> `/api/quotes`, `/api/claims`, `/api/policies`, `/api/ai`), with deterministic `localStorage` + seed persistence fallback:
- `users/{uid}` — user profile & role (`client`, `agent`, `admin`)
- `quotes/{quoteId}` — binding quote submissions with `ConsentRecord`
- `switch_analyses/{analysisId}` — uploaded policy switching leads & *skadenca* expiry dates
- `policies/{policyId}` — active policies, Green Card metadata, endorsement requests
- `claims/{claimId}` — FNOL reports, Storage/attachment metadata, live stage history
- `escalations/{escalationId}` — AI Advisor transcripts escalated to human agents
- `messages/{messageId}` — Client-Advisor secure message center threads
- `complaints/{complaintId}` — Statutory Art. 401 complaints register (`PRIG-2026-XXXX`)

---

## 6. Verification & Quality Gates Plan

1. **Static & Build Verification:**
   - `npm run typecheck` (`tsc --noEmit` with `strict: true`, zero `any`).
   - `npm run build` (`vite build` production bundle with zero errors).
2. **Automated Unit Tests (`npm run test` via Vitest):**
   - `croatianValidators.test.ts`: valid & invalid OIBs (including edge cases, wrong checksum, non-11-digit inputs), Croatian plates (`ZG-1234-AB`, `ST 999 AA`, invalid codes), Croatian `+385` phone numbers, postal codes (`10000`–`53296`), and `HR` IBANs.
   - `pricingEngine.test.ts`: Auto AO+Kasko pricing sensitivity to kW, bonus (`0%–50%`), young driver surcharge, deductible slider recalculation, Property earthquake add-on calculation, and multi-policy bundle discount application.
3. **Live Browser Audit via Browser Subagent (Desktop `1440×900` & Mobile `390×844`):**
   - Start Vite dev/preview server locally and audit in the Antigravity Browser Subagent:
     - Complete an end-to-end **Auto Insurance** quote through the 90-second flipped funnel.
     - Test real-time slider & add-on recalculation across carrier cards + inspect Policy 2.0 Coverage Drawer.
     - Test **invalid OIB rejection** followed by **valid OIB acceptance** and quote submission.
     - Test **Switch & Save** upload & savings calculation.
     - Test **AI Advisor** structured response & escalation.
     - Submit a mock **FNOL Claim** with file upload and verify instant claim reference + status tracking.
     - Sign into **Client Portal (`/moj-profil`)** and **Admin Ops (`/admin`)** and verify pipeline & stage sync.
     - Audit Mobile (`390×844`) navigation drawer, zero horizontal overflow (`scrollWidth <= innerWidth`), zero overlapping widgets, and capture screenshots confirming Swiss-Editorial polish with zero vibe-coded artifacts.
