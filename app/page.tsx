import type { Metadata } from "next";
import { Landing } from "@/components/landing/Landing";
import { getLatestVersion } from "@/lib/npm";
import { SITE } from "@/lib/site";

// Rendering: static HTML built once and served from the CDN. The only value that can change
// without a deploy is the npm version, so the page is regenerated at most once a day (ISR).
export const dynamic = "force-static";
export const revalidate = 86400; // 1 day; matches VERSION_REVALIDATE in lib/npm.ts (Next needs a literal here)

export const metadata: Metadata = {
  title: { absolute: SITE.title },
  alternates: { canonical: "/" },
};

export default async function Page() {
  return <Landing version={await getLatestVersion()} />;
}
