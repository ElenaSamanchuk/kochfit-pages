import { chromium } from "playwright";

const base = process.argv[2] ?? "http://localhost:3400";
const routes = ["/", "/community", "/journal", "/equipment", "/person"];
const b = await chromium.launch();
for (const r of routes) {
  const p = await b.newPage();
  const failed = [];
  p.on("response", (res) => {
    const u = res.url();
    if (/\.(png|jpe?g|svg|webp|gif)(\?|$)/i.test(u) && res.status() >= 400)
      failed.push(res.status() + " " + u);
  });
  await p.goto(base + r, { waitUntil: "networkidle", timeout: 60000 }).catch(() => {});
  await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight)).catch(() => {});
  await p.waitForTimeout(1500);
  const zero = await p.evaluate(() =>
    [...document.querySelectorAll("img")]
      .filter((i) => i.complete && i.naturalWidth === 0 && i.getAttribute("src"))
      .map((i) => i.getAttribute("src")),
  );
  console.log(`\n== ${r} ==`);
  console.log("  http>=400:", failed.length ? [...new Set(failed)].slice(0, 20) : "нет");
  console.log("  naturalWidth=0:", zero.length ? [...new Set(zero)].slice(0, 20) : "нет");
  await p.close();
}
await b.close();
