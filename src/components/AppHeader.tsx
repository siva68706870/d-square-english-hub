import { Link, useRouter } from "@tanstack/react-router";
import { GraduationCap, LogOut } from "lucide-react";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";

export function AppHeader() {
  const { user, isAdmin, profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.navigate({ to: "/login" });
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050507]/70 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div
            className="relative flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
            style={{
              background: "linear-gradient(135deg, #6C2BD9 0%, #E11D74 100%)",
              boxShadow: "0 0 20px rgba(225, 29, 116, 0.25)",
            }}
          >
            <GraduationCap className="relative h-5 w-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight text-white">
              D <span className="text-gradient-neon">Square</span> English Hub
            </div>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link to="/admin">
                <Button variant="ghost" size="sm" className="neon-link">Admin</Button>
              </Link>
            ) : (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="neon-link">Dashboard</Button>
                </Link>
                <Link to="/mocktest">
                  <Button variant="ghost" size="sm" className="neon-link">Channel</Button>
                </Link>
              </>
            )}
            <div className="hidden md:block text-right text-xs leading-tight">
              <div className="font-medium">{profile?.full_name ?? "Member"}</div>
              <div className="text-muted-foreground">{isAdmin ? "Admin" : profile?.course ?? "Student"}</div>
            </div>
            <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign out" className="border-border/60 hover:border-magenta hover:text-magenta hover:shadow-glow transition-all">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm" className="neon-link">Sign in</Button></Link>
            <Link to="/login" search={{ mode: "signup" }}>
              <Button
                size="sm"
                className="rounded-lg bg-[#E11D74] text-white hover:bg-[#BE185D] transition-all hover:scale-[1.03]"
                style={{ boxShadow: "0 0 20px rgba(225, 29, 116, 0.25)" }}
              >
                Admission
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
