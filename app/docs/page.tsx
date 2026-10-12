import type { Metadata } from "next";
import { DocsPage } from "@/components/docs/DocsPage";
import { getLatestVersion } from "@/lib/npm";
import { SITE } from "@/lib/site";

// Rendering: static HTML built once and served from the CDN. The only value that can change
// without a deploy is the npm version, so the page is regenerated at most once a day (ISR).
export const dynamic = "force-static";
export const revalidate = 86400; // 1 day; matches VERSION_REVALIDATE in lib/npm.ts (Next needs a literal here)

const title = "Documentation and API reference";
const description =
  "Install react-liquid-fill, see live demos, use it with any icon set, and browse the full API for LiquidFill, useLiquidFill and liquidPolygon.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/docs" },
  // openGraph and twitter replace the site-wide values rather than merging, so repeat the shared fields.
  // The social image is app/docs/opengraph-image.png (and twitter-image.png).
  openGraph: {
    type: "article",
    siteName: SITE.name,
    title: `${title} · ${SITE.name}`,
    description,
    url: "/docs",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: `${title} · ${SITE.name}`, description },
};

export default async function Page() {
  return <DocsPage version={await getLatestVersion()} />;
}
