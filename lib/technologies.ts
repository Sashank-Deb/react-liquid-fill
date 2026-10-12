import data from "@/data/technologies.json";

export type Technology = {
  name: string;
  slug: string;
  /** Devicon source, "folder/file" (used by scripts/build-icons.mjs). */
  devicon?: string;
  /** Logo is near-black; inverted in dark mode so it stays visible. */
  darkInvert?: boolean;
  /** Single-path artwork for logos Devicon doesn't have. */
  fallback?: { color: string; path: string };
};

export const technologies = data as Technology[];

/** Where the generated artwork lives. Override with NEXT_PUBLIC_ICON_ROOT (e.g. for a CDN). */
const ICON_ROOT = process.env.NEXT_PUBLIC_ICON_ROOT ?? "/technology";

export const iconSrc = (variant: "outline" | "filled", slug: string) => `${ICON_ROOT}/${variant}/${slug}.svg`;
