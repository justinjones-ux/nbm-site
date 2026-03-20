import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 7,
        }}
      >
        <span
          style={{
            color: "#f5f0e8",
            fontSize: 11,
            fontWeight: 900,
            fontFamily:
              '-apple-system, "Helvetica Neue", Arial, sans-serif',
            letterSpacing: "0.3px",
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
