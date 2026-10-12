import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Social preview image, generated at build time for / (and inherited by /docs)
export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#f7f7f4",
          color: "#1c1c1a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 32, fontWeight: 600 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 999,
              border: "3px solid #1c1c1a",
              background: "linear-gradient(to top, #1d6b80 55%, transparent 55%)",
            }}
          />
          {SITE.name}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* The OG renderer needs display:flex on any div with more than one child, and
              "text {value} text" counts as several, so text is passed as one string. */}
          <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Pour colour into your interface.
          </div>
          <div style={{ display: "flex", fontSize: 32, color: "#6b6b65" }}>
            {`Liquid hover and scroll effects for React · ${SITE.sizeGzip} · zero dependencies`}
          </div>
        </div>
      </div>
    ),
    size,
  );
}
