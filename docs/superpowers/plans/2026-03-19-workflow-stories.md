# Workflow Stories Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create 5 new workflow-story posts interleaved with existing posts, renumbering everything to match the new publishing order.

**Architecture:** Renumber all existing posts (02-11 to new positions), create 5 new posts (2 animated Remotion, 3 static HTML), update all composition registries and build scripts.

**Tech Stack:** Remotion + React (animated), HTML/CSS (static), Playwright (screenshots)

**Spec:** `docs/superpowers/specs/2026-03-19-workflow-stories-content-plan-design.md`

---

## Critical Rules (read before every task)

Every piece of Croatian text MUST follow these rules from `context/voxares.md` and `CLAUDE.md`:

1. **No emdashes (—) or endashes (–)** in post text or captions. Use commas, periods, or restructure.
2. **No billboard copy.** No fragmented period-separated phrases ("Automatski. Bez rada."), no comma-separated slogans ("Brže, lakše, bolje"), no dramatic one-word sentences.
3. **No false automation claims.** Don't imply zero user involvement. Frame as "the system executed what you configured," not "it works without you."
4. **Natural Croatian.** Sentences should read like you're explaining something to a colleague, not writing an ad.
5. **No uzvičnici (exclamation marks).** No fabricated statistics.
6. **Use "klijenti" and "organizacije"** — never "pacijenti."

**Tone test:** Read every sentence aloud. If it sounds like a billboard, a TV ad, or aggressive social media copy, rewrite it.

---

## Chunk 1: Renumber Existing Posts

### Task 1: Rename all post folders

The current posts need to shift to make room for 5 new interleaved posts.

**Current → Target mapping:**

| Current | Target | Notes |
|---------|--------|-------|
| post01-announcement | post01-announcement | no change |
| (new) | post02-morning-routine | Story 1 |
| post02-platform-overview | post03-platform-overview | rename |
| (new) | post04-workflow-templates | Story 2 |
| post03-before-after | post05-before-after | rename |
| (new) | post06-auto-ingestion | Story 3 |
| post04-time-wasted | post07-time-wasted | rename |
| (new) | post08-bulk-messaging | Story 4 |
| post05-feature-automation | post09-feature-automation | rename |
| (new) | post10-quick-setup | Story 5 |
| post06-lost-clients | post11-lost-clients | rename |
| post07-feature-reactivation | post12-feature-reactivation | rename |
| post08-stat-noshow | post13-stat-noshow | rename |
| post09-feature-calendar | post14-feature-calendar | rename |
| post10-paperwork | post15-paperwork | rename |
| post11-how-it-works | post16-how-it-works | rename |

**Files:**
- Rename: all `posts/post{02-11}-*/` folders
- Modify: `posts/post03-platform-overview/video.tsx` (was post02, update named export)
- Modify: `posts/post05-before-after/video.tsx` (was post03, update named export)
- Modify: `remotion/Root.tsx` (update all imports and composition IDs)
- Modify: `render-video.mjs` (update compositionIds map)

- [ ] **Step 1: Rename folders from highest to lowest**

Rename in reverse order to avoid conflicts:
```bash
cd posts
mv post11-how-it-works post16-how-it-works
mv post10-paperwork post15-paperwork
mv post09-feature-calendar post14-feature-calendar
mv post08-stat-noshow post13-stat-noshow
mv post07-feature-reactivation post12-feature-reactivation
mv post06-lost-clients post11-lost-clients
mv post05-feature-automation post09-feature-automation
mv post04-time-wasted post07-time-wasted
mv post03-before-after post05-before-after
mv post02-platform-overview post03-platform-overview
```

- [ ] **Step 2: Update named exports in video.tsx files**

In `posts/post03-platform-overview/video.tsx`, find and replace these three strings:
- `const Post02PlatformOverview` → `const Post03PlatformOverview`
- `export { Post02PlatformOverview }` → `export { Post03PlatformOverview }`
- `export default Post02PlatformOverview` → `export default Post03PlatformOverview`

