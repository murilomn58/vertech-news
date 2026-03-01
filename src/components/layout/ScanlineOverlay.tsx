"use client";

export default function ScanlineOverlay() {
  return (
    <div
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
      style={{
        background: `repeating-linear-gradient(
          0deg,
          rgba(0, 0, 0, 0.03) 0px,
          rgba(0, 0, 0, 0.03) 1px,
          transparent 1px,
          transparent 2px
        )`,
      }}
    />
  );
}
