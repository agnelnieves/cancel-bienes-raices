# Launch plan and cost model

> **As of:** July 29, 2026  
> **Market:** Puerto Rico first  
> **Currency:** USD  
> **Decision:** Launch with Supabase + Better Auth and an owned/licensed data
> strategy. Do not make RED Atlas the production dependency until a separate
> customer-facing commercialization agreement is signed.

This is a planning estimate, not a vendor quote or legal/tax advice. Vendor
prices and Puerto Rico tax treatment should be reconfirmed immediately before
signing contracts.

## The number to take into the partner meeting

For the product as it exists today, the credible ask is:

- **$35,000-$60,000 in launch cash** for legal/data setup, outside review, and
  six months of non-payroll runway, assuming the founders contribute the
  product engineering.
- **$85,000-$200,000 fully funded** if the remaining production engineering is
  paid at market rates instead of contributed as founder labor.
- A **signed data-rights plan** and a **signed JV/revenue-allocation agreement**
  are launch requirements, not later cleanup.

The midpoint proposal is simple: **fund $50,000, keep RED Atlas out of the
critical path, and run a six-month Puerto Rico validation period.**

If RED Atlas is required for customer-facing data, reserve another
**approximately $10,000 per month as a planning placeholder** until a signed
commercial quote says otherwise. Its public self-serve API terms do not
authorize the use this platform needs.

## What is being funded

The current repository is a polished product demo, not yet a production SaaS.
It has two Next.js applications, nine product areas, mock property data,
browser-persisted Zustand state, no authentication, no database, no billing,
no transactional email, and a deterministic local Copilot.

Productionizing the full current scope means:

1. moving user, analysis, pipeline, saved-property, credit, and community state
   from local storage to a real database;
2. adding Better Auth, roles, sessions, verification, password reset, and
   account recovery;
3. adding Stripe subscriptions, entitlements, webhooks, failed-payment
   handling, and tax configuration;
4. acquiring data under written customer-facing rights, normalizing it,
   showing provenance/freshness, and building contributor QA;
5. turning the Copilot interface into real tool-calling through AI Gateway,
   with limits, logging, evaluations, and the deterministic engine as fallback;
6. replacing development map tiles, adding email, analytics, monitoring,
   backups, security controls, and an incident/rollback process;
7. validating or removing every marketing statistic, data-source claim, and
   testimonial before public launch.

## Recommended production stack

| Layer | Launch choice | Why | Launch price |
| --- | --- | --- | ---: |
| Hosting/CDN/functions | Vercel Pro | Native fit for both Next.js apps; previews, WAF, CDN, rollback, spend controls | $20/mo for one developer |
| Production database | Supabase Pro | Postgres, Storage, Realtime, backups, RLS, PostGIS; good founder relationship | $25/mo |
| Staging database | Supabase branch or short-lived project | Test migrations and webhooks away from production | about $10/mo if kept all month |
| Authentication | Better Auth, self-hosted | Required choice; framework is free/MIT and uses the Supabase Postgres database | $0 fixed |
| Transactional email | Resend Pro | Verification, password reset, receipts, alerts | $20/mo |
| Marketing email | Existing community channel or Resend Marketing | Product/newsletter broadcasts are priced separately from transactional email | optional $40/mo for 5,000 contacts |
| Maps | MapLibre + MapTiler Flex | MapLibre remains the renderer; Flex permits commercial tile use | $25/mo |
| AI routing | Vercel AI Gateway | One model interface, budgets, provider fallback, tags and usage visibility | usage only |
| AI model | `openai/gpt-5.4-mini` | Strong structured output/tool calling at a low token price | $0.75/M input, $4.50/M output |
| Billing | Stripe Checkout + Billing + Customer Portal | Fastest safe recurring-subscription implementation | usage only |
| Tax calculation | Stripe Tax Basic, after CPA classification | Automates calculation/collection; filing still needs an owner/process | 0.5% of taxable transactions |
| Product analytics | PostHog free tier | Funnels, activation, session replay, surveys, errors | $0 at launch |
| Runtime monitoring | Vercel Observability Plus | 30-day runtime logs and useful production queries | $10/mo + $1.20/M events |
| Domain/DNS/SSL | Vercel domain or existing registrar | SSL and DNS can stay with Vercel | about $2/mo annualized |
| File storage | Supabase Storage | Avatars, evidence, reports and contractor media | included initially |
| Off-platform logical backup | Encrypted scheduled export to S3/R2 or equivalent | Protect the proprietary dataset from an account/provider failure | about $0-$5/mo initially |
| Scheduled work | Vercel Cron/Functions | Data refresh, email digest and cleanup jobs | included at launch usage |

