# Workflow Stories Content Plan

## Problem

Voxares is a full CRM/messaging platform (dashboard, calendar, workflows, bulk messaging, forms, integrations, inbox) but existing social media content focuses narrowly on SMS reminders and no-shows. The app's breadth isn't communicated. Individual feature posts feel isolated and don't show how the product works as an integrated system.

## Approach

Instead of feature-per-post, use **workflow stories** — real scenarios that follow a client journey or user workflow, naturally touching 2-3 features per post without listing them. People buy outcomes, not features.

## The 5 Stories (in publishing order)

### Story 1: "Kako izgleda jedno jutro s Voxaresom"

**Scenario:** You open the app in the morning. Calendar shows today's appointments. The reminders you configured yesterday were sent automatically. Confirmations are in the inbox. One client filled their form early. You're ready before the first client walks in.

**Features shown:** Calendar view, automated reminders (user configured, system executed), inbox (confirmations coming in), forms (pre-filled), dashboard overview.

**Core message:** Everything you set up is already done when you arrive.

**Format:** Animated (Remotion) — multi-step morning flow lends itself to sequential reveal. Show calendar first, then inbox notifications, then form status.

**Assets needed:** Illustrated/stylized UI elements (not real screenshots). Calendar grid, inbox badge, form completion indicator.

### Story 2: "Poruka za svakog, napisana jednom"

**Scenario:** You have 5 appointments tomorrow. Instead of writing 5 individual reminders, you've set up a workflow template that sends a personalized reminder to each client with their name and appointment time. Set it up once, it works for every appointment going forward.

**Features shown:** Workflow templates, personalization variables (name, date/time), appointment-linked messaging.

**Core message:** The leverage of templates — the difference between "sending messages" and "having a system."

**Format:** Animated (Remotion) — show one template transforming into multiple personalized messages. Visual multiplication effect.

**Assets needed:** Template bubble mockup, personalized message variants with different names/times.

### Story 3: "Klijent je već u sustavu, a vi ga niste unosili"

**Scenario:** Someone books through your Google Calendar scheduling (or you get a booking email in Gmail). The appointment and client automatically appear in Voxares. You open the app, the client is there. You assign a workflow or send a form from the chat — two clicks. No manual data entry.

**Features shown:** Google Calendar sync, Gmail email ingestion, automatic client creation, dashboard/chat, sending forms and workflows from chat.

**Core message:** Clients are already in the system before you do anything.

**Format:** Static (HTML) — clean visual showing the flow: Google Calendar/Gmail icon on left, arrow, Voxares dashboard on right. Simple cause-and-effect layout.

**Assets needed:** Google Calendar and Gmail icons, stylized Voxares chat preview.

### Story 4: "200 klijenata, jedna poruka"

**Scenario:** You want to let all clients who haven't visited in 3 months know about a new service. Create a group by filter, write one message with personalization, send. Done in 2 minutes instead of a day.

**Features shown:** Bulk messaging, client groups/segmentation, personalized templates (name variables), campaign sending.

**Core message:** Reach everyone personally without doing it manually.

**Format:** Static (HTML) — bold statement layout (white background template). Number "200" as large visual anchor, message bubble showing personalization.

**Assets needed:** None (text-based layout with styled message bubble).

### Story 5: "Počnite za 10 minuta"

**Scenario:** Connect your Google Calendar, import your client list (CSV), pick a workflow template from the marketplace, and your first reminder goes out today.

**Features shown:** Google Calendar integration, CSV import, workflow marketplace/templates, quick setup, first message.

**Core message:** Getting started is easy. This isn't a 6-month implementation.

**Format:** Static (HTML) — numbered steps layout (similar to post11-how-it-works template). 3-4 visual steps with icons.

**Assets needed:** Icons for each step (calendar, upload, template, send).

## Feature Coverage

These 5 stories collectively cover: dashboard, calendar, inbox, bulk messaging, forms, workflows, integrations (Google Calendar, Gmail), templates, marketplace, CSV import, and segmentation.

Not explicitly covered (power features that don't drive signups): secure documents, practice info links, client portal self-scheduling, multi-practice management, admin settings, analytics dashboard.

## Publishing Order

| # | Slug | Content | Type |
|---|------|---------|------|
| 01 | announcement | Launch announcement | PUBLISHED |
| 02 | morning-routine | Story 1: "Kako izgleda jedno jutro" | NEW (animated) |
| 03 | platform-overview | Four message types overview | existing (animated) |
| 04 | workflow-templates | Story 2: "Poruka za svakog" | NEW (animated) |
| 05 | before-after | Before/after comparison | existing (animated) |
| 06 | auto-ingestion | Story 3: "Klijent je već u sustavu" | NEW (static) |
| 07 | time-wasted | Pain point: manual reminders | existing (static) |
| 08 | bulk-messaging | Story 4: "200 klijenata" | NEW (static) |
| 09 | feature-automation | Feature: automated SMS | existing (static) |
| 10 | quick-setup | Story 5: "Počnite za 10 minuta" | NEW (static) |
| 11 | lost-clients | Pain point: client churn | existing (static) |
| 12 | feature-reactivation | Feature: reactivation campaigns | existing (static) |
| 13 | stat-noshow | Pain point: no-show stats | existing (static) |
| 14 | feature-calendar | Feature: calendar view | existing (static) |
| 15 | paperwork | Pain point: paper forms | existing (static) |
| 16 | how-it-works | Educational: 4-step overview | existing (static) |

Pattern: story, buffer (existing post), story, buffer, story, buffer, story, buffer, story, then remaining posts.

### Migration

Renumbering all existing posts and interleaving new ones requires:
1. Rename all post folders to match new numbering
2. Update `remotion/Root.tsx` composition IDs and imports for all animated posts
3. Update named exports in video.tsx files that reference post numbers
4. Update `render-video.mjs` composition ID overrides
5. Verify all posts still render in preview app after renumbering

## Caption Guidelines

- Follow tone rules from `context/voxares.md` — conversational, informative, no billboard copy
- No emdashes or endashes
- Target length: 2-4 sentences. First sentence hooks, rest explains the scenario benefit.
- End with relevant hashtags (reuse existing set: #voxares #crm #sms #komunikacija #klijenti etc.)
- Include a soft CTA where natural ("Link u opisu profila" or similar) but don't force it
- Do not use fragmented phrases, dramatic one-word sentences, or comma-separated slogans

## Constraints

- All text in Croatian
- Follow tone rules in context/voxares.md (natural, conversational, no billboard copy, no emdashes, no fragments)
- Do not position Voxares as fully automated — the user manages communication, Voxares makes it easier. Frame automation as "the system executed what you configured," not "it works without you."
- Do not fabricate features — only show what the app actually does today (exception: Story 5 marketplace templates will be ready by publish time)
- 1080x1080 format for Instagram/Facebook
- Brand guidelines from CLAUDE.md (colors, fonts, logo)

## Definition of Done (per story post)

- Post renders at 1080x1080 without errors
- Caption written in `caption.txt`, tone-checked against voxares.md rules
- Animated posts: composition registered in `remotion/Root.tsx`, plays in Remotion Studio
- Static posts: screenshot builds via `npm run build:one`
- No emdashes, no billboard copy, no false automation claims in any text
