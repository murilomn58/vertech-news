import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Vertech News — AI Intelligence Feed";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0f",
          fontFamily: "monospace",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(0,240,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Top border glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #00f0ff, #a855f7, #00f0ff, transparent)",
          }}
        />

        {/* Bottom border glow */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "4px",
            background:
              "linear-gradient(90deg, transparent, #00f0ff, #a855f7, #00f0ff, transparent)",
          }}
        />

        {/* V logo */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "120px",
            height: "120px",
            borderRadius: "24px",
            border: "2px solid rgba(0,240,255,0.3)",
            backgroundColor: "rgba(0,240,255,0.05)",
            marginBottom: "30px",
          }}
        >
          <span
            style={{
              fontSize: "72px",
              fontWeight: "bold",
              color: "#00f0ff",
              fontFamily: "monospace",
            }}
          >
            V
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginBottom: "16px",
          }}
        >
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#00f0ff",
              letterSpacing: "8px",
              fontFamily: "monospace",
            }}
          >
            VERTECH
          </span>
          <span
            style={{
              fontSize: "56px",
              fontWeight: "bold",
              color: "#e4e4ef",
              letterSpacing: "8px",
              fontFamily: "monospace",
            }}
          >
            NEWS
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(0,240,255,0.4)",
            }}
          />
          <span
            style={{
              fontSize: "20px",
              color: "#8888a0",
              letterSpacing: "6px",
              textTransform: "uppercase",
              fontFamily: "monospace",
            }}
          >
            AI Intelligence Feed
          </span>
          <div
            style={{
              width: "40px",
              height: "1px",
              backgroundColor: "rgba(0,240,255,0.4)",
            }}
          />
        </div>

        {/* Category pills */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          {[
            { name: "CLAUDE CODE", color: "#a855f7" },
            { name: "AI GENERAL", color: "#06b6d4" },
            { name: "AI BUSINESS", color: "#f59e0b" },
          ].map((cat) => (
            <div
              key={cat.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 20px",
                borderRadius: "4px",
                border: `1px solid ${cat.color}40`,
                backgroundColor: `${cat.color}10`,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  backgroundColor: cat.color,
                }}
              />
              <span
                style={{
                  fontSize: "14px",
                  color: cat.color,
                  letterSpacing: "3px",
                  fontFamily: "monospace",
                }}
              >
                {cat.name}
              </span>
            </div>
          ))}
        </div>

        {/* URL at bottom */}
        <span
          style={{
            position: "absolute",
            bottom: "24px",
            fontSize: "14px",
            color: "#555570",
            letterSpacing: "4px",
            fontFamily: "monospace",
          }}
        >
          vertechnews.com
        </span>
      </div>
    ),
    { ...size }
  );
}
