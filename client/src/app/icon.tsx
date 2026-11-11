import { ImageResponse } from "next/og";

export const size = { width: 66, height: 66 };
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
          borderRadius: 16,
          background: "#0b1a15",
          border: "3px solid rgba(52,211,153,0.6)",
        }}
      >
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 4h5.2a3.4 3.4 0 0 1 0 6.8H8m0 0h6a3.6 3.6 0 0 1 0 7.2H8M8 4v14"
            stroke="#6ee7b7"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M10.5 2v2M13.5 2v2M10.5 18v2M13.5 18v2" stroke="#6ee7b7" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      </div>
    ),
    size,
  );
}