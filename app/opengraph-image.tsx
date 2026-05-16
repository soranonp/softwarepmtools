import { ImageResponse } from "next/og";

export const alt =
  "Software PM Tools — estimate and plan software projects before hiring vendors";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Latin-only copy: the default ImageResponse font cannot render Thai glyphs.
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
          padding: "72px",
          backgroundColor: "#0a2540",
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "12px",
              backgroundColor: "#1e6bff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "26px",
              fontWeight: 700,
            }}
          >
            PM
          </div>
          <div style={{ fontSize: "30px", fontWeight: 700 }}>
            Software PM Tools
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              fontSize: "62px",
              fontWeight: 700,
              lineHeight: 1.15,
              maxWidth: "960px",
            }}
          >
            Estimate Man-day, Budget &amp; Timeline before you hire a vendor
          </div>
          <div style={{ fontSize: "28px", color: "#dbe7ff" }}>
            Thai-first toolkit for IT PM, BA, Founders &amp; software teams
          </div>
        </div>

        <div
          style={{
            fontSize: "24px",
            color: "#8aa6c8",
            borderTop: "1px solid rgba(255,255,255,0.15)",
            paddingTop: "24px",
          }}
        >
          softwarepmtools.com
        </div>
      </div>
    ),
    { ...size },
  );
}