In `posts/post05-before-after/video.tsx`, find and replace these three strings:
- `const Post03BeforeAfter` → `const Post05BeforeAfter`
- `export { Post03BeforeAfter }` → `export { Post05BeforeAfter }`
- `export default Post03BeforeAfter` → `export default Post05BeforeAfter`

- [ ] **Step 3: Update remotion/Root.tsx**

Update imports and composition IDs to match new folder names and export names. After all story posts are created (Tasks 2-6), the final Root.tsx will register all 4 animated compositions. For now, update the two existing ones:

```tsx
import { Composition } from "remotion";
import {
  Post03PlatformOverview,
  compositionConfig as post03Config,
} from "../posts/post03-platform-overview/video";
import {
  Post05BeforeAfter,
  compositionConfig as post05Config,
} from "../posts/post05-before-after/video";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="Post03PlatformOverview"
        component={Post03PlatformOverview}
        durationInFrames={post03Config.durationInFrames}
        fps={post03Config.fps}
        width={post03Config.width}
        height={post03Config.height}
      />
      <Composition
        id="Post05BeforeAfter"
        component={Post05BeforeAfter}
        durationInFrames={post05Config.durationInFrames}
        fps={post05Config.fps}
        width={post05Config.width}
        height={post05Config.height}
      />
    </>
  );
};
```

- [ ] **Step 4: Update render-video.mjs compositionIds map**

```js
const compositionIds = {
  "post03-platform-overview": "Post03PlatformOverview",
  "post05-before-after": "Post05BeforeAfter",
};
```

(Will be extended as new animated posts are added in Tasks 2-3.)

- [ ] **Step 5: Verify renamed posts render**

```bash
npx remotion compositions --props '{}'
```

Expected: `Post03PlatformOverview` and `Post05BeforeAfter` listed.

```bash
npm run preview
```

Check gallery loads all posts without errors.

- [ ] **Step 6: Commit**

```bash
git add posts/ remotion/Root.tsx render-video.mjs
git commit -m "Renumber posts for workflow stories interleaving

Shift posts 02-11 to new positions (03,05,07,09,11-16) to make
room for 5 new story posts at positions 02,04,06,08,10."
```

---

## Chunk 2: Story 1 — "Kako izgleda jedno jutro s Voxaresom" (Animated)

### Task 2: Create post02-morning-routine

**Concept:** Animated post showing a morning routine. Three stages appear sequentially: (1) calendar with today's appointments, (2) inbox showing confirmations arrived, (3) form completion status. Each stage is a card/panel that slides in or fades in, showing the user that everything is ready when they arrive.

**Files:**
- Create: `posts/post02-morning-routine/video.tsx`
- Create: `posts/post02-morning-routine/caption.txt`
- Modify: `remotion/Root.tsx` (add composition)
- Modify: `render-video.mjs` (add composition ID)

- [ ] **Step 1: Create the post directory**

```bash
mkdir posts/post02-morning-routine
```

- [ ] **Step 2: Write video.tsx**

**Reference code:** Read `posts/post03-platform-overview/video.tsx` first — it demonstrates the project's Remotion patterns: spring animations, `useCurrentFrame`/`useVideoConfig`, `interpolate`, component structure, pill styling, and how to export `compositionConfig`. Also check `remotion/lib/colors.ts` for color constants and `remotion/lib/fonts.ts` for font loading.

**Component structure:**
- `AccentBar` — 6px blue gradient at top (reuse pattern from post03-platform-overview)
- `Title` — centered heading, animated fade+slide
- `MorningCards` — three cards appearing sequentially:
  - Card 1 (Green accent): Calendar icon + "4 termina danas" + subtitle "Svi podsjetnici su poslani"
  - Card 2 (Blue accent): Inbox icon + "3 potvrde dolaska" + subtitle "Klijenti su potvrdili putem SMS-a"
  - Card 3 (Amber accent): Form icon + "1 obrazac ispunjen" + subtitle "Ana je ispunila obrazac prije dolaska"
- `Wordmark` — bottom-right Voxares logo (reuse from post03-platform-overview)

