#!/usr/bin/env node
/**
 * Builds the two artworks each technology needs:
 *
 *   public/technology/filled/<slug>.svg   the full-colour logo (revealed by the liquid)
 *   public/technology/outline/<slug>.svg  the same artwork re-styled as a white shape with a thin dark stroke
 *
 * This is the same recipe sandepalm.com uses: Devicon "original" logos, with every shape in the
 * outline copy given fill="#fff" and a stroke 1.6% of the icon's width, and both viewBoxes padded by 4%.
 *
 * Sources, in order:
 *   1. Devicon (https://devicon.dev, MIT) — downloaded from jsDelivr, or read from a local checkout with --from
 *   2. A single-path fallback from data/technologies.json (e.g. Simple Icons, CC0) for logos Devicon lacks
 *
 * Usage:
 *   npm run icons                          # download from jsDelivr
 *   node scripts/build-icons.mjs --from ../devicon   # use a local devicon clone instead
 *   node scripts/build-icons.mjs --force   # overwrite files that already exist
 */
import { mkdir, readFile, writeFile, access } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const DEVICON_VERSION = "2.16.0";
const PAD = 0.04; // 4% breathing room around the artwork
const STROKE = 0.016; // outline stroke as a fraction of the viewBox width
const OUTLINE_FILL = "#fff";
const OUTLINE_STROKE = "#1c1c1c";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const fromDir = args.includes("--from") ? resolve(args[args.indexOf("--from") + 1]) : null;
const force = args.includes("--force");

const technologies = JSON.parse(await readFile(join(root, "data/technologies.json"), "utf8"));
const outDir = (variant) => join(root, "public/technology", variant);
await mkdir(outDir("filled"), { recursive: true });
await mkdir(outDir("outline"), { recursive: true });

const exists = (p) => access(p).then(() => true, () => false);

async function loadDevicon(id) {
  const [folder, file] = id.split("/");
  if (fromDir) return readFile(join(fromDir, "icons", folder, `${file}.svg`), "utf8");
  const url = `https://cdn.jsdelivr.net/npm/devicon@${DEVICON_VERSION}/icons/${folder}/${file}.svg`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  return res.text();
}

/** Pad the viewBox so strokes and edges never touch the image bounds. */
function padViewBox(svg) {
  return svg.replace(/viewBox="([^"]+)"/, (_, vb) => {
    const [x, y, w, h] = vb.trim().split(/[\s,]+/).map(Number);
    const px = w * PAD, py = h * PAD;
    const n = (v) => +v.toFixed(3);
    return `viewBox="${n(x - px)} ${n(y - py)} ${n(w + 2 * px)} ${n(h + 2 * py)}"`;
  });
}

function viewBoxWidth(svg) {
  const m = svg.match(/viewBox="([^"]+)"/);
  const w = m ? Number(m[1].trim().split(/[\s,]+/)[2]) : NaN;
  return Number.isFinite(w) ? w : 128;
}

/** Re-style every drawn shape as white with a thin dark stroke; keep geometry, transforms and opacity. */
function toOutline(svg) {
  const width = viewBoxWidth(svg) / (1 + 2 * PAD); // stroke relative to the original artwork
  const strokeWidth = +(width * STROKE).toFixed(3);
  const shape = /<(path|circle|rect|ellipse|polygon|polyline|line)\b([^>]*?)(\/?)>/g;
  return svg.replace(shape, (_, tag, attrs, selfClose) => {
    const kept = attrs
      .replace(/\s(fill|stroke|stroke-width|stroke-linejoin|stroke-linecap|fill-opacity|stroke-opacity)="[^"]*"/g, "")
      .replace(/\sstyle="[^"]*"/g, "");
    return `<${tag}${kept} fill="${OUTLINE_FILL}" stroke="${OUTLINE_STROKE}" stroke-width="${strokeWidth}" stroke-linejoin="round" stroke-linecap="round"${selfClose}>`;
  });
}

function fromFallback({ path, color }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="${color}" d="${path}"/></svg>`;
}

const results = { built: [], skipped: [], failed: [] };

for (const tech of technologies) {
  const filledPath = join(outDir("filled"), `${tech.slug}.svg`);
  const outlinePath = join(outDir("outline"), `${tech.slug}.svg`);
  if (!force && (await exists(filledPath)) && (await exists(outlinePath))) {
    results.skipped.push(tech.slug);
    continue;
  }
  try {
    let source;
    if (tech.devicon) source = await loadDevicon(tech.devicon);
    else if (tech.fallback) source = fromFallback(tech.fallback);
    else throw new Error("no devicon id or fallback");

    source = source.replace(/<\?xml[^>]*>\s*/, "").replace(/<!--[\s\S]*?-->/g, "").trim();
    const filled = padViewBox(source);
    await writeFile(filledPath, filled + "\n");
    await writeFile(outlinePath, toOutline(filled) + "\n");
    results.built.push(tech.slug);
  } catch (err) {
    results.failed.push(`${tech.slug} (${err.message})`);
  }
}

console.log(`Built ${results.built.length}, skipped ${results.skipped.length} (already present; use --force to rebuild).`);
if (results.failed.length) {
  console.log(`Failed: ${results.failed.join(", ")}`);
  console.log("Add your own SVGs to public/technology/{filled,outline}/ for these, or give them a fallback in data/technologies.json.");
  process.exitCode = 1;
}
