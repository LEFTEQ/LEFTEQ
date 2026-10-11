import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const username = "LEFTEQ";
const dayMs = 86_400_000;
const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const start = new Date(today);
start.setUTCFullYear(start.getUTCFullYear() - 1);
start.setUTCDate(start.getUTCDate() + 1);
const dateKey = (date: Date) => date.toISOString().slice(0, 10);
const days = new Map<string, { count: number; level: number }>();

for (let year = start.getUTCFullYear(); year <= today.getUTCFullYear(); year++) {
  const response = await fetch(`https://github.com/users/${username}/contributions?year=${year}`, {
    headers: { "User-Agent": "LEFTEQ-profile-contribution-chart", Accept: "text/html" },
    signal: AbortSignal.timeout(30_000),
  });
  if (!response.ok) throw new Error(`Public GitHub calendar ${year}: HTTP ${response.status}`);
  const html = await response.text();
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = match[1].match(/\bfor="([^"]+)"/)?.[1];
    const count = match[2].trim().match(/^(No|[\d,]+) contributions? on /)?.[1];
    if (id && count) counts.set(id, count === "No" ? 0 : Number(count.replaceAll(",", "")));
  }
  for (const match of html.matchAll(/<td\b([^>]*\bdata-date="[^"]+"[^>]*)>/g)) {
    const attrs = match[1];
    const date = attrs.match(/\bdata-date="(\d{4}-\d{2}-\d{2})"/)?.[1];
    const id = attrs.match(/\bid="([^"]+)"/)?.[1];
    const levelText = attrs.match(/\bdata-level="([0-4])"/)?.[1];
    if (!date || !id || !levelText) throw new Error(`Unrecognized calendar cell in ${year}`);
    if (date < dateKey(start) || date > dateKey(today)) continue;
    const count = counts.get(id);
    if (count === undefined || !Number.isSafeInteger(count)) throw new Error(`Missing public contribution count for ${date}`);
    days.set(date, { count, level: Number(levelText) });
  }
}

const expectedDays = Math.round((today.getTime() - start.getTime()) / dayMs) + 1;
if (days.size !== expectedDays) throw new Error(`Incomplete public calendar: ${days.size}/${expectedDays} days. No chart written.`);
const ordered = [...days].sort(([a], [b]) => a.localeCompare(b));
const total = ordered.reduce((sum, [, day]) => sum + day.count, 0);
const firstSunday = new Date(start.getTime() - start.getUTCDay() * dayMs);
const formatNumber = (value: number) => value.toLocaleString("en-US");
const palettes = {
  dark: { bg: "#081626", text: "#e6edf3", muted: "#adc7e8", border: "#355273", cells: ["#162b3d", "#244e58", "#367b78", "#55ac99", "#8be3c4"] },
  light: { bg: "#edf5fc", text: "#102b45", muted: "#3d5e7c", border: "#b1ccdf", cells: ["#d9e6ef", "#bfdfd3", "#86bea8", "#4e967a", "#176851"] },
} as const;

const output = fileURLToPath(new URL("../assets/", import.meta.url));
await mkdir(output, { recursive: true });
for (const [name, theme] of Object.entries(palettes)) {
  const cells = ordered.map(([date, { count, level }]) => {
    const day = new Date(`${date}T00:00:00Z`);
    const week = Math.floor((day.getTime() - firstSunday.getTime()) / (dayMs * 7));
    return `<rect x="${78 + week * 20}" y="${122 + day.getUTCDay() * 20}" width="15" height="15" rx="3" fill="${theme.cells[level]}"><title>${date}: ${formatNumber(count)} contributions</title></rect>`;
  }).join("\n    ");
  const seenMonths = new Set<string>();
  const months = ordered.flatMap(([date]) => {
    const month = date.slice(0, 7);
    if (seenMonths.has(month)) return [];
    seenMonths.add(month);
    const day = new Date(`${date}T00:00:00Z`);
    const week = Math.floor((day.getTime() - firstSunday.getTime()) / (dayMs * 7));
    if (week > 50) return [];
    return [`<text x="${78 + week * 20}" y="106">${day.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}</text>`];
  }).join("");
  const legend = theme.cells.map((fill, i) => `<rect x="${1000 + i * 20}" y="289" width="15" height="15" rx="3" fill="${fill}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="340" viewBox="0 0 1200 340" role="img" aria-labelledby="title desc">
  <title id="title">${username}: ${formatNumber(total)} GitHub contributions, ${dateKey(start)} to ${dateKey(today)}</title>
  <desc id="desc">Publicly visible contribution calendar, including anonymous private-work counts. Contributions are not only commits. Refreshed ${dateKey(today)} UTC.</desc>
  <rect x="1" y="1" width="1198" height="338" rx="12" fill="${theme.bg}" stroke="${theme.border}"/>
  <g font-family="ui-monospace, Menlo, Consolas, monospace" fill="${theme.text}">
    <text x="32" y="49" font-size="24" font-weight="700">Building, day by day</text>
    <text x="1168" y="48" text-anchor="end" font-size="17">${formatNumber(total)} contributions</text>
    <g font-size="13" fill="${theme.muted}">${months}<text x="32" y="154">Mon</text><text x="32" y="194">Wed</text><text x="32" y="234">Fri</text></g>
    ${cells}
    <g font-size="13" fill="${theme.muted}"><text x="32" y="302">${dateKey(start)} — ${dateKey(today)} · public calendar</text><text x="946" y="302">Less</text><text x="1110" y="302">More</text></g>
    ${legend}
  </g>
</svg>\n`;
  await writeFile(`${output}contributions-${name}.svg`, svg);
}
console.log(`Generated public contribution heatmaps: ${expectedDays} days, ${formatNumber(total)} contributions. No authentication used.`);
