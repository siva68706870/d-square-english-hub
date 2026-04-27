import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScanLine, Lock, Clock, Trophy, Loader2, FileText } from "lucide-react";
import { ieltsTests } from "@/data/ieltsTests";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/mocktest")({
  head: () => ({
    meta: [
      { title: "IELTS Mock Tests — D Square English Hub" },
      { name: "description", content: "10 timed IELTS Academic Reading mock tests in real CBT mode with auto band scoring." },
    ],
  }),
  component: MockTestPage,
});

function MockTestPage() {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/login" });
  }, [loading, user, router]);

  const isApprovedIelts =
    profile?.status === "approved" && profile?.course === "IELTS";

  const { data: attempts } = useQuery({
    queryKey: ["mock-attempts", user?.id],
    enabled: !!user?.id && isApprovedIelts,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("mock_test_attempts")
        .select("test_number, band_score, score, total_questions, created_at, time_spent_seconds")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  // Best band per test
  const bestPerTest = new Map<number, { band: number; score: number; total: number }>();
  for (const a of attempts ?? []) {
    const cur = bestPerTest.get(a.test_number);
    if (!cur || Number(a.band_score) > cur.band) {
      bestPerTest.set(a.test_number, {
        band: Number(a.band_score),
        score: a.score,
        total: a.total_questions,
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-12 max-w-5xl">
        <div className="text-center mb-10">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-hero mb-4 shadow-glow">
            <ScanLine className="h-7 w-7 text-gold" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold">IELTS Mock Tests</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Real CBT mode · 60-minute timer · Auto band score · 10 Academic Reading tests.
          </p>
        </div>

        {!isApprovedIelts ? (
          <Card className="max-w-xl mx-auto border-warning/40 bg-warning/5">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-warning-foreground" />
                <CardTitle>Access restricted</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Mock tests are available only to <strong>approved IELTS students</strong>.
              </p>
              {profile?.status !== "approved" && (
                <p className="text-sm text-muted-foreground">
                  Your account status is currently <Badge variant="secondary">{profile?.status ?? "unknown"}</Badge>.
                  Please complete payment and wait for admin approval.
                </p>
              )}
              {profile?.status === "approved" && profile.course !== "IELTS" && (
                <p className="text-sm text-muted-foreground">
                  Your enrolled course is <Badge variant="secondary">{profile.course}</Badge>.
                  Contact admin to add IELTS to your plan.
                </p>
              )}
              <Link to="/dashboard">
                <Button variant="outline" className="mt-2">Back to dashboard</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Stats */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <Card>
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Tests attended</div>
                  <div className="font-display text-3xl font-bold mt-1">{attempts?.length ?? 0}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Unique tests</div>
                  <div className="font-display text-3xl font-bold mt-1">{bestPerTest.size}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-5">
                  <div className="text-xs uppercase tracking-widest text-muted-foreground">Best band</div>
                  <div className="font-display text-3xl font-bold mt-1 text-gradient-neon">
                    {attempts?.length
                      ? Math.max(...attempts.map((a) => Number(a.band_score))).toFixed(1)
                      : "—"}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Test grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {ieltsTests.map((t) => {
                const best = bestPerTest.get(t.id);
                return (
                  <Card key={t.id} className="group hover:border-neon/50 hover:shadow-neon transition-all">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="font-mono">Test {t.id}</Badge>
                        {best && (
                          <Badge className="bg-neon-gradient text-primary-foreground font-mono">
                            <Trophy className="h-3 w-3" /> {best.band.toFixed(1)}
                          </Badge>
                        )}
                      </div>
                      <h3 className="font-display text-lg font-semibold leading-tight">{t.title}</h3>
                      <div className="mt-2 text-xs text-muted-foreground flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <FileText className="h-3 w-3" /> 40 questions
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-3 w-3" /> {t.durationMinutes} min
                        </span>
                      </div>
                      {best && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Best score: <span className="text-foreground font-medium">{best.score}/{best.total}</span>
                        </div>
                      )}
                      <Button asChild size="sm" className="mt-4 w-full bg-neon-gradient text-primary-foreground">
                        <Link to="/mocktest/test/$testId" params={{ testId: String(t.id) }}>
                          {best ? "Retake test" : "Start test"}
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* History */}
            {attempts && attempts.length > 0 && (
              <Card className="mt-10">
                <CardHeader>
                  <CardTitle>Recent attempts</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="divide-y divide-border">
                    {attempts.slice(0, 10).map((a, i) => (
                      <li key={i} className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-medium text-sm">Test {a.test_number}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(a.created_at).toLocaleString()} ·{" "}
                            {Math.floor(a.time_spent_seconds / 60)}m
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="font-mono">
                            {a.score}/{a.total_questions}
                          </Badge>
                          <Badge className="bg-neon-gradient text-primary-foreground font-mono">
                            Band {Number(a.band_score).toFixed(1)}
                          </Badge>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </main>
    </div>
  );
}
