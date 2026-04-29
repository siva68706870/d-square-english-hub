import planeImg from "@/assets/plane.png";

/**
 * Cinematic single airplane:
 * - Enters from the left
 * - Flies straight for the first half of the screen
 * - Then banks upward and flies away into the distance
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

      {/* Single cinematic plane */}
      <div className="absolute top-[42%] left-0 w-full">
        <div className="relative animate-plane-takeoff will-change-transform">
          {/* Long contrail behind plane */}
          <div className="absolute top-1/2 right-full -translate-y-1/2 h-[3px] w-[360px] bg-gradient-to-l from-neon via-neon/50 to-transparent blur-[1px] rounded-full" />
          <div className="absolute top-1/2 right-full -translate-y-1/2 h-[1px] w-[520px] bg-gradient-to-l from-white/70 to-transparent" />

          {/* Plane image */}
          <img
            src={planeImg}
            alt=""
            aria-hidden="true"
            width={1024}
            height={512}
            className="h-20 md:h-28 w-auto drop-shadow-[0_0_24px_rgba(56,189,248,0.55)]"
          />
        </div>
      </div>
    </div>
  );
}
