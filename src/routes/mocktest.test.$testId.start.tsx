import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo } from "react";
import { AppHeader } from "@/components/AppHeader";
import { useAuth } from "@/auth/AuthProvider";
import { getTestById } from "@/data/ieltsTests";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Clock, FileText, BookOpen, ArrowLeft, ArrowRight, MonitorSmartphone, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/mocktest/test/$testId/start")({
  component: MockTestStartPage,
});

function MockTestStartPage() {
  const { testId } = Route.useParams();
  const router = useRouter();
  const { user, profile, loading } = useAuth();
  const test = useMemo(() => getTestById(Number(testId)), [testId]);

  useEffect(() => {
    if (!loading && !user) router.navigate({ to: "/login" });
  }, [loading, user, router]);

  const hasAccess = profile?.status === "approved" && profile?.course === "IELTS";
  const totalQuestions = test?.sections.flatMap((section) => section.questions).length ?? 40;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!test) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto max-w-3xl px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Test not found</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to="/mocktest">Back to mock tests</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto max-w-3xl px-4 py-16">
          <Card>
            <CardHeader>
              <CardTitle>Access restricted</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                This reading test is available only to approved IELTS students.
              </p>
              <Button asChild variant="outline">
                <Link to="/mocktest">Back to mock tests</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto max-w-5xl px-4 py-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="font-mono">Test {test.id}</Badge>
          <Badge variant="secondary" className="font-mono">
            <Clock className="h-3 w-3" /> {test.durationMinutes} minutes
          </Badge>
          <Badge variant="secondary" className="font-mono">
            <FileText className="h-3 w-3" /> {totalQuestions} questions
          </Badge>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <div>
              <h1 className="font-display text-3xl md:text-5xl font-bold">{test.title}</h1>
              <p className="mt-3 max-w-2xl text-muted-foreground">
                This is a full IELTS Academic Reading mock test with {totalQuestions} questions and a strict {test.durationMinutes}-minute timer.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>IELTS reading rules</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <Clock className="h-4 w-4 text-gold" /> Fixed timer
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You have one continuous {test.durationMinutes}-minute session for all 3 passages and {totalQuestions} questions.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <BookOpen className="h-4 w-4 text-neon" /> Reading format
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    The test follows IELTS CBT style with passage reading, question navigation, and automatic scoring after submission.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <MonitorSmartphone className="h-4 w-4 text-gold" /> Device layout
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    On laptop and PC, passage stays on the left and questions stay on the right. On mobile, use left and right buttons to switch views.
                  </p>
                </div>
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-neon" /> Submit carefully
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Your score, band score, time spent, and attempts are saved after you submit or when the timer ends.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <Card className="lg:sticky lg:top-24 lg:self-start">
            <CardHeader>
              <CardTitle>Ready to begin?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 3 reading passages</p>
                <p>• {totalQuestions} total questions</p>
                <p>• Timer starts immediately</p>
                <p>• Answers are checked automatically</p>
              </div>
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline">
                  <Link to="/mocktest">
                    <ArrowLeft className="h-4 w-4" /> Back to tests
                  </Link>
                </Button>
                <Button asChild className="bg-neon-gradient text-primary-foreground">
                  <Link to="/mocktest/test/$testId" params={{ testId }}>
                    Start test <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}