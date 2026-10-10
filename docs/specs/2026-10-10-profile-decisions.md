# Personal GitHub profile — decisions

## Summary
Build LEFTEQ's personal GitHub profile README as a developer playground, inspired by tysoncung's expressive profile without copying its badge density. Use original repository-owned artwork and a compact showcase grounded in public work.

## Decisions
| # | Decision | Call | Why |
|---|---|---|---|
| D1 | Visual identity | B — Developer playground, superseding A | Explicit revised board answer; blue/mint grid and numbered sections. |
| D2 | Introduction | Person + builder | Connect Lukáš to the work immediately. |
| D3/D6 | Showcase | FixIt, Reservine, vitrinka, Pultík, Výbava, ClaudikPublic | User delegated selection of active work; public tooling/mirrors verified 2026-10-10. |
| D7 | Personal work | Pultík | Public personal tooling; avoid invented community affiliations. |
| D4/D8 | Motion | One subtle animated hero | Adapt orbital artwork to B; no typing loop, snake, or stats wall. |
| D5/D9 | Contact | LinkedIn + Instagram | Explicit public destinations provided by user. |
| D10 | Výbava card | Removed, superseding D3/D6's Výbava entry | `henderson-tech/vybava` went private 2026-10-10; its links 404 for the public. |

## Assumptions
- Root README.md in public LEFTEQ/LEFTEQ is the surface, not GitHub Pages.
- Native Markdown/HTML for text, tables and links; SVG image assets for artwork.
- Public mirror timestamps indicate freshness, not releases, usage, or external contributions.
- Dark and light artwork variants; readable first frame and reduced-motion guard.
- No private repository/PR URLs, account email, external analytics, or third-party dynamic image services.

## Architecture notes
`scripts/artwork.ts` owns the visual manifest and generates `assets/*.svg`; its check mode catches drift. The README references relative artwork paths and verified public URLs. `docs/profile.md` documents generation and rendering constraints.

## Open questions
Public GitHub repository creation, push, and merge need explicit publication authorization after local verification.

## Reference
https://app.vitrinka.ai/w/adf/brainstorms/lefteq-profile-design-20261010
