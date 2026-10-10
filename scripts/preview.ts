import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const server = Bun.serve({
  hostname: "0.0.0.0",
  port: Number(process.env.PORT_WEB ?? process.env.PORT ?? 3000),
  async fetch(request) {
    const path = new URL(request.url).pathname;
    if (path.startsWith("/assets/")) {
      if (!/^\/assets\/[a-z-]+\.svg$/.test(path)) return new Response("Not found", { status: 404 });
      const file = Bun.file(`${root}${path.slice(1)}`);
      if (!(await file.exists())) return new Response("Not found", { status: 404 });
      return new Response(file, { headers: { "Content-Type": "image/svg+xml", "Cache-Control": "no-store" } });
    }
    if (path !== "/") return new Response("Not found", { status: 404 });
    const readme = await Bun.file(`${root}README.md`).text();
    const content = Bun.markdown.html(readme);
    return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>LEFTEQ — profile preview</title><style>
      *{box-sizing:border-box}html{color-scheme:light dark}body{margin:0;background:#fff;color:#1f2328;font:16px/1.5 -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif}main{max-width:930px;margin:32px auto;padding:28px;border:1px solid #d1d9e0;border-radius:6px}h2{font-size:24px;border-bottom:1px solid #d1d9e0;padding-bottom:.3em;margin-top:24px}h3{font-size:18px;margin:16px 0}p{margin:16px 0}a{color:#0969da;text-decoration:none}a:hover{text-decoration:underline}a:focus-visible{outline:2px solid #0969da;outline-offset:3px}img{max-width:100%;height:auto;vertical-align:middle}table{display:block;width:max-content;max-width:100%;overflow:auto;border-spacing:0;border-collapse:collapse;margin:16px 0}td{padding:8px 13px;border:1px solid #d1d9e0;min-width:160px}td p{font-size:14px}code{font:85% ui-monospace,monospace;background:#818b981f;padding:.2em .4em;border-radius:4px}hr{height:4px;background:#d1d9e0;border:0;margin:24px 0}.notice{max-width:930px;margin:20px auto;color:#59636e;font-size:12px;padding:0 20px}@media(prefers-color-scheme:dark){body{background:#0d1117;color:#e6edf3}main,h2,td{border-color:#30363d}a{color:#82b5ff}hr{background:#30363d}.notice{color:#9da7b3}}@media(max-width:600px){main{margin:12px;padding:16px}h2{font-size:20px}}
    </style></head><body><div class="notice">Local README preview · GitHub-like formatting, not proof of GitHub’s exact sanitizer or image proxy.</div><main>${content}</main></body></html>`, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
  },
});
console.log(`Profile preview listening on ${server.url}`);
