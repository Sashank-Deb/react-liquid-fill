/** Site-wide settings used for links, metadata and structured data. */

export const SITE = {
  name: "react-liquid-fill",
  title: "react-liquid-fill: liquid hover and scroll effects for React",
  description:
    "Pour colour into icons, buttons and text. A tiny React component and hook that reveals content with an animated liquid edge on hover, focus or scroll. Under 3 kB, zero dependencies.",
  /** Set NEXT_PUBLIC_SITE_URL to your real domain before deploying. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://react-liquid-fill.dev",
  version: "0.1.0",
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
