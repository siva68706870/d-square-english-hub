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

      {/* Single cinematic plane with glowing light trail */}
      <div className="absolute top-[42%] left-0 w-full">
        <div className="relative animate-plane-takeoff will-change-transform">
          {/* Light trail behind the plane */}
          <div
            aria-hidden="true"
            className="absolute right-full top-1/2 -translate-y-1/2 mr-2 h-1 w-40 md:w-64 rounded-full"
            style={{
              background:
                "linear-gradient(to left, rgba(225,29,116,0.55), rgba(108,43,217,0.25), transparent)",
              filter: "blur(6px)",
            }}
          />
          <div
            aria-hidden="true"
            className="absolute right-full top-1/2 -translate-y-1/2 mr-2 h-[2px] w-28 md:w-44 rounded-full"
            style={{
              background:
                "linear-gradient(to left, rgba(255,255,255,0.85), rgba(225,29,116,0.4), transparent)",
              filter: "blur(1.5px)",
            }}
          />
          <img
            src={planeImg}
            alt=""
            aria-hidden="true"
            width={1024}
            height={512}
            className="relative h-20 md:h-28 w-auto drop-shadow-[0_0_24px_rgba(225,29,116,0.45)]"
            style={{ filter: "drop-shadow(0 8px 18px rgba(0,0,0,0.5))" }}
          />
        </div>
      </div>
    </div>
  );
}