**Predictable fixed platform floor: approximately $112/month.**

That is $20 Vercel + $25 Supabase + $10 staging + $20 Resend + $25
MapTiler + $10 Observability + about $2 for the domain. Better Auth, Stripe,
AI Gateway, and PostHog do not add a fixed charge at this stage.

Add **$20/month per additional Vercel developer seat**. Non-developer viewers
do not need a paid seat. Use two Vercel projects (`web` and `app`) inside the
same Pro team.

### Why Supabase instead of Neon

Neon is a good database-only alternative and may be cheaper while idle:
Launch is usage-based at $0.106/CU-hour and $0.35/GB-month, with a published
typical intermittent workload of about $15/month. It also has excellent
branching and scale-to-zero.

Supabase is the better launch choice here because:

- the founder already has a good relationship with Supabase;
- this app benefits from bundled Storage, Realtime, backups, and PostGIS;
- the $25 production floor is predictable;
- it avoids adding separate storage/realtime services;
- Better Auth works with its Postgres database, so choosing Supabase does not
  require using Supabase Auth.

Use Supabase as infrastructure, not as the identity product. Keep application
data access server-side at launch, validate Better Auth sessions on protected
pages/actions, and enforce ownership in database queries/RLS. Neon remains a
credible fallback if the Supabase relationship does not produce operational
value.

### Better Auth implementation budget

The open-source Better Auth framework is free. Vercel acquired Better Auth in
July 2026 and stated that it remains free and MIT licensed. Its optional
managed infrastructure is $20/month, but it is unnecessary for launch because
Supabase stores sessions and Resend sends email.

The production setup should include:

- email/password, email verification, password reset, and session revocation;
- `/api/auth/[...all]` in the product app;
- database-backed users, sessions, accounts, and verification records;
- `BETTER_AUTH_SECRET` and `BETTER_AUTH_URL` per environment;
- secure cookies and trusted production/preview origins;
- optimistic redirects in Next.js 16 `proxy.ts`, plus real server-side session
  validation for every protected page, action, and API route;
- rate limits for signup, signin, reset, and verification endpoints;
- roles for member, community member, realtor contributor, staff, and admin;
- Resend-backed verification/reset callbacks;
- account deletion/export and an audit trail for sensitive actions.

## Variable unit costs

### Stripe at the current $30 Pro price

For a successful domestic-card monthly subscription:

| Charge | Calculation | Cost |
| --- | ---: | ---: |
| Stripe Payments | 2.9% of $30 + $0.30 | $1.17 |
| Stripe Billing | 0.7% of $30 | $0.21 |
| Stripe Tax Basic, if enabled | 0.5% of $30 | $0.15 |
| **Total** | **5.1% of revenue** | **$1.53/subscriber/month** |

Without Stripe Tax, the total is **$1.38**, or 4.6%. International cards,
currency conversion, disputes, refunds, and chargebacks cost more. The
planning model uses **$1.53** so tax calculation is not conveniently omitted.
IVU collected from customers is a liability/pass-through, not product revenue.

Puerto Rico counsel/CPA must classify the subscription and set the correct
state and municipal IVU process. Hacienda allows merchant registration and
monthly IVU filing through SURI; municipal handling changes on August 1, 2026
for participating municipalities.

### AI Gateway

Model assumption for planning:

- 20 Copilot interactions per paid user per month;
- 6,000 input and 600 output tokens per interaction;
- GPT-5.4 mini at $0.75/M input and $4.50/M output.

That is about **$0.144 per paid user per month**, rounded to **$0.15**. A user
at ten times that usage costs about $1.44. Web search or other paid tools are
additional and should not be on by default for a database-backed comps
workflow.

