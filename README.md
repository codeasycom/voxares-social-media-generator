# Social Media Generator

Generate social media post images (Instagram, Facebook) from HTML/CSS templates. Each post is a self-contained folder with its HTML source, caption, and generated screenshot.

## Setup

```bash
npm install
npx playwright install
```

## Usage

```bash
npm run build              # generate all post images
npm run build:one -- post02-before-after   # generate a single post image
npm run preview            # live preview at localhost:3030
```

## Structure

```
posts/post{NN}-{slug}/
  post.html       # 1080x1080 HTML source
  caption.txt     # social media caption
  image.png       # generated 2160x2160 screenshot (gitignored)
```

## Workflow

Run `npm run preview` to start the live preview server, then work with an AI coding agent (like Claude Code) to create or tweak posts. The agent edits the HTML and captions, you refresh the preview to check the result. When you're happy, run `npm run build:one -- post-name` to generate the final image.

See `CLAUDE.md` for templates, brand guidelines, and content strategy.

## Forking for another project

1. **Product context** — replace `context/voxares.md` with your own product details (use `context/product-context.md` as a template). Update the filename reference in `CLAUDE.md`.
2. **Brand colors** — update the color values in `CLAUDE.md` and in each post's HTML. Search for `#0096ff` and the other brand hex codes.
3. **Logo** — replace the inline SVG in each post HTML with your own logo. There are two versions: white fill (for dark backgrounds) and gradient fill (for light backgrounds).
4. **Fonts** — swap the Google Fonts link in each post HTML. Update the `font-family` declarations and the typography section in `CLAUDE.md`.
5. **Posts** — delete the existing posts in `posts/` and create new ones using the templates as a starting point.
6. **Language** — the current posts are in Croatian. Update the language rules in both `CLAUDE.md` and your product context file.