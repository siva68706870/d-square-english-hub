import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { PaymentQR } from "@/components/PaymentQR";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle2, Clock, BookOpen, GraduationCap, IndianRupee, ScanLine, Trophy } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useRealtimeInvalidate } from "@/hooks/useRealtimeInvalidate";
import { useQuery } from "@tanstack/react-query";
import upiQr from "@/assets/upi-qr.png";

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

  // Live updates: refresh stats automatically when admin enters attendance/marks/payments
  useRealtimeInvalidate([
    { table: "attendance", queryKeys: [["student-stats", user?.id]] },
    { table: "test_marks", queryKeys: [["student-stats", user?.id]] },
    { table: "monthly_payments", queryKeys: [["student-stats", user?.id]] },
    { table: "profiles", queryKeys: [["student-stats", user?.id]] },
    { table: "mock_test_attempts", queryKeys: [["student-stats", user?.id]] },
  ]);

  const { data: stats } = useQuery({
    queryKey: ["student-stats", user?.id],
    enabled: !!user?.id && profile?.status === "approved",
    queryFn: async () => {
      const [att, marks, payRes, mockRes] = await Promise.all([
        supabase.from("attendance").select("status").eq("student_id", user!.id),
        supabase.from("test_marks").select("score, max_score, test_name, test_date").eq("student_id", user!.id).order("test_date", { ascending: false }),
        supabase.from("monthly_payments").select("amount, status").eq("student_id", user!.id),
        supabase.from("mock_test_attempts").select("band_score, test_number").eq("student_id", user!.id),
      ]);
      const total = att.data?.length ?? 0;
      const present = att.data?.filter((a) => a.status === "present").length ?? 0;
      const attendancePct = total ? Math.round((present / total) * 100) : 0;
      const avgPct = marks.data?.length
        ? Math.round((marks.data.reduce((s, m) => s + (Number(m.score) / Number(m.max_score)) * 100, 0) / marks.data.length))
        : 0;
      const totalPaid = (payRes.data ?? []).filter((p) => p.status === "paid").reduce((s, p) => s + Number(p.amount || 0), 0);
      const mockAttended = mockRes.data?.length ?? 0;
      const bestBand = mockRes.data?.length
        ? Math.max(...mockRes.data.map((m) => Number(m.band_score)))
        : 0;
      return { attendancePct, avgPct, total, present, marks: marks.data ?? [], totalPaid, mockAttended, bestBand };
    },
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  // Graceful fallback if the profile row hasn't synced yet
  const safeProfile = profile ?? {
    full_name: user?.email?.split("@")[0] ?? "Student",
    course: null as null | string,
    status: "pending" as const,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-10 max-w-5xl animate-fade-in">
        <div className="mb-8">
          <h1 className="font-display text-4xl font-bold">Hi, {safeProfile.full_name.split(" ")[0]} 👋</h1>
          <p className="text-muted-foreground mt-1">{safeProfile.course ?? "No course selected"}</p>
        </div>

        {safeProfile.status === "pending" && (
          <Card className="border-warning/40 bg-warning/5 mb-8 animate-scale-in">
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
              <div className="flex justify-center">
                <PaymentQR
                  imageSrc={upiQr}
                  size={220}
                  caption="Scan with any UPI app to pay. Show payment screenshot to admin to get approved."
                />
              </div>
            </CardContent>
          </Card>
        )}

        {safeProfile.status === "rejected" && (
          <Card className="border-destructive/40 bg-destructive/5 mb-8">
            <CardHeader><CardTitle>Account not approved</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Please contact the admin for next steps.</p>
            </CardContent>
          </Card>
        )}

        {safeProfile.status === "approved" && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard label="Attendance" value={`${stats?.attendancePct ?? 0}%`} sub={`${stats?.present ?? 0}/${stats?.total ?? 0} sessions`} icon={CheckCircle2} />
              <StatCard label="Average Score" value={`${stats?.avgPct ?? 0}%`} sub={`${stats?.marks.length ?? 0} tests`} icon={GraduationCap} />
              <StatCard label="Course" value={safeProfile.course ?? "—"} sub="Enrolled" icon={BookOpen} />
              <StatCard
                label="Fee Remaining"
                value={`₹${Math.max(Number((profile as any)?.total_amount ?? 0) - (stats?.totalPaid ?? 0), 0).toLocaleString()}`}
                sub={`Paid ₹${(stats?.totalPaid ?? 0).toLocaleString()} of ₹${Number((profile as any)?.total_amount ?? 0).toLocaleString()}`}
                icon={IndianRupee}
              />
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
    <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
            <div className="font-display text-3xl font-bold mt-1">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{sub}</div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-hero flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
            <Icon className="h-5 w-5 text-gold" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