AI Gateway currently gives a team $5/month of free usage until the account
moves to paid credits, with zero model markup. Do not rely on the promotional
credit in the budget. Set team budgets, per-user rate limits, usage tags, and
an internal fair-use policy even if the public tier says “Copiloto AI sin
límites.”

### Map use

MapTiler Flex includes 25,000 initialized map sessions per month and 500,000
API requests. Extra sessions are $2/1,000; extra requests are $0.10/1,000.
This should cover launch comfortably. The current free CARTO tiles should not
be the commercial production assumption.

### Email and analytics

Resend Free permits 3,000 transactional emails/month but only 100/day. It is
fine for an invite-only test but too easy to hit during a real launch, so the
budget uses Pro: $20 for 50,000/month and $0.90/1,000 overage. Marketing
broadcasts are a separate product; moving the 1,600-person free audience into
Resend Marketing would fit its current $40/month 5,000-contact tier.

PostHog's free allocation currently includes 1M analytics events, 5,000 session
recordings, 100,000 exceptions, and 1,500 survey responses per month. Set
billing caps before adding a card.

## Real monthly operating cost

The $112 software floor is not the cost of running the business. Data
contributors, verification, support, accounting, and payment fees are the
meaningful items.

| Stage | Paid Pro-equivalent seats | Platform, payments and AI | Data verification/incentives | Accounting, support, insurance/legal reserve | **Real monthly cash cost** |
| --- | ---: | ---: | ---: | ---: | ---: |
| Closed beta | 50 | about $200 | $750-$1,500 | $350-$750 | **$1,300-$2,450** |
| Early public launch | 200 | $450-$550 | $1,500-$3,000 | $500-$1,500 | **$2,450-$5,050** |
| Growth | 1,000 | $1,880-$2,080 | $3,000-$6,000 | $1,500-$3,500 | **$6,400-$11,600** |

These ranges exclude:

- founder salaries and engineering compensation;
- paid advertising;
- the cost of the existing private community platform;
- a RED Atlas commercialization license;
- litigation, major security incidents, refunds, or unusual chargebacks;
- taxes on profit.

Suggested contributor economics are **$10-$25 per accepted, verifiable cash
sale**, not per submission. Require source evidence, contributor
representations, deduplication, staff review, provenance, and a correction
process. A count of records is not quality; measure whether searches in the
launch zones return recent, genuinely comparable sales.

At $30/month, revenue after the modeled Stripe and AI variable cost is about
**$28.32 per paid seat** before data operations and support. Therefore:

- 50 incremental paid seats produce $1,500 MRR and about $1,416 contribution
  before fixed/data/ops costs;
- 200 produce $6,000 MRR and about $5,664 contribution;
- roughly 90-180 paid seats cover a $2,500-$5,000 non-payroll monthly
  operation;
- a $10,000/month data license alone requires roughly 353 additional paid
  seats just to pay that one invoice.

## RED Atlas: the decision that changes the budget

RED Atlas is both a potential supplier and a direct Puerto Rico competitor. Its
consumer product already advertises listings, transactions, ownership,
documents, valuations, investor/developer tools, and future portfolio/market
reports.

Its public API page currently says:

| Public page tier | Price | Credits |
| --- | ---: | ---: |
| Sandbox | $100/mo | 500 |
| Starter | $750/mo | 5,000 |
| Professional | $1,800/mo | 20,000 |
| Business | $9,500/mo | 200,000 |
| Enterprise | $20,000+/mo | 250,000/custom |

However, the February 18, 2026 API Terms show different standard prices
($2,500 Professional, $7,500 Business, and $20,000+ Enterprise). More
importantly, the standard license is for internal business use. Section 5.3
prohibits placing outputs in a third-party-accessible product/platform,
commercial derived works, white labeling, and competitive use unless RED
Atlas signs a separate data-commercialization agreement. The terms state
liquidated damages of the greater of $500,000 or three times the fair-market
value of redistributed data, in addition to other remedies.

Therefore:

- **Sandbox is for engineering evaluation only.**
- **None of the public plans should be assumed to authorize launch.**
- The launch budget must say **“quote required; provisional $10,000/month”**
  until a signed order form and commercialization agreement expressly permit
  this product.
- A temporary data grant validates integration, not long-term unit economics.
  The published grant paths convert to $1,800, $9,500, or $20,000/month.

