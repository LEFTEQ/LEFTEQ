import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const output = fileURLToPath(new URL("../assets/", import.meta.url));
const themes = {
  dark: { bg: "#081626", grid: "#24415c", border: "#355273", text: "#e6edf3", muted: "#adc7e8", accent: "#8be3c4", orbit: "#5399da" },
  light: { bg: "#edf5fc", grid: "#c7dbea", border: "#b1ccdf", text: "#102b45", muted: "#3d5e7c", accent: "#176851", orbit: "#316b9e" },
} as const;
type Theme = (typeof themes)[keyof typeof themes];

const projects = [
  { id: "fixit", name: "FixIt.", label: "Help for your home.", icon: "house", dark: { bg: "#361d25", ink: "#ff9089" }, light: { bg: "#fff0ee", ink: "#a33235" } },
  { id: "reservine", name: "Reservine", label: "Bookings. Payments. Access.", icon: "calendar", dark: { bg: "#172c2b", ink: "#9ce7c9" }, light: { bg: "#e9f7f0", ink: "#216147" } },
  { id: "vitrinka", name: "vitrinka", label: "Visual feedback, connected.", icon: "board", dark: { bg: "#202542", ink: "#c1c3ff" }, light: { bg: "#f0efff", ink: "#4f468a" } },
  { id: "pultik", name: "Pultík", label: "Your macOS command center.", icon: "menu", dark: { bg: "#182c41", ink: "#a9d5f4" }, light: { bg: "#ebf4fc", ink: "#285a80" } },
  { id: "claudik", name: "ClaudikPublic", label: "My development setup, shared.", icon: "terminal", dark: { bg: "#30252a", ink: "#e6bbc3" }, light: { bg: "#fbf0f3", ink: "#824456" } },
] as const;

const escape = (text: string) => text.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const mono = "ui-monospace, 'SFMono-Regular', Menlo, Consolas, monospace";
const sans = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function hero(theme: Theme, animated: boolean) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="400" viewBox="0 0 1200 400" role="img" aria-labelledby="title desc">
  <title id="title">Hello, I’m Lukáš. Products. Tools. Less complexity.</title>
  <desc id="desc">LEFTEQ — independent builder. A blue engineering grid with quiet orbital geometry.</desc>
  <defs>
    <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M 32 0 H 0 V 32" fill="none" stroke="${theme.grid}" stroke-opacity=".5"/></pattern>
    <clipPath id="frame"><rect x="1" y="1" width="1198" height="398" rx="12"/></clipPath>
  </defs>
  <style>
    .orbit { transform-box: view-box; transform-origin: 1015px 210px; }
    ${animated ? ".orbit { animation: settle 4.5s ease-in-out both; } @keyframes settle { from { transform: rotate(-16deg); } to { transform: rotate(0deg); } }" : ""}
    @media (prefers-reduced-motion: reduce) { .orbit { animation: none; } }
  </style>
  <g clip-path="url(#frame)">
    <rect width="1200" height="400" fill="${theme.bg}"/>
    <rect width="1200" height="400" fill="url(#grid)"/>
    <g fill="${theme.muted}"><circle cx="48" cy="42" r="4"/><circle cx="66" cy="42" r="4"/><circle cx="84" cy="42" r="4"/></g>
    <text x="1148" y="47" text-anchor="end" fill="${theme.muted}" font-family="${mono}" font-size="14" letter-spacing="1">LEFTEQ / builder’s workspace</text>
    <g class="orbit" fill="none" stroke-width="1.5">
      <ellipse cx="1015" cy="210" rx="156" ry="156" stroke="${theme.orbit}"/>
      <ellipse cx="1015" cy="210" rx="149" ry="86" transform="rotate(35 1015 210)" stroke="${theme.border}"/>
      <path d="M 850 210 H 1180 M 1015 45 V 375" stroke="${theme.grid}" stroke-dasharray="4 8"/>
      <circle cx="912" cy="93" r="5" fill="${theme.accent}" stroke="none"/>
      <circle cx="875" cy="187" r="4" fill="${theme.accent}" stroke="none"/>
    </g>
    <text x="48" y="183" fill="${theme.text}" font-family="${mono}" font-size="62" font-weight="700" letter-spacing="-3">Hello, I’m Lukáš.</text>
    <text x="50" y="242" fill="${theme.muted}" font-family="${mono}" font-size="25">Products. Tools. Less complexity.</text>
    <path d="M 50 296 H 82" stroke="${theme.accent}" stroke-width="3"/>
    <text x="96" y="302" fill="${theme.accent}" font-family="${mono}" font-size="17">Independent builder</text>
  </g>
  <rect x="1" y="1" width="1198" height="398" rx="12" fill="none" stroke="${theme.border}"/>
</svg>\n`;
}

function icon(kind: (typeof projects)[number]["icon"]) {
  switch (kind) {
    case "house": return '<path d="m5 24 19-17 19 17M10 20v23h28V20M20 43V29h9v14"/>';
    case "calendar": return '<rect x="7" y="11" width="35" height="32" rx="4"/><path d="M7 21h35M16 6v10M33 6v10m-18 17 6 6 12-12"/>';
    case "board": return '<rect x="5" y="8" width="38" height="33" rx="4"/><path d="M5 18h38M14 25h8v9h-8m15-9h7m-7 6h7"/>';
    case "menu": return '<rect x="5" y="7" width="38" height="36" rx="4"/><path d="M5 17h38M13 12h1m5 0h1m5 0h1M13 26h22M13 34h15"/>';
    case "terminal": return '<rect x="5" y="8" width="38" height="33" rx="4"/><path d="m13 19 7 6-7 6m13 0h10"/>';
  }
}

function cover(project: (typeof projects)[number], name: keyof typeof themes) {
  const { bg, ink } = project[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="220" viewBox="0 0 640 220" role="img" aria-labelledby="title desc">
  <title id="title">${escape(project.name)}</title><desc id="desc">${escape(project.label)}</desc>
  <rect width="640" height="220" rx="12" fill="${bg}"/>
  <g transform="translate(540 42)" stroke="${ink}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".7">${icon(project.icon)}</g>
  <text x="32" y="113" fill="${ink}" font-family="${sans}" font-size="${project.name.length > 10 ? 42 : 50}" font-weight="700" letter-spacing="-1">${escape(project.name)}</text>
  <text x="34" y="164" fill="${ink}" font-family="${mono}" font-size="19">${escape(project.label)}</text>
</svg>\n`;
}

const files = new Map<string, string>();
for (const [name, theme] of Object.entries(themes)) {
  files.set(`hero-${name}.svg`, hero(theme, true));
  files.set(`hero-${name}-static.svg`, hero(theme, false));
  for (const project of projects) files.set(`${project.id}-${name}.svg`, cover(project, name as keyof typeof themes));
}

if (process.argv.includes("--check")) {
  const drift: string[] = [];
  for (const [name, expected] of files) {
    let actual: string;
    try { actual = await readFile(`${output}${name}`, "utf8"); }
    catch (error) {
      if (error instanceof Error && "code" in error && error.code === "ENOENT") { drift.push(name); continue; }
      throw error;
    }
    if (actual !== expected) drift.push(name);
  }
  if (drift.length) throw new Error(`Artwork drift: ${drift.join(", ")}. Run bun scripts/artwork.ts.`);
  console.log(`Artwork matches the manifest (${files.size} SVGs).`);
} else {
  await mkdir(output, { recursive: true });
  for (const [name, content] of files) await writeFile(`${output}${name}`, content);
  console.log(`Generated ${files.size} SVGs.`);
}
