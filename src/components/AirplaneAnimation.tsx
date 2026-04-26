import { Plane } from "lucide-react";

/**
 * Cinematic airplane: a glowing plane crosses the hero with a contrail and clouds.
 * Combines a subtle SVG flight path with VFX clouds & trail.
 */
export function AirplaneAnimation() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Drifting clouds */}
      <div className="absolute top-[18%] left-[-10%] w-40 h-12 rounded-full bg-white/10 blur-2xl animate-cloud-drift" />
      <div
        className="absolute top-[42%] left-[-20%] w-56 h-16 rounded-full bg-white/15 blur-3xl animate-cloud-drift-slow"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute top-[64%] left-[-15%] w-48 h-14 rounded-full bg-white/10 blur-2xl animate-cloud-drift"
        style={{ animationDelay: "8s" }}
      />

      {/* Flight path 1 — bold cinematic */}
      <div className="absolute top-[28%] left-0 w-full">
        <div className="relative animate-plane-fly">
          {/* Contrail */}
          <div className="absolute top-1/2 right-full -translate-y-1/2 h-[3px] w-[280px] bg-gradient-to-l from-neon via-neon/60 to-transparent blur-[1px] rounded-full" />
          <div className="absolute top-1/2 right-full -translate-y-1/2 h-[1px] w-[420px] bg-gradient-to-l from-white/80 to-transparent" />
          {/* Plane */}
          <div className="relative inline-flex items-center justify-center h-10 w-10 rounded-full bg-neon/20 backdrop-blur-sm shadow-[0_0_30px_rgba(56,189,248,0.7)] animate-glow-pulse">
            <Plane className="h-5 w-5 text-white rotate-[20deg] drop-shadow-[0_0_8px_rgba(56,189,248,0.9)]" />
          </div>
        </div>
      </div>

      {/* Flight path 2 — subtle smaller plane */}
      <div className="absolute top-[72%] left-0 w-full">
        <div className="relative animate-plane-fly-slow" style={{ animationDelay: "5s" }}>
          <div className="absolute top-1/2 right-full -translate-y-1/2 h-[2px] w-[180px] bg-gradient-to-l from-magenta/80 to-transparent rounded-full" />
          <Plane className="h-4 w-4 text-magenta rotate-[15deg] drop-shadow-[0_0_6px_rgba(217,70,239,0.9)]" />
        </div>
      </div>
    </div>
  );
}
