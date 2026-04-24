import { createFileRoute, Link } from "@tanstack/react-router";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { GraduationCap, Trophy, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { useEffect, useState } from "react";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

const galleryImages = [gallery1, gallery2, gallery3, gallery4];

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const { user, isAdmin } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);

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
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-hero opacity-[0.97]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_oklch(0.78_0.13_75_/_0.25),_transparent_60%)]" />

          <div className="container relative mx-auto px-4 py-20 md:py-28">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-gold backdrop-blur">
                <Sparkles className="h-3.5 w-3.5" />
                Trusted English coaching since day one
              </div>

              <h1 className="mt-6 font-display text-5xl md:text-7xl font-bold leading-[1.05] text-primary-foreground">
                Speak fluently.
                <br />
                <span className="text-gold">Score globally.</span>
              </h1>

              <p className="mt-6 max-w-xl text-lg text-primary-foreground/80 leading-relaxed">
                D Square English Hub prepares you for IELTS and real-world English communication
                with structured tests, attendance tracking, and personal mentorship.
              </p>

              <div className="mt-10 flex flex-wrap gap-3">
                {user ? (
                  <Link to={isAdmin ? "/admin" : "/dashboard"}>
                    <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-elegant">
                      Open {isAdmin ? "admin" : "dashboard"} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/login" search={{ mode: "signup" }}>
                      <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90 shadow-elegant">
                        Enroll now <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/login">
                      <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                        Member sign in
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Photo Showcase */}
        <section className="container mx-auto px-4 pt-14">
          <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-border bg-card shadow-elegant aspect-square md:aspect-[16/10]">
            {galleryImages.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`D Square English Hub students ${i + 1}`}
                loading={i === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out ${
                  i === activeSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {galleryImages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === activeSlide ? "w-6 bg-gold" : "w-2 bg-primary-foreground/60"
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
              <div key={i} className="rounded-2xl border border-border bg-card p-8 shadow-card">
                <div className="font-display text-4xl md:text-5xl font-bold text-gold">{stat.value}</div>
                <p className="mt-2 text-muted-foreground text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-20">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { icon: GraduationCap, title: "IELTS Mastery", desc: "Band-by-band coaching with weekly mock tests and detailed feedback." },
              { icon: BookOpen, title: "English Communication", desc: "Conversational fluency, grammar precision, and confidence on demand." },
              { icon: Trophy, title: "Agency Ready", desc: "Performance tracking that gets you shortlisted for top global agencies." },
            ].map((f, i) => (
              <div key={i} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-7 shadow-card transition hover:shadow-elegant hover:-translate-y-1">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-hero">
                  <f.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-5 font-display text-2xl font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA strip */}
        <section className="container mx-auto px-4 pb-20">
          <div className="rounded-3xl bg-hero p-10 md:p-14 shadow-elegant relative overflow-hidden">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground">
                  Ready to begin?
                </h2>
                <p className="mt-2 text-primary-foreground/80 max-w-md">
                  Join D² and get a learning plan crafted for your goals — IELTS or career English.
                </p>
              </div>
              {!user && (
                <Link to="/login" search={{ mode: "signup" }}>
                  <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                    Create your account <Users className="ml-2 h-4 w-4" />
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
