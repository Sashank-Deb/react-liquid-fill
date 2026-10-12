/** Site-wide settings used for links, metadata and structured data. */

export const SITE = {
  name: "react-liquid-fill",
  /** ≤ 60 characters so search results show it in full */
  title: "react-liquid-fill: liquid hover and scroll effects for React",
  /** ≤ 160 characters so search results don't cut it off */
  description:
    "Pour colour into icons, buttons and text. A tiny React component and hook for liquid fill effects on hover, focus or scroll. Under 3 kB, zero dependencies.",
  /** The deployed site. NEXT_PUBLIC_SITE_URL overrides it (e.g. for a custom domain later). No trailing slash. */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://react-liquid-fill.vercel.app").replace(/\/+$/, ""),
  repo: "https://github.com/Sashank-Deb/react-liquid-fill",
  npm: "https://www.npmjs.com/package/react-liquid-fill",
  author: "Sashank Deb",
  /** Fallback when the npm registry can't be reached at build time (see lib/npm.ts). */
  version: "0.1.1",
  sizeGzip: "2.7 kB",
  keywords: [
    "react hover effect",
    "liquid fill animation",
    "react icon animation",
    "clip-path animation",
    "scroll reveal react",
    "react hook",
    "nextjs animation",
    "button hover animation",
    "icon hover effect",
  ],
};

/** Route targets. Overridable so a static preview can link between plain .html files. */
export const HOME_HREF = process.env.NEXT_PUBLIC_HOME_HREF ?? "/";
export const DOCS_HREF = process.env.NEXT_PUBLIC_DOCS_HREF ?? "/docs";
