#!/usr/bin/env node
/**
 * Builds the package from ../../lib/liquid (the same source the docs site uses).
 *
 *   dist/index.js     ES module
 *   dist/index.cjs    CommonJS
 *   dist/index.d.ts   types (and index.d.cts for require())
 *
 * Both bundles start with "use client" so they work in Next.js server components' trees.
 */
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

// The build tools are devDependencies of this folder, not of the repository root.
const missing = ["esbuild", "typescript", "@types/react"].filter((p) => !existsSync(join(here, "node_modules", p)));
if (missing.length) {
  console.error(
    `\nMissing build tools: ${missing.join(", ")}.\n` +
      `Run "npm install" inside packages/react-liquid-fill (not the repository root), then try again:\n\n` +
      `  cd ${here}\n  npm install\n`,
  );
  process.exit(1);
}

const { build } = await import("esbuild");
const dist = join(here, "dist");
const entry = join(here, "../../lib/liquid/index.ts");

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });

const shared = {
  entryPoints: [entry],
  bundle: true,
  platform: "neutral",
  target: "es2020",
  jsx: "automatic",
  external: ["react", "react/jsx-runtime"],
  banner: { js: '"use client";' },
  legalComments: "none",
  logLevel: "warning",
};

await build({ ...shared, format: "esm", outfile: join(dist, "index.js") });
await build({ ...shared, format: "cjs", outfile: join(dist, "index.cjs") });

// Type declarations: emit with tsc, then flatten into dist/
const tsc = process.env.TSC ?? join(here, "node_modules/.bin/tsc");
execFileSync(tsc, ["-p", join(here, "tsconfig.build.json")], { stdio: "inherit" });

// Node's resolver (moduleResolution node16/nodenext) needs explicit extensions in relative imports.
// ESM types (X.d.ts) point at "./Y.js"; CommonJS types (X.d.cts) point at "./Y.cjs".
const withExt = (code, ext) => code.replace(/(from\s+["'])(\.\.?\/[^"']+?)(["'])/g, (_, a, spec, b) => `${a}${spec}${ext}${b}`);

const typesDir = join(dist, "types");
for (const file of await readdir(typesDir)) {
  if (!file.endsWith(".d.ts")) continue;
  const code = await readFile(join(typesDir, file), "utf8");
  await writeFile(join(dist, file), withExt(code, ".js"));
  await writeFile(join(dist, file.replace(/\.d\.ts$/, ".d.cts")), withExt(code, ".cjs"));
}
await rm(typesDir, { recursive: true, force: true });

console.log("Built dist/: index.js, index.cjs, and .d.ts / .d.cts types");
