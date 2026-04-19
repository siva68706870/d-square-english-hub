import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { PaymentQR } from "@/components/PaymentQR";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, BookOpen, GraduationCap } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const { user, profile, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/login" });
    if (!loading && isAdmin) router.navigate({ to: "/admin" });
  }, [loading, user, isAdmin, router]);

  const { data: stats } = useQuery({
    queryKey: ["student-stats", user?.id],
    enabled: !!user?.id && profile?.status === "approved",
    queryFn: async () => {
      const [att, marks] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", user!.id),
        supabase.from("test_marks").select("score, max_score, test_name, test_date").eq("student_id", user!.id).order("test_date", { ascending: false }),
      ]);
      const total = att.data?.length ?? 0;
      const present = att.data?.filter((a) => a.status === "present").length ?? 0;
      const attendancePct = total ? Math.round((present / total) * 100) : 0;
      const avgPct = marks.data?.length
        ? Math.round((marks.data.reduce((s, m) => s + (Number(m.score) / Number(m.max_score)) * 100, 0) / marks.data.length))
        : 0;
      return { attendancePct, avgPct, total, present, marks: marks.data ?? [] };
    },
  });

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold">Hi, {profile.full_name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">{profile.course ?? "No course selected"}</p>
        </div>

        {profile.status === "pending" && (
          <Card className="border-warning/40 bg-warning/5 mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-warning-foreground" />
                <CardTitle>Awaiting approval</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-sm text-muted-foreground">
                Your account has been created. Please complete payment using the QR below and an admin will approve you shortly.
                Course content will unlock after approval.
              </p>
              <div className="flex justify-center"><PaymentQR /></div>
            </CardContent>
          </Card>
        )}

        {profile.status === "rejected" && (
          <Card className="border-destructive/40 bg-destructive/5 mb-8">
            <CardHeader><CardTitle>Account not approved</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Please contact the admin for next steps.</p>
            </CardContent>
          </Card>
        )}

        {profile.status === "approved" && (
          <>
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <StatCard label="Attendance" value={`${stats?.attendancePct ?? 0}%`} sub={`${stats?.present ?? 0}/${stats?.total ?? 0} sessions`} icon={CheckCircle2} />
              <StatCard label="Average Score" value={`${stats?.avgPct ?? 0}%`} sub={`${stats?.marks.length ?? 0} tests`} icon={GraduationCap} />
              <StatCard label="Course" value={profile.course ?? "—"} sub="Enrolled" icon={BookOpen} />
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent test marks</CardTitle>
              </CardHeader>
              <CardContent>
                {stats?.marks.length ? (
                  <ul className="divide-y divide-border">
                    {stats.marks.slice(0, 6).map((m, i) => (
                      <li key={i} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium">{m.test_name}</div>
                          <div className="text-xs text-muted-foreground">{m.test_date}</div>
                        </div>
                        <Badge variant="secondary" className="font-mono">
                          {m.score}/{m.max_score}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No test marks recorded yet.</p>
                )}
              </CardContent>
            </Card>

            <div className="mt-6 text-center">
              <Link to="/mocktest">
                <Button variant="outline">Open Mock Test channel</Button>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, sub, icon: Icon }: { label: string; value: string; sub: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="font-display text-3xl font-bold mt-1">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-hero flex items-center justify-center">
            <Icon className="h-5 w-5 text-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
