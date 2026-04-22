import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          background: "#0a0a0f",
          borderRadius: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Gradient pill background */}
        <div
          style={{
            width: 140,
            height: 140,
            borderRadius: 32,
            background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(99,102,241,0.5)",
          }}
        >
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" />
          </svg>
        </div>
      </div>
    ),
    size
  );
}
