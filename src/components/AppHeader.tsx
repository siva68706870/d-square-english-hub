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
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero shadow-card">
            <GraduationCap className="h-5 w-5 text-gold" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-lg font-bold tracking-tight">
              D<sup className="text-gold">2</sup> English Hub
            </div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              IELTS · Communication
            </div>
          </div>
        </Link>

        {user ? (
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link to="/admin">
                <Button variant="ghost" size="sm">Admin</Button>
              </Link>
            ) : (
              <Link to="/dashboard">
                <Button variant="ghost" size="sm">Dashboard</Button>
              </Link>
            )}
            <Link to="/mocktest">
              <Button variant="ghost" size="sm">Mock Test</Button>
            </Link>
            <div className="hidden md:block text-right text-xs leading-tight">
              <div className="font-medium">{profile?.full_name ?? "Member"}</div>
              <div className="text-muted-foreground">{isAdmin ? "Admin" : profile?.course ?? "Student"}</div>
            </div>
            <Button variant="outline" size="icon" onClick={handleSignOut} aria-label="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login"><Button variant="ghost" size="sm">Sign in</Button></Link>
            <Link to="/login" search={{ mode: "signup" }}>
              <Button size="sm" className="bg-hero text-primary-foreground hover:opacity-90">
                Join now
              </Button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
