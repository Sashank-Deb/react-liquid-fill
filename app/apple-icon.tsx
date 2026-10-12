import { ImageResponse } from "next/og";

// Home-screen icon for iOS. next/og needs display:flex on every div with more than one child.
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#f7f7f4" }}>
        <div
          style={{
            display: "flex",
            width: 124,
            height: 124,
            borderRadius: 999,
            border: "10px solid #1c1c1a",
            background: "linear-gradient(to top, #1d6b80 52%, #f7f7f4 52%)",
          }}
        />
      </div>
    ),
    size,
  );
}
