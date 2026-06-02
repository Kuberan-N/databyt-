import { ImageResponse } from "next/og";

export const alt = "DataByt — AI-Powered AR Collections. Get paid 30 days faster.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #FFFFFF 0%, #F5F3FF 100%)",
          padding: "72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "10px",
            background: "linear-gradient(90deg, #4F46E5 0%, #7C3AED 60%, #EC4899 100%)",
          }}
        />

        {/* Eyebrow pill */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            background: "#EEF2FF",
            color: "#4338CA",
            fontSize: "22px",
            fontWeight: 600,
            padding: "10px 22px",
            borderRadius: "999px",
            width: "fit-content",
            marginBottom: "36px",
          }}
        >
          ● AI-POWERED AR COLLECTIONS
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            fontSize: "76px",
            fontWeight: 800,
            color: "#0F172A",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
          }}
        >
          <span>Stop chasing invoices.</span>
          <span>
            DataByt{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              collects them.
            </span>
          </span>
        </div>

        {/* Subline */}
        <div
          style={{
            fontSize: "28px",
            color: "#475569",
            marginTop: "28px",
            maxWidth: "900px",
            lineHeight: 1.4,
          }}
        >
          AI dunning emails, dispute management, and live DSO + CEI analytics —
          connected to your accounting system in 48 hours.
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", gap: "56px", marginTop: "auto" }}>
          {[
            ["30%", "avg DSO reduction"],
            ["48 hrs", "to live collections"],
            ["10×", "cheaper than HighRadius"],
          ].map(([big, small]) => (
            <div key={big} style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "48px", fontWeight: 800, color: "#4F46E5" }}>{big}</span>
              <span style={{ fontSize: "22px", color: "#64748B", marginTop: "4px" }}>{small}</span>
            </div>
          ))}
        </div>

        {/* Footer brand */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginTop: "44px",
            fontSize: "30px",
            fontWeight: 700,
            color: "#0F172A",
          }}
        >
          <div
            style={{
              width: "44px",
              height: "44px",
              borderRadius: "10px",
              background: "#0F172A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#FFFFFF",
              marginRight: "16px",
              fontWeight: 800,
            }}
          >
            D
          </div>
          DataByt
          <span style={{ color: "#94A3B8", fontWeight: 400, marginLeft: "16px" }}>databyt.in</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
