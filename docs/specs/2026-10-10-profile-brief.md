# Personal GitHub profile — brief

## Intent
Give LEFTEQ a distinctive personal introduction and a useful route into their work. Match the approved developer-playground mockup with blue/mint grid artwork and a compact portfolio. Build locally before public GitHub publication.

## Vocabulary
- Profile — root README rendered on the LEFTEQ account.
- Hero — repository-owned SVG with static copy and one finite orbital animation.
- Public mirror — sanitized source mirror; not a contribution or usage claim.

## As-is
No existing LEFTEQ/LEFTEQ remote repository resolved. Existing organization profile copy confirms FixIt and Reservine descriptions. Public repositories confirm Pultík, Výbava, ClaudikPublic and vitrinka-kit destinations.

## To-be
1. Visitors meet Lukáš and understand the builder's focus.
2. Visitors explore six selected products and tools.
3. Visitors use approved LinkedIn and Instagram contact links.
4. Visitors see readable artwork in light/dark modes, mobile widths, and reduced motion.
5. Maintainers regenerate consistent artwork and detect drift.

## Architecture
- `README.md` — native profile content and relative asset references.
- `scripts/artwork.ts` — typed palette/card manifest, SVG generation and check mode; Bun only.
- `assets/*.svg` — generated hero and project covers with no external resources.
- `docs/profile.md` — content/artwork maintenance and GitHub renderer limitations.

## Decisions that matter
Developer-playground direction supersedes product-studio direction. One finite hero animation replaces an animated widget collection. Public links replace inaccessible private sources. Native tables replace CSS layouts GitHub strips.

## Prerequisites
Bun for artwork generation. Browser verification in the session-owned Onyx Chromium. Publication authorization and GitHub remote setup only after review.

## Acceptance criteria
1. S1: hero reads Hello, I’m Lukáš and Products. Tools. Less complexity.
2. S2: all six entries have accurate descriptions and working public links.
3. S3: only the explicitly approved LinkedIn/Instagram destinations appear.
4. S4: hero and covers fit narrow viewports; no blank or clipped title; reduced-motion disables animation.
5. S4: no scripts or external resources in SVGs; readable static artwork fallback.
6. S5: artwork check exits successfully on generated assets and fails on drift.
7. README render has no dependency on third-party badge/stat services.

## Work packages
1. Artwork — `scripts/artwork.ts`, `assets/*`; complete when deterministic and accessible.
2. Profile — `README.md`; complete when approved content uses supported formatting.
3. Maintenance — `docs/profile.md`; complete when generation/check commands are documented.
4. Verification — ignored `.preview/`, `.vitrinka/`; complete when actual README HTML is checked at desktop/mobile and screenshots are on the board.

## Open questions
Public repository creation, push, and merge await explicit authorization.

## Out of scope
Changing profile photo/bio/pins; standalone portfolio site; private source links; counters/trophies; invented community or contribution claims.

## Refs
https://app.vitrinka.ai/w/adf/brainstorms/lefteq-profile-design-20261010
