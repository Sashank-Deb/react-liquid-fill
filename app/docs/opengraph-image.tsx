import { ImageResponse } from "next/og";
import { SITE } from "@/lib/site";

// Social preview for /docs. next/og needs display:flex on every div with more than one child,
// so each text block is a single string.
export const alt = `${SITE.name} documentation`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const rows = ["<LiquidFill />", "useLiquidFill()", "liquidPolygon()"];

export default function DocsOpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "stretch",
          padding: 72,
          background: "#f7f7f4",
          color: "#1c1c1a",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 30, fontWeight: 600 }}>
            <div
              style={{
                display: "flex",
                width: 34,
                height: 34,
                borderRadius: 999,
                border: "3px solid #1c1c1a",
                background: "linear-gradient(to top, #1d6b80 55%, transparent 55%)",
              }}
            />
            {`${SITE.name} / docs`}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ display: "flex", fontSize: 80, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>Documentation</div>
            <div style={{ display: "flex", fontSize: 30, color: "#6b6b65" }}>Install, live demos, any icon set, full API</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14 }}>
          {rows.map((r) => (
            <div
              key={r}
              style={{
                display: "flex",
                fontSize: 30,
                fontFamily: "monospace",
                padding: "16px 24px",
                borderRadius: 14,
                border: "2px solid #e3e3dd",
                background: "#ffffff",
                color: "#1d6b80",
              }}
            >
              {r}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
