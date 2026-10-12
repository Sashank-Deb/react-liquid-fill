import { SITE } from "./site";

/** How often (seconds) the pages re-check npm for a new version. */
export const VERSION_REVALIDATE = 60 * 60 * 24;

/**
 * Latest published version of the package, so the site stays current after `npm publish`
 * without a redeploy. Cached by Next.js and refreshed at most once a day (ISR).
 * Falls back to SITE.version if the registry is unreachable or the package isn't published yet.
 */
export async function getLatestVersion(): Promise<string> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${SITE.name}/latest`, {
      next: { revalidate: VERSION_REVALIDATE },
      signal: AbortSignal.timeout(4000),
    });
    if (!res.ok) return SITE.version;
    const data = (await res.json()) as { version?: unknown };
    return typeof data.version === "string" && /^\d+\.\d+\.\d+/.test(data.version) ? data.version : SITE.version;
  } catch {
    return SITE.version;
  }
}
