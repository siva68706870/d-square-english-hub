import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { AirplaneAnimation } from "@/components/AirplaneAnimation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trophy, Users, BookOpen, ArrowRight, Sparkles, Cpu, Megaphone, Star, MapPin, Phone, Copy } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useRef, useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import gallery5 from "@/assets/gallery-5.jpg";
import gallery6 from "@/assets/gallery-6.jpg";
import gallery7 from "@/assets/gallery-7.jpg";
import gallery8 from "@/assets/gallery-8.jpg";

const galleryImages = [gallery1, gallery2, gallery3, gallery4, gallery5, gallery6, gallery7, gallery8];

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isAdmin } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const id = setInterval(() => {
      setActiveSlide((s) => (s + 1) % galleryImages.length);
    }, 2000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />

      <main className="flex-1">
        {/* Hero */}
        <section
          className="relative overflow-hidden"
          onMouseMove={(e) => {
            const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
            setMouse({ x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height });
          }}
        >
          {/* Cinematic brand gradient */}
          <div className="absolute inset-0 bg-hero" />

          {/* Soft mouse-follow purple light (parallax) */}
          <div
            className="absolute inset-0 transition-[background] duration-500"
            style={{
              background: `radial-gradient(600px circle at ${mouse.x * 100}% ${mouse.y * 100}%, rgba(108,43,217,0.22), transparent 60%)`,
            }}
          />

          {/* Top-left purple lighting */}
          <div
            className="absolute -top-32 -left-32 h-[520px] w-[520px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(108,43,217,0.35), transparent 60%)", filter: "blur(60px)" }}
          />
          {/* Bottom-right pink lighting */}
          <div
            className="absolute -bottom-40 -right-32 h-[560px] w-[560px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(225,29,116,0.28), transparent 60%)", filter: "blur(70px)" }}
          />

          {/* Cinematic airplane (parallax) */}
          <div
            className="pointer-events-none absolute inset-0 transition-transform duration-700 ease-out"
            style={{
              transform: `translate3d(${(mouse.x - 0.5) * -18}px, ${(mouse.y - 0.5) * -10}px, 0)`,
            }}
          >
            <AirplaneAnimation />
          </div>

          {/* Edge vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "radial-gradient(ellipse at center, transparent 55%, rgba(11,11,15,0.7) 100%)" }}
          />

          <div className="container relative mx-auto px-4 py-20 md:py-32">
            <div className="max-w-5xl animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#F5C451]" />
                Trusted English coaching since day one
              </div>

              <div className="mt-7 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.02] tracking-tight text-white">
                  Speak fluently.
                  <br />
                  Score{" "}
                  <span
                    className="bg-clip-text text-transparent"
                    style={{ backgroundImage: "linear-gradient(135deg, #E11D74 0%, #6C2BD9 100%)" }}
                  >
                    globally
                  </span>
                  .
                </h1>

                {/* Contact chips: location + copyable phone numbers */}
                <div className="flex flex-col items-start md:items-end gap-2 shrink-0">
                  <a
                    href="https://maps.app.goo.gl/3bt7YHVy6F8CbFYTA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
                  >
                    <MapPin className="h-3.5 w-3.5 text-[#E11D74]" />
                    Visit us
                  </a>
                  {["+91 87542 45615", "+91 90805 28278"].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(num);
                        toast.success(`Copied ${num}`);
                      }}
                      className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-white/85 backdrop-blur-md transition-all hover:bg-white/10 hover:border-white/20"
                      aria-label={`Copy phone number ${num}`}
                    >
                      <Phone className="h-3.5 w-3.5 text-[#F5C451]" />
                      {num}
                      <Copy className="h-3 w-3 opacity-50 transition-opacity group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>

              <p className="mt-7 max-w-2xl text-lg text-white/75 leading-relaxed">
                D Square English Hub prepares you for IELTS, English communication, and modern AI &
                digital skills with structured tests and personal mentorship.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {user ? (
                  <Link to={isAdmin ? "/admin" : "/dashboard"}>
                    <Button
                      size="lg"
                      className="group rounded-xl bg-[#E11D74] text-white hover:bg-[#BE185D] transition-all duration-300 hover:scale-[1.03]"
                      style={{ boxShadow: "0 0 25px rgba(225, 29, 116, 0.25)" }}
                    >
                      Open {isAdmin ? "admin" : "dashboard"}{" "}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" search={{ mode: "signup" }}>
                      <Button
                        size="lg"
                        className="group rounded-xl bg-[#E11D74] text-white hover:bg-[#BE185D] transition-all duration-300 hover:scale-[1.03]"
                        style={{ boxShadow: "0 0 25px rgba(225, 29, 116, 0.25)" }}
                      >
                        Enroll now{" "}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        className="rounded-xl border-white/10 bg-white/5 text-white backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all"
                      >
                        Member sign in
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Trust marker chips */}
              <div className="mt-10 flex flex-wrap gap-2">
                {["TEFL Certified", "IELTS · 9 Bands", "AI · Digital Marketing", "Live Mentorship"].map((c, i) => (
                  <span
                    key={c}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75 backdrop-blur-md"
                    style={{ animation: `fade-in 0.6s ease-out ${i * 0.1}s both` }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Photo Showcase */}
        <section className="container mx-auto px-4 pt-14">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-black shadow-elegant aspect-square md:aspect-[16/10] group">
            {galleryImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`D Square English Hub students ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-contain transition-all duration-1000 ease-out ${
                  i === activeSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
              />
            ))}
            {/* Vignette */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            {/* Caption */}
            <div className="absolute left-6 bottom-6 right-24 text-white">
              <div className="text-xs uppercase tracking-widest text-white">Our students</div>
              <div className="font-display text-2xl md:text-3xl font-bold drop-shadow text-white">
                Real classrooms. Real progress.
              </div>
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide ? "w-8 bg-gold" : "w-2 bg-primary-foreground/60"
                  }`}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { value: "15+", label: "Years of Experience & TEFL Certified" },
              { value: "10,000+", label: "Students Trained" },
              { value: "100+", label: "Targeted Band in IELTS" },
            ].map((stat, i) => (
              <CountCard key={i} value={stat.value} label={stat.label} delay={i * 100} />
            ))}
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <div className="mb-10 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-border glass px-3 py-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 text-gold" /> Programs that move the needle
            </div>
            <h2 className="mt-4 font-display text-3xl md:text-5xl font-bold">
              Built for <span className="text-gradient-neon">ambitious</span> learners
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: GraduationCap, title: "IELTS Mastery", desc: "Band-by-band coaching with weekly mock tests and detailed feedback.", color: "from-neon to-primary", upcoming: false },
              { icon: BookOpen, title: "Spoken English", desc: "Conversational fluency, grammar precision, and confidence on demand.", color: "from-primary to-magenta", upcoming: false },
              { icon: Cpu, title: "AI App Development", desc: "Build with modern AI tools — from idea to a working product.", color: "from-magenta to-gold", upcoming: true },
              { icon: Megaphone, title: "Digital Marketing", desc: "Grow brands online with content, ads, SEO and analytics.", color: "from-gold to-neon", upcoming: true },
            ].map((f, i) => (
              <div
                key={i}
                className="group relative overflow-hidden rounded-2xl border border-border glass p-7 shadow-card transition-all duration-500 hover:shadow-neon hover:-translate-y-2 hover:border-neon/50"
                style={{ animation: `slide-up 0.7s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s both` }}
              >
                {f.upcoming && (
                  <span className="absolute right-3 top-3 z-10 rounded-full border border-gold/50 bg-gold/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-gold backdrop-blur">
                    Upcoming
                  </span>
                )}
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-magenta/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} shadow-glow transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                  <f.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <h3 className="relative mt-5 font-display text-xl font-semibold">{f.title}</h3>
                <p className="relative mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                <div className="relative mt-4 h-px w-full bg-gradient-to-r from-transparent via-neon to-transparent scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-700" />
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl bg-hero p-10 md:p-14 shadow-elegant relative overflow-hidden border border-neon/20">
            <div className="absolute inset-0 bg-aurora opacity-20 animate-spin-slow" />
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-neon/30 blur-3xl animate-glow-pulse" />
            <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-magenta/30 blur-3xl animate-float" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                  Ready to <span className="text-gradient-neon">begin?</span>
                </h2>
                <p className="mt-2 text-primary-foreground/85 max-w-md">
                  Join D Square and get a learning plan crafted for your goals — IELTS, career English, or AI &
                  Digital Marketing.
                </p>
              </div>
              {!user && (
                <Link to="/login" search={{ mode: "signup" }}>
                  <Button
                    size="lg"
                    className="group rounded-xl bg-[#E11D74] text-white hover:bg-[#BE185D] transition-all duration-300 hover:scale-[1.03]"
                    style={{ boxShadow: "0 0 25px rgba(225, 29, 116, 0.25)" }}
                  >
                    Create your account{" "}
                    <Users className="ml-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} D Square English Hub · Crafted for fluent futures
      </footer>
    </div>
  );
}

function CountCard({ value, label, delay }: { value: string; label: string; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setVisible(true),
      { threshold: 0.3 }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`group relative overflow-hidden rounded-2xl border border-border glass p-8 shadow-card transition-all duration-700 hover:shadow-neon hover:-translate-y-2 hover:border-neon/50 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-neon to-transparent" />
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-neon/15 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative font-display text-4xl md:text-5xl font-bold text-gradient-neon">
        {value}
      </div>
      <p className="relative mt-2 text-muted-foreground text-sm">{label}</p>
    </div>
  );
}
