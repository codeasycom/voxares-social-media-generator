# Social Media Content Generator

## What This Is

A reusable tool for generating social media post images and animated videos (Instagram, Facebook). Each post is a self-contained folder with its content source, caption, and generated output.

## Tech Stack

- **HTML/CSS** — static posts are single `.html` files with inline styles
- **Remotion + React** — animated posts are `.tsx` compositions with motion graphics
- **Vite + React** — unified preview app with `@remotion/player` for in-browser playback
- **Playwright** — headless Chromium screenshots for static posts
- **Google Fonts** — Inter (400, 600, 700, 800), Plus Jakarta Sans (700, 800)
- **Node.js** — ESM modules (`.mjs`)

## Commands

```bash
npm install                  # install dependencies (first time only)
npx playwright install       # install chromium browser (first time only)
npm run preview              # Vite dev server at localhost:3030 (preview app)
npm run dev                  # preview (3030) + Remotion Studio (3000) together
npm run studio               # Remotion Studio only at localhost:3000
npm run build                # screenshot static posts (skips animated)
npm run build:one <slug>     # screenshot a single static post
npm run build:video          # render animated posts (video.mp4 + image.png)
npm run build:stories        # screenshot static stories (skips animated)
npm run build:story <slug>   # screenshot a single static story
npm run build:story-video    # render animated stories (story-video.mp4 + story-image.png)
npm run build:all            # build + build:video + build:stories + build:story-video
```

## File Structure

```
posts/                        # Each post is a self-contained folder
  post01-announcement/
    post.html                 # Static feed post source (1080x1080 HTML)
    story.html                # Static story source (1080x1920 HTML, optional)
    caption.txt               # Instagram caption
    image.png                 # Generated feed screenshot (gitignored)
    story-image.png           # Generated story screenshot (gitignored)
  post02-before-after/
    video.tsx                 # Animated feed post source (Remotion composition)
    story.tsx                 # Animated story source (Remotion composition, optional)
    caption.txt
    video.mp4                 # Generated feed video (gitignored)
    image.png                 # Generated feed last-frame still (gitignored)
    story-video.mp4           # Generated story video (gitignored)
    story-image.png           # Generated story last-frame still (gitignored)
  ...
assets/                       # Screenshots and images used by posts
  screenshot-*.png
context/                      # Product context for content generation
  product-context.md          # Template — fill in for new projects
  voxares.md                  # Active product context (always read this)
remotion/                     # Shared Remotion components and config
  Root.tsx                    # Composition registry
  index.ts                   # Remotion entry point
  components/                # Reusable animated components
  lib/                       # Colors, fonts
src/                          # Preview app (Vite + React)
  main.tsx
  App.tsx                    # Hash-based routing
  App.css
  pages/
    Gallery.tsx              # Grid of all posts
    PostView.tsx             # Detail view with Player or iframe
  components/
    StaticCard.tsx           # Gallery card for static posts
    AnimatedCard.tsx         # Gallery card for animated posts (Thumbnail)
lib/
  posts.mjs                  # Shared post-detection utility
index.html                    # Vite entry HTML
vite.config.ts                # Vite + React plugin + /api/posts middleware
dev.mjs                       # Concurrent launcher (Vite + Studio)
screenshot-all.mjs            # Build: screenshots for static posts
screenshot-one.mjs            # Build: single static post screenshot
render-video.mjs              # Build: video.mp4 + image.png for animated posts
screenshot-stories.mjs        # Build: screenshots for static stories
screenshot-story-one.mjs      # Build: single static story screenshot
render-story.mjs              # Build: story-video.mp4 + story-image.png for animated stories
package.json
```

## Post Types

### Static Posts
- Content source: `post.html` (1080x1080)
- Preview: rendered via iframe
- Build: Playwright screenshot → `image.png`

### Animated Posts
- Content source: `video.tsx` (Remotion composition, 1080x1080)
- Preview: `@remotion/player` with playback controls
- Build: Remotion render → `video.mp4` + last-frame still → `image.png`
- `video.tsx` takes priority if both `post.html` and `video.tsx` exist