**Layout:** White/light blue background (#f2f8fd). Title at top. Three cards vertically stacked in center, each with a colored left border matching its pillar. Cards have white background, rounded corners, icon on left, text on right.

**Animation (30fps, 300 frames = 10s):**
- Frame 0-15: Accent bar + title fade in
- Frame 30-60: Card 1 slides in from left with spring
- Frame 70-100: Card 2 slides in
- Frame 110-140: Card 3 slides in
- Frame 160-300: Hold (all visible)

**Text content (Croatian):**

Title: `Kako izgleda jedno jutro s Voxaresom`

Card 1:
- Heading: `4 termina danas`
- Subtext: `Podsjetnici koje ste postavili su već poslani`

Card 2:
- Heading: `3 potvrde dolaska`
- Subtext: `Klijenti su potvrdili putem SMS-a`

Card 3:
- Heading: `1 obrazac ispunjen`
- Subtext: `Ana je ispunila obrazac prije dolaska`

**Imports:** Use existing colors from `remotion/lib/colors` (THEME_GREEN, THEME_BLUE, THEME_AMBER for card accents), fonts from `remotion/lib/fonts`.

**Exports:** Named export `Post02MorningRoutine`, default export same, `compositionConfig` with `{ fps: 30, durationInFrames: 300, width: 1080, height: 1080 }`.

- [ ] **Step 3: Write caption.txt**

```
Otvorite Voxares ujutro i sve što ste postavili već radi. Podsjetnici su poslani, klijenti su potvrdili dolazak, obrasci su ispunjeni. Vi samo počnete raditi.

#voxares #crm #sms #komunikacija #klijenti #podsjetnici #digitalizacija
```

**Tone check:** No emdashes, no fragments, no billboard copy. "Sve što ste postavili već radi" explicitly frames the user as the one who configured it — not magic automation. "Vi samo počnete raditi" reinforces they're in control.

- [ ] **Step 4: Register composition in Root.tsx**

Add import and `<Composition>` block for `Post02MorningRoutine`.

- [ ] **Step 5: Add to render-video.mjs compositionIds**

```js
"post02-morning-routine": "Post02MorningRoutine",
```

- [ ] **Step 6: Verify**

```bash
npx remotion compositions --props '{}'
```

Expected: `Post02MorningRoutine` listed at 30fps, 1080x1080, 300 frames.

Check in Remotion Studio (`npm run studio`) that the animation plays correctly.

- [ ] **Step 7: Commit**

```bash
git add posts/post02-morning-routine/ remotion/Root.tsx render-video.mjs
git commit -m "Add post02 morning routine story (animated)"
```

---

## Chunk 3: Story 2 — "Poruka za svakog, napisana jednom" (Animated)

### Task 3: Create post04-workflow-templates

**Concept:** Animated post showing one template message becoming multiple personalized messages. A single "template bubble" appears at center, then multiplies into 3-4 personalized variants that fan out, each with a different client name and appointment time. Shows the leverage of write-once, send-to-many.

**Files:**
- Create: `posts/post04-workflow-templates/video.tsx`
- Create: `posts/post04-workflow-templates/caption.txt`
- Modify: `remotion/Root.tsx` (add composition)
- Modify: `render-video.mjs` (add composition ID)

- [ ] **Step 1: Create the post directory**

```bash
mkdir posts/post04-workflow-templates
```

- [ ] **Step 2: Write video.tsx**

**Reference code:** Read `posts/post03-platform-overview/video.tsx` first — it has the exact pill styling (inbox icon + colored pill), blue message bubble style (border-radius `18px 18px 8px 18px`), and animation patterns to reuse. Also check `remotion/lib/colors.ts` and `remotion/lib/fonts.ts`.

**Component structure:**
- `AccentBar` — 6px blue gradient at top
- `Title` — centered heading
- `TemplateBubble` — a message bubble in the center showing the template with variable placeholders (using the app-style pills from post03-platform-overview)
- `PersonalizedMessages` — 3 smaller message bubbles that appear one by one, fanning out below the template. Each shows the template text with real values filled in.
- `Wordmark` — bottom-right

**Layout:** Light blue background (#f2f8fd). Title at top. Template bubble centered. Three result bubbles below in a row or staggered.

**Animation (30fps, 300 frames = 10s):**
- Frame 0-20: Accent bar + title
- Frame 30-60: Template bubble appears (center, larger, with a subtle glow or outline to distinguish it as the "template")
- Frame 80: First personalized bubble appears below-left
- Frame 100: Second personalized bubble appears below-center
- Frame 120: Third personalized bubble appears below-right
- Frame 140-300: Hold

**Text content (Croatian):**

Title: `Kako jedna poruka postane pet personaliziranih`

Template bubble (with variable pills using inbox icon + pill styling from post03):
`Pozdrav` `{Ime}` `, vaš termin je` `{Termin}` `. Potvrdite dolazak putem linka:` `{Potvrda}`

Personalized bubble 1:
`Pozdrav Ana, vaš termin je 15.03. u 10:00. Potvrdite dolazak putem linka: vox.hr/p/ana`

Personalized bubble 2:
`Pozdrav Marko, vaš termin je 15.03. u 11:30. Potvrdite dolazak putem linka: vox.hr/p/marko`

Personalized bubble 3:
`Pozdrav Ivana, vaš termin je 15.03. u 14:00. Potvrdite dolazak putem linka: vox.hr/p/ivana`

The template bubble uses the blue bubble + pill style from post03-platform-overview. The personalized bubbles are regular blue bubbles (no pills, since the values are filled in).

**Exports:** Named export `Post04WorkflowTemplates`, default export same, `compositionConfig` with `{ fps: 30, durationInFrames: 300, width: 1080, height: 1080 }`.

- [ ] **Step 3: Write caption.txt**

```
Jedan predložak, a svaki klijent dobiva poruku s vlastitim imenom i vremenom termina. Ne trebate pisati svaku poruku posebno, samo postavite predložak i Voxares ga popuni za svakog klijenta.

#voxares #crm #sms #komunikacija #klijenti #predlošci #automatizacija
```

**Tone check:** No emdashes. No billboard copy. "Ne trebate pisati svaku poruku posebno" is conversational. "Voxares ga popuni" correctly frames it as a tool that helps, not replaces.

- [ ] **Step 4: Register composition in Root.tsx**

Add import and `<Composition>` for `Post04WorkflowTemplates`.

- [ ] **Step 5: Add to render-video.mjs compositionIds**

```js
"post04-workflow-templates": "Post04WorkflowTemplates",
```

- [ ] **Step 6: Verify**

```bash
npx remotion compositions --props '{}'
```

Check in Remotion Studio.

- [ ] **Step 7: Commit**

```bash
git add posts/post04-workflow-templates/ remotion/Root.tsx render-video.mjs
git commit -m "Add post04 workflow templates story (animated)"
```

---

## Chunk 4: Story 3 — "Klijent je već u sustavu" (Static)

### Task 4: Create post06-auto-ingestion

**Concept:** Static post showing the flow from Google Calendar/Gmail into Voxares. Left side shows the source (Calendar event or email), an arrow in the middle, right side shows the client already in the Voxares chat. Clean cause-and-effect layout.

**Template to follow:** Feature screenshot post pattern (like post14-feature-calendar). Light background, accent bar, logo top-left, headline, visual element in center.

**Files:**
- Create: `posts/post06-auto-ingestion/post.html`
- Create: `posts/post06-auto-ingestion/caption.txt`

- [ ] **Step 1: Create the post directory**

```bash
mkdir posts/post06-auto-ingestion
```

- [ ] **Step 2: Write post.html**

**Layout:**
- Light blue background (#f2f8fd)
- 6px blue gradient accent bar at top
- Voxares logo (gradient fill) top-left
- Headline centered: `Klijent je već u sustavu, a vi ga niste unosili`
- Center visual: Two styled cards connected by an arrow
  - Left card: Google Calendar icon (colorful G Cal logo as simple SVG) + text "Novi termin u kalendaru" or Gmail icon + "Nova potvrda e-mailom"
  - Arrow (simple chevron or flow arrow in blue)
  - Right card: Voxares chat bubble style showing "Ana Horvat" as a new client entry
- Subtext below: `Bez ručnog unosa podataka.`
- Wordmark bottom-right

**Font:** Plus Jakarta Sans 800 for headline (42px), Inter 400/600 for body text.

- [ ] **Step 3: Write caption.txt**

```
Kad netko zakaže termin preko Google Kalendara ili vam pošalje potvrdu e-mailom, klijent se automatski pojavi u Voxaresu. Ne trebate ništa ručno unositi, podaci su već tamo kad otvorite aplikaciju.

#voxares #crm #googlecalendar #gmail #sinkronizacija #klijenti #digitalizacija
```

**Tone check:** No emdashes. "Ne trebate ništa ručno unositi" is conversational. No billboard fragments.

- [ ] **Step 4: Verify**

```bash
npm run preview
```

Open in browser, navigate to post06, verify it renders correctly at 1080x1080.

- [ ] **Step 5: Commit**

```bash
git add posts/post06-auto-ingestion/
git commit -m "Add post06 auto-ingestion story (static)"
```

---

## Chunk 5: Story 4 — "200 klijenata, jedna poruka" (Static)

### Task 5: Create post08-bulk-messaging

**Concept:** Static post with a bold visual — the number "200" as a large anchor, with a message bubble below showing personalization. Statement post style (white background template, like post07-time-wasted).

**Template to follow:** Statement post pattern (like post07-time-wasted). White background, blue accent bar, bold statement text, follow-up text, wordmark.

**Files:**
- Create: `posts/post08-bulk-messaging/post.html`
- Create: `posts/post08-bulk-messaging/caption.txt`

- [ ] **Step 1: Create the post directory**

```bash
mkdir posts/post08-bulk-messaging
```

- [ ] **Step 2: Write post.html**

**Layout:**
- White background
- 6px blue gradient accent bar at top
- Radial blue glow backdrop (subtle, like post07)
- Watermark bird SVG (faded, like post07)
- Center content:
  - Large "200" in Plus Jakarta Sans 800, ~120px, color #0096ff
  - Below: statement text "klijenata, jedna poruka" in Plus Jakarta Sans 800, ~40px, dark text
  - Below: follow-up text in Inter 600, ~24px, blue: "U Voxaresu napravite grupu klijenata, napišete jednu poruku s imenom svakog klijenta i pošaljete ju svima odjednom."
  - Below follow-up: a small styled message bubble preview (blue #0096ff bg, white text) showing: "Pozdrav {Ana}, imamo novu uslugu koju bismo vam rado predstavili."
- Wordmark bottom-right

- [ ] **Step 3: Write caption.txt**

```
Trebate obavijestiti 200 klijenata o novoj usluzi? Napravite grupu, napišite jednu poruku i Voxares je personalizira za svakog klijenta. Umjesto cijelog dana ručnog slanja, gotovi ste za par minuta.

#voxares #crm #sms #grupneporuke #komunikacija #klijenti #kampanje
```

**Tone check:** No emdashes. "Trebate obavijestiti 200 klijenata?" is a natural question. "Gotovi ste za par minuta" is conversational. The body text says "pošaljite sve odjednom" (speed framing) while the caption says "gotovi ste za par minuta" (effort framing) — complementary, not redundant.

- [ ] **Step 4: Verify**

```bash
npm run preview
```

- [ ] **Step 5: Commit**

```bash
git add posts/post08-bulk-messaging/
git commit -m "Add post08 bulk messaging story (static)"
```

---

## Chunk 6: Story 5 — "Počnite za 10 minuta" (Static)

### Task 6: Create post10-quick-setup

**Concept:** Static post showing 3-4 setup steps with icons. Numbered steps layout, similar to post16-how-it-works but focused on the onboarding flow.

**Template to follow:** Steps/infographic pattern (like post16-how-it-works). White background, accent bar, numbered steps with icons, wordmark.

**Files:**
- Create: `posts/post10-quick-setup/post.html`
- Create: `posts/post10-quick-setup/caption.txt`

- [ ] **Step 1: Create the post directory**

```bash
mkdir posts/post10-quick-setup
```

- [ ] **Step 2: Write post.html**

**Layout:**
- White background
- 6px blue gradient accent bar at top
- Title centered: `Kako početi koristiti Voxares za 10 minuta` (Plus Jakarta Sans 800, ~40px)
- 4 step cards vertically stacked:

  Step 1 (Blue accent, #0096ff):
  - Icon: Calendar sync SVG (simple calendar with circular arrows)
  - Text: `Povežite Google Calendar`
  - Subtext: `Termini se automatski pojave u aplikaciji`

  Step 2 (Green accent, #34d399):
  - Icon: Upload/import SVG (arrow into tray)
  - Text: `Uvezite popis klijenata`
  - Subtext: `CSV datoteka s imenima i brojevima`

  Step 3 (Amber accent, #fbbf24):
  - Icon: Template/document SVG (document with lines)
  - Text: `Odaberite predložak poruke`
  - Subtext: `Gotovi predlošci za podsjetnike, zahvale i kampanje`

  Step 4 (Purple accent, #a78bfa):
  - Icon: Send SVG (paper plane)
  - Text: `Pošaljite prvu poruku`
  - Subtext: `Vaši klijenti mogu dobiti prvu poruku već danas`

- Wordmark bottom-center (matching post16 pattern)

Each step card: light gray background (#f8fafc), 1px border (#e5e7eb), 20px border-radius, gradient-colored number square on the left, icon and text on the right.

- [ ] **Step 3: Write caption.txt**

```
Ne trebate tjednima postavljati novi sustav. Voxares je napravljen tako da možete početi isti dan kad se prijavite, a cijeli proces traje oko 10 minuta.

#voxares #crm #sms #onboarding #komunikacija #klijenti #digitalizacija
```

**Tone check:** No emdashes. Natural flow. No billboard fragments. Caption focuses on the benefit (quick start, no long implementation) while the post body shows the concrete steps. No redundancy between the two.

- [ ] **Step 4: Verify**

```bash
npm run preview
```

- [ ] **Step 5: Commit**

```bash
git add posts/post10-quick-setup/
git commit -m "Add post10 quick setup story (static)"
```

---

## Chunk 7: Final Verification

### Task 7: Full verification pass

- [ ] **Step 1: Verify all compositions load**

```bash
npx remotion compositions --props '{}'
```

Expected: 4 compositions listed (Post02MorningRoutine, Post03PlatformOverview, Post04WorkflowTemplates, Post05BeforeAfter).

- [ ] **Step 2: Verify all posts in preview gallery**

```bash
npm run preview
```

Open http://localhost:3030, check all 16 posts appear in gallery in correct order.

- [ ] **Step 3: Verify animated posts in Studio**

```bash
npm run dev
```

Open http://localhost:3000, check all 4 animated compositions play without errors.

- [ ] **Step 4: Tone check all new captions**

Read each caption.txt in posts 02, 04, 06, 08, 10. Verify:
- No emdashes (—) or endashes (–)
- No fragmented phrases separated by periods
- No comma-separated slogans
- No exclamation marks
- No false automation claims ("bez vašeg sudjelovanja", "radi umjesto vas")
- Uses "klijenti" not "pacijenti"
- Reads naturally, like explaining to a colleague

- [ ] **Step 5: Tone check all new post text**

For each new post, read all visible Croatian text and apply the same checks as Step 4.

- [ ] **Step 6: Verify folder structure**

```bash
ls -d posts/post*/
```

Expected: 16 folders from post01-announcement through post16-how-it-works, in correct order with correct slugs.

- [ ] **Step 7: Final commit (if any fixes)**

If any files were changed during verification, stage only those specific files and commit:

```bash
git add <changed-files>
git commit -m "Final verification fixes for workflow stories"
```

If no fixes were needed, skip this step.