Questions that must be answered in writing:

1. May paying and free end users view each field, comp, score, valuation and
   report?
2. May the platform cache, index, compare, export, or retain outputs?
3. May outputs feed the calculator or AI tool-calling layer?
4. Does RED Atlas expressly waive the competitive-use restriction for this
   platform?
5. What attribution, source labeling, audit, deletion, indemnity and
   termination rules apply?
6. Which endpoints consume which credits, and what happens to cached/user
   records when the contract ends?
7. Is pricing guaranteed for at least 12-24 months?

### Recommended data path

Launch from data the venture owns or has explicit customer-facing rights to:

- Christopher's realtor/cash-deal contributor network under signed
  contributor licenses and verification rules;
- a broker-controlled Stellar MLS/IDX or data-services agreement that
  specifically covers this product;
- CRIM, Registro, court, and other public-record sources only after counsel
  confirms access, reuse, caching, privacy, and display rights;
- FHFA, Census, HUD, and other official aggregate datasets for market context;
- direct licensed partnerships rather than scraping consumer portals.

Stellar states that listing feeds and distribution are broker-controlled and
directs IDX setup to its Data Services department. A realtor login is not the
same thing as a right to build a paid data product.

## Upfront launch costs

| Workstream | Cash estimate |
| --- | ---: |
| Puerto Rico LLC filing, domain and basic registrations | $300-$500 |
| JV/operating agreement, IP assignment, privacy/terms, disclaimers and data-license review | $6,000-$15,000 |
| CPA, entity/tax elections, merchant registration and IVU setup | $750-$2,000 |
| Initial verified data corpus and contributor onboarding | $1,500-$5,000 |
| Independent security/accessibility/launch QA | $2,000-$6,000 |
| Cyber/E&O/general-liability insurance allowance, quote-dependent | $1,500-$5,000/year |
| Vendor setup and first production month | $150-$300 |
| Contingency | $1,000-$3,000 |
| Optional trademark search/filing with counsel, after name lock | $1,500-$4,000 |
| **Total cash before paid engineering** | **about $13,500-$40,000** |

The Puerto Rico Department of State currently lists a $250 LLC Certificate of
Organization and a $150 annual LLC fee. An EIN can be obtained directly from
the IRS without a filing service.

### Engineering still required

| Workstream | Hours |
| --- | ---: |
| Schema, migrations and replacement of six local stores | 120-190 |
| Better Auth, roles, recovery and account lifecycle | 30-50 |
| Stripe subscriptions, entitlements, webhooks and tax wiring | 35-55 |
| Data ingestion, search, provenance, QA and geospatial queries | 120-220 |
| AI Gateway, tool calls, safeguards, metering and evaluations | 40-70 |
| Email, maps, files/PDF reports and background jobs | 45-75 |
| Analytics, monitoring, backups and security hardening | 35-55 |
| Cross-device QA, accessibility, performance and truth/content audit | 80-120 |
| Deployment, migration rehearsal, incident runbook and launch support | 20-35 |
| **Full current product** | **about 500-850 hours** |

This is approximately **13-22 full-time weeks for one experienced engineer**,
or **8-14 weeks for a small experienced team**, assuming the data agreement
and source access do not stall the build. At blended market rates of
$100-$150/hour, the remaining work has an economic value of roughly
**$50,000-$130,000**. Founder labor can reduce cash outlay, but it does not
make the work disappear.

## Six-month funding options

| Path | Upfront/non-dev | Six-month operations | Paid engineering | **Total** |
| --- | ---: | ---: | ---: | ---: |
| Founder-built, owned-data beta | $14K-$22K | $8K-$15K | contributed | **$22K-$37K** |
| Founder-built, public-launch reserve | $20K-$40K | $15K-$30K | contributed | **$35K-$70K** |
| Fully funded public launch | $20K-$40K | $15K-$30K | $50K-$130K | **$85K-$200K** |
| RED Atlas-dependent path | add contract/legal setup | add about $60K provisional | same | **at least $60K more** |

The recommended partner ask is the middle of the founder-built public path:
**$50,000 cash, plus an explicit commitment to fund overruns caused by data
licensing.**

## Partnership decisions required before money is spent