### Stories (Instagram Story variants, 1080x1920)
- A post can have a feed variant, a story variant, or both
- Static story: `story.html` (1080x1920), same pattern as `post.html`
- Animated story: `story.tsx` (Remotion composition with 1080x1920 dimensions)
- Build: `story-image.png` (screenshot/still) + `story-video.mp4` (animated only)
- In the preview app, posts with stories show a purple STORY badge
- Detail view has Feed/Story tab toggle when both variants exist

### Post type detection
- `video.tsx` present → animated feed
- `post.html` only → static feed
- Both → animated feed (`video.tsx` takes priority)
- `story.tsx` present → animated story
- `story.html` only → static story
- A post with only story files (no feed) is valid

## Naming Convention

Post folders: `post{NN}-{slug}/` where NN is the publishing order and slug describes the content.

Each folder contains `post.html` (static) or `video.tsx` (animated) plus `caption.txt`. Story variants use `story.html` or `story.tsx`. Output files (`image.png`, `video.mp4`, `story-image.png`, `story-video.mp4`) are generated by build scripts.

### Composition naming convention
Each `video.tsx` must export:
- `default` — the React component
- Named export (e.g. `Post02BeforeAfter`) — same component, for Remotion registry
- `compositionConfig` — `{ fps, durationInFrames, width, height }`

Each `story.tsx` must export:
- `default` — the React component
- Named export with `Story` suffix (e.g. `Post02MorningRoutineStory`) — same component, for Remotion registry
- `compositionConfig` — `{ fps, durationInFrames, width: 1080, height: 1920 }`

Composition IDs in `remotion/Root.tsx` should match the named export. Story IDs use the `Story` suffix.

## Post Templates

There are three visual templates. New posts should follow one of these:

### 1. Statement Post (bold text on background)
**Used by:** post01, post03, post05, post07, post09

Two variants:
- **Blue gradient background** (post01, post07): `linear-gradient(160deg, #0096ff, #0070c0, #004a80)`, white text, Voxares wordmark bottom-right
- **White background** (post03, post05, post09): White bg, blue accent bar at top (6px, `#0096ff → #0070c0`), dark bold statement text (`#1a1a2e`), blue follow-up text (`#0096ff`), Voxares wordmark bottom-right

### 2. Feature Screenshot Post (headline + app screenshot)
**Used by:** post04, post06, post08

Layout: Light bg (`#f2f8fd`), blue accent bar top, Voxares logo top-left, large headline, app screenshot in browser frame mockup (dots: red/yellow/green), benefit text below screenshot.

Screenshot images are referenced as `../../assets/screenshot-*.png` (relative path from post folder to `assets/`).

### 3. Split / Infographic (complex layouts)
**Used by:** post02 (before/after — animated), post10 (4-step how-it-works)

Custom layouts. Post02 uses Remotion animation with `remotion/components/` building blocks.

## Brand Guidelines

### Colors
- Primary blue: `#0096ff`
- Dark blue: `#0070c0`
- Deepest blue: `#004a80`
- Text dark: `#1a1a2e`
- Text muted: `#6b7280`
- Light blue bg: `#f2f8fd`
- Neutral bg (before/negative side): `#f5f5f5`
- Before/negative card accents: red (`#ef4444`, `#dc2626`)
- After/positive bg: `#f0f7ff`

### Theme Colors (from landing page)
Used for feature-specific content (icons, card backgrounds, text). Each maps to a product pillar:
1. **Blue** (`#0096ff → #007ad1`) — Personalizirana komunikacija
2. **Green** (`#34d399 → #10b981`) — Automatski podsjetnici
3. **Amber** (`#fbbf24 → #f59e0b`) — Digitalni obrasci
4. **Purple** (`#a78bfa → #8b5cf6`) — Ciljane kampanje / Reaktivacija

