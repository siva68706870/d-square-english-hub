/**
 * SiteBackdrop — global cyberpunk-neon ambient layer.
 * Cinematic VFX: animated grid, aurora orbs, scanlines, drifting light beams,
 * floating particles, vignette. pointer-events: none.
 */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Animated neon grid floor */}
      <div className="absolute inset-0 cyber-grid opacity-70" />

      {/* Aurora conic sweep */}
      <div className="absolute -inset-[20%] bg-aurora opacity-[0.08] blur-3xl animate-spin-slow" />

      {/* Floating aurora orbs — vibrant cinematic palette */}
      <div
        className="cyber-orb"
        style={{
          top: "-10%",
          left: "-5%",
          width: "560px",
          height: "560px",
          background:
            "radial-gradient(circle, oklch(0.65 0.28 295 / 0.85), transparent 70%)",
          animationDelay: "0s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          top: "25%",
          right: "-8%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, oklch(0.82 0.2 195 / 0.7), transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          bottom: "-12%",
          left: "28%",
          width: "620px",
          height: "620px",
          background:
            "radial-gradient(circle, oklch(0.7 0.3 340 / 0.65), transparent 70%)",
          animationDelay: "-12s",
        }}
      />
      <div
        className="cyber-orb"
        style={{
          top: "55%",
          left: "-10%",
          width: "420px",
          height: "420px",
          background:
            "radial-gradient(circle, oklch(0.78 0.22 145 / 0.5), transparent 70%)",
          animationDelay: "-9s",
        }}
      />

      {/* Cinematic light beams sweeping across */}
      <div className="cyber-beam cyber-beam-1" />
      <div className="cyber-beam cyber-beam-2" />

      {/* Floating particles */}
      <div className="cyber-particles" />

      {/* Soft CRT scanlines */}
      <div className="absolute inset-0 cyber-scanlines opacity-30" />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 45%, oklch(0.06 0.03 270 / 0.75) 100%)",
        }}
      />
    </div>
  );
}
