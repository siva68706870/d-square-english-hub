/**
 * SiteBackdrop — premium cinematic ambient layer.
 * Restrained: deep void, two soft glows (purple top-left, pink bottom-right),
 * faint particles and vignette. No heavy neon, no scanlines.
 */
export function SiteBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Royal purple glow — top-left */}
      <div
        className="absolute"
        style={{
          top: "-15%",
          left: "-10%",
          width: "720px",
          height: "720px",
          background:
            "radial-gradient(circle, rgba(108, 43, 217, 0.35), transparent 65%)",
          filter: "blur(80px)",
        }}
      />

      {/* Premium pink glow — bottom-right */}
      <div
        className="absolute"
        style={{
          bottom: "-15%",
          right: "-10%",
          width: "720px",
          height: "720px",
          background:
            "radial-gradient(circle, rgba(225, 29, 116, 0.22), transparent 65%)",
          filter: "blur(90px)",
        }}
      />

      {/* Midnight depth — center */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(18, 24, 38, 0.35), transparent 70%)",
        }}
      />

      {/* Faint floating particles */}
      <div className="cyber-particles opacity-30" />

      {/* Cinematic vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 50%, #0B0B0F 100%)",
        }}
      />
    </div>
  );
}