1. **Who owns the entity, brand, code, derived data, contributor data, and
   customer list?**
2. **Who funds each cost and who can approve a vendor contract or budget
   increase?**
3. **How is “Community included” accounted for?** If 50 people already pay
   $30 for Christopher's private community, that is not automatically $1,500
   of platform MRR. Define a per-active-seat transfer price or a documented
   product revenue allocation.
4. **Who signs data contributors and bears data/privacy claims?**
5. **Who owns Stripe, Vercel, Supabase, Resend, the domain, and production
   credentials?** The JV should own them; each founder gets appropriate
   access.
6. **What happens if one founder stops contributing, the product is sold, or
   the partnership ends?**
7. **Which statements may be used publicly, and who is responsible for
   substantiation?**

## Public-launch gates

Do not open paid public access until all of these are true:

- the JV, IP assignment, cost responsibility and community revenue allocation
  are signed;
- every data source has written display/caching/commercial rights;
- the launch areas have a useful verified corpus and measurable search
  coverage, not just a record count;
- Better Auth, payment webhooks, entitlements, account recovery and deletion
  pass tests;
- Stripe tax treatment is configured from CPA advice;
- no service-role/database secret reaches the browser;
- rate limits, spend caps, backups, restore rehearsal, monitoring and an
  incident owner exist;
- source, observed date, confidence and correction/report controls appear on
  property data;
- calculators and Copilot clearly disclose assumptions and are not presented
  as appraisal, credit, legal, tax, or investment advice;
- all marketing claims and testimonials are real and documented.

The current landing includes demo claims such as 1,284 comparables, 18 verified
realtors, 23 verified cash deals this month, 32 municipalities, “half of PR
sales,” four live data sources, and named customer testimonials. Those claims
must be substantiated or replaced with honest beta/demo language before a
public launch.

## Sources

Vendor and implementation sources:

- [Vercel pricing](https://vercel.com/pricing)
- [Vercel Observability Plus](https://vercel.com/docs/observability/observability-plus)
- [Vercel AI Gateway pricing](https://vercel.com/docs/ai-gateway/pricing)
- [Vercel AI Gateway model catalog](https://vercel.com/ai-gateway/models)
- [Vercel acquisition of Better Auth](https://vercel.com/blog/vercel-acquires-better-auth)
- [Better Auth pricing](https://better-auth.com/pricing)
- [Better Auth Next.js integration](https://better-auth.com/docs/integrations/next)
- [Better Auth database model](https://better-auth.com/docs/concepts/database)
- [Supabase pricing](https://supabase.com/pricing)
- [Supabase compute pricing](https://supabase.com/docs/guides/platform/manage-your-usage/compute)
- [Supabase PostGIS](https://supabase.com/docs/guides/database/extensions/postgis)
- [Neon pricing](https://neon.com/pricing)
- [Resend pricing](https://resend.com/pricing)
- [MapTiler pricing](https://www.maptiler.com/cloud/pricing/)
- [PostHog pricing](https://posthog.com/pricing)
- [Stripe Payments pricing](https://stripe.com/pricing)
- [Stripe Billing pricing](https://stripe.com/billing/pricing)
- [Stripe Tax pricing](https://stripe.com/tax/pricing)

Data, legal and Puerto Rico sources:

- [RED Atlas API pricing](https://api.atlas.red/en)
- [RED Atlas API Terms](https://api.atlas.red/en/terms)
- [RED Atlas Puerto Rico product](https://atlas.red/en-PR)
- [Stellar MLS Puerto Rico](https://www.stellarmls.com/prar)
- [Puerto Rico Department of State corporation forms/fees](https://www.estado.pr.gov/formularios-para-corporaciones)
- [Puerto Rico Department of State entity obligations](https://www.estado.pr.gov/en/services/services-corporations)
- [Hacienda IVU overview and SURI](https://hacienda.pr.gov/comerciantes/impuesto-sobre-ventas-y-uso-ivu)
- [July 2026 municipal IVU/SURI change](https://hacienda.pr.gov/sobre-hacienda/sala-de-prensa-virtual/comunicados-de-prensa/gobernadora-anuncia-integracion-del-ivu-municipal-en-suri-para-73-municipios-participantes)