### Typography
- Headings font: Plus Jakarta Sans (Google Fonts) — used for side titles and large headings (matches landing page)
- Body font: Inter (Google Fonts)
- Headlines: 34-48px, weight 800, Plus Jakarta Sans
- Item titles: 19-20px, weight 700, Inter
- Body: 14-17px, weight 400-600, Inter
- Logo text: weight 700, Inter

### Logo
The Voxares logo SVG (bird icon) is inlined in each HTML file. Two versions:
- **White fill** — for blue gradient backgrounds
- **Gradient fill** (`url(#g1)`, `#0096FF → #0084E1`) — for white/light backgrounds

### Language
- All text is in Croatian
- Use "klijenti" and "organizacije" (generic industry terms)
- Do NOT use "pacijenti" or industry-specific terms
- Write naturally — avoid punchy fragments, dramatic pauses, and aggressive social media copy patterns
- If a sentence sounds like it belongs on a billboard, rewrite it to sound like a conversation
- **NEVER use emdash (—) or endash (–) in post text or captions.** Use commas, periods, or restructure the sentence. Hard rule, no exceptions.
- Do NOT position Voxares as a fully automated platform. It's a CRM that simplifies communication. The user still manages things, Voxares makes it easier. Avoid "bez vašeg sudjelovanja", "sve automatski", "radi umjesto vas" when implying zero user involvement.
- See `context/voxares.md` > "Tone of Voice" > "Stil pisanja" for detailed tone rules

## How to Add a New Post

### Static post
1. Read `context/voxares.md` for product context, tone, and content rules
2. Create a new folder: `posts/post{NN}-{slug}/`
3. Copy `post.html` from the closest template post
4. Update the text, images, and styling
5. Write the caption in `caption.txt`
6. Do NOT run `npm run build` — the user builds and verifies manually

### Animated post
1. Read `context/voxares.md` for product context and tone
2. Create a new folder: `posts/post{NN}-{slug}/`
3. Create `video.tsx` with a default export and `compositionConfig`
4. Register the composition in `remotion/Root.tsx`
5. Write the caption in `caption.txt`
6. Do NOT run `npm run build:video` — the user builds and verifies manually

### Static story
1. Read `context/voxares.md` for product context, tone, and content rules
2. In an existing post folder (or new one): create `story.html` (1080x1920)
3. Do NOT run `npm run build:stories` — the user builds and verifies manually

### Animated story
1. Read `context/voxares.md` for product context and tone
2. In an existing post folder (or new one): create `story.tsx` with `compositionConfig` (width: 1080, height: 1920)
3. Use `Story` suffix for the named export (e.g. `Post02MorningRoutineStory`)
4. Register the story composition in `remotion/Root.tsx`
5. Do NOT run `npm run build:story-video` — the user builds and verifies manually

## Preview App

`npm run preview` starts the Vite dev server at `http://localhost:3030`:
- **Gallery view** (`#/`) — all posts in a grid
  - Static posts: scaled iframe of `post.html`
  - Animated posts: Remotion Thumbnail (last frame) + VIDEO badge
- **Detail view** (`#/view/post01-announcement`) — full-size view with caption, prev/next nav
  - Static posts: full-size iframe
  - Animated posts: `@remotion/player` with playback controls + "Open in Studio" link
- **HMR** — changes to `video.tsx` or React components update instantly via Vite

`npm run dev` starts both the preview app (3030) and Remotion Studio (3000).

## Product Context

Always read `context/voxares.md` before writing or editing any post content. It contains the product details, target audience, brand voice, and tone guidelines.

## Workflow

1. Read `context/voxares.md` for product context and tone
2. Create or edit post folders in `posts/` using the templates
3. Write captions in each folder's `caption.txt`
4. Do NOT run build scripts for verification. The user will build and verify manually.

## Content Strategy

Publishing pattern: **pain point → feature → pain point → feature** with stat/educational posts mixed in.

Three content types rotate:
1. **Pain point** — relatable problem, bold statement
2. **Feature** — real app screenshot showing the solution
3. **Stat/educational** — data points or how-it-works overview
