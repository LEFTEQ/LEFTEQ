# Maintaining the profile

GitHub displays the root README of the public `LEFTEQ/LEFTEQ` repository on the account profile. This is not a GitHub Pages site.

## Artwork

The typed manifest in [`scripts/artwork.ts`](../scripts/artwork.ts) owns the palettes, project labels, icons, and hero. Edit that source, not generated SVGs.

```sh
bun scripts/artwork.ts
bun scripts/artwork.ts --check
```

Generation has no package dependencies or network calls. Commit the generated assets alongside their source. Each asset is self-contained: no scripts, external fonts, embedded HTML, analytics, or remote images.

The hero uses one 4.5-second transform animation, then rests. Text is visible immediately. Its CSS disables animation for reduced motion; README `<picture>` sources also select separate static SVGs for that preference. Light/dark sources follow the browser preference. GitHub's manually selected theme may differ from that preference, so both palettes are self-contained contrasting panels.

## Local preview

```sh
devbox setup --apply --json
devbox url lefteq-profile-feat-personal-profile
```

The dependency-free Bun preview serves the real README and assets with GitHub-like styling. It is a review aid, not a separate portfolio website or a guarantee of GitHub rendering. Keep the preview running for hand-testing.

## Content

Use verified public destinations. PultikPublic and ClaudikPublic are public mirrors; avoid describing them as distribution channels or claiming usage from mirror pushes. Do not link private application source or internal PRs. Contact destinations are the LinkedIn and Instagram URLs explicitly approved in the decision log.

## Rendering

Native tables group the products and tools; arbitrary CSS/classes are stripped from GitHub README HTML. On narrow screens, GitHub may let tables scroll horizontally rather than stack their columns. Image text is decoration/branding; equivalent names and descriptions appear in accessible image alternatives and ordinary README content.

Before publishing, check the GitHub-rendered README on desktop and a narrow viewport, confirm SVG loading and reduced motion, and verify public links. A local Markdown renderer is useful for preparation but is not proof of GitHub's exact sanitization or image proxy behavior. Recheck the actual repository README after publication.
