/**
 * SiteBackdrop — global cyberpunk-neon ambient layer.
 * Mounted once in __root.tsx, sits behind all content (z = 0, body content is z = 1).
 * Subtle and cinematic: animated grid floor, floating aurora orbs, gentle scanlines.
 * pointer-events: none so it never interferes with the UI.
 */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Animated neon grid floor */}
      <div className="absolute inset-0 cyber-grid opacity-60" />

      {/* Floating aurora orbs */}
      <div
        className="cyber-orb"
        style={{
          top: "-10%",
          left: "-5%",
          width: "520px",
          height: "520px",
          background:
            "radial-gradient(circle, oklch(0.65 0.24 295 / 0.7), transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          top: "30%",
          right: "-8%",
          width: "460px",
          height: "460px",
          background:
            "radial-gradient(circle, oklch(0.82 0.18 195 / 0.55), transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          bottom: "-12%",
          left: "30%",
          width: "560px",
          height: "560px",
          background:
            "radial-gradient(circle, oklch(0.7 0.27 340 / 0.5), transparent 70%)",
          animationDelay: "-12s",
        }}
      />

      {/* Soft CRT scanlines on top */}
      <div className="absolute inset-0 cyber-scanlines opacity-40" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, oklch(0.08 0.02 270 / 0.6) 100%)",
        }}
      />
    </div>
  );
}
