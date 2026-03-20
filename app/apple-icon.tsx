import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0b10",
          borderRadius: 36,
        }}
      >
        <span
          style={{
            color: "#f5f0e8",
            fontSize: 60,
            fontWeight: 900,
            fontFamily:
              '-apple-system, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: "2px",
            lineHeight: 1,
          }}
        >
          NBM
        </span>
      </div>
    ),
    { ...size }
  );
}
