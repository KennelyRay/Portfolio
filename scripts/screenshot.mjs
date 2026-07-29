// Dev helper: screenshot the running app so UI changes can be eyeballed.
//
//   node scripts/screenshot.mjs --out=shot.png
//   node scripts/screenshot.mjs --selector="#works" --width=1440 --out=works.png
//   node scripts/screenshot.mjs --width=390 --height=844 --selector="#works"
//
// Flags: --url --out --width --height --selector --scale --fullPage --wait
import { chromium } from "playwright";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, ...v] = a.replace(/^--/, "").split("=");
    return [k, v.length ? v.join("=") : true];
  }),
);

const url = args.url ?? "http://localhost:3000";
const out = args.out ?? "shot.png";
const width = Number(args.width ?? 1440);
const height = Number(args.height ?? 900);
const scale = Number(args.scale ?? 2);
const extraWait = Number(args.wait ?? 600);

const browser = await chromium.launch();
const page = await browser.newPage({
  viewport: { width, height },
  deviceScaleFactor: scale,
});

const problems = [];
page.on("console", (m) => {
  if (m.type() === "error") problems.push(`console: ${m.text()}`);
});
page.on("pageerror", (e) => problems.push(`pageerror: ${e}`));

await page.goto(url, { waitUntil: "networkidle" });

// The boot loader blocks the page for a few seconds and locks body scroll.
await page
  .locator('[aria-label="Loading portfolio"]')
  .waitFor({ state: "detached", timeout: 30_000 })
  .catch(() => console.log("note: loading screen never appeared/cleared"));

if (args.selector) {
  const target = page.locator(args.selector).first();
  await target.scrollIntoViewIfNeeded();
  // Sections animate in on scroll (framer-motion whileInView).
  await page.waitForTimeout(1200 + extraWait);
  await target.screenshot({ path: out });
} else {
  await page.waitForTimeout(extraWait);
  await page.screenshot({ path: out, fullPage: Boolean(args.fullPage) });
}

if (problems.length) console.log("PAGE PROBLEMS:\n" + problems.join("\n"));
console.log(`saved ${out} (${width}x${height} @${scale}x)`);

await browser.close();
