import planeImg from "@/assets/plane.png";

/**
 * Cinematic single airplane:
 * - Enters from the left, flies straight, then banks upward and away.
 * - No contrail. Smooth, medium-paced, looping motion.
 */
export function AirplaneAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drifting clouds for depth */}
      <div className="absolute top-[20%] left-[-10%] w-40 h-12 rounded-full bg-white/10 blur-2xl animate-cloud-drift" />
      <div
        className="absolute top-[55%] left-[-20%] w-56 h-16 rounded-full bg-white/15 blur-3xl animate-cloud-drift-slow"
        style={{ animationDelay: "6s" }}
      />
      <div
        className="absolute top-[75%] left-[-15%] w-48 h-14 rounded-full bg-white/10 blur-2xl animate-cloud-drift"
        style={{ animationDelay: "12s" }}
      />

      {/* Single cinematic plane (no trail) */}
      <div className="absolute top-[42%] left-0 w-full">
        <div className="relative animate-plane-takeoff will-change-transform">
          <img
            src={planeImg}
            alt=""
            aria-hidden="true"
            width={1024}
            height={512}
            className="h-20 md:h-28 w-auto drop-shadow-[0_0_28px_rgba(168,85,247,0.55)]"
          />
        </div>
      </div>
    </div>
  );
}
