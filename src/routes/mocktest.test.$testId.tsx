import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Clock, AlertCircle, ArrowLeft, ArrowRight, Send, Trophy } from "lucide-react";
import {
  getTestById,
  rawScoreToBand,
  isFillCorrect,
  isMatchCorrect,
  isTfngCorrect,
  type Question,
} from "@/data/ieltsTests";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/mocktest/test/$testId")({
  component: TestRunner,
});

function TestRunner() {
  const { testId } = Route.useParams();
  const router = useRouter();
  const { user, profile, loading } = useAuth();

  const test = useMemo(() => getTestById(Number(testId)), [testId]);

  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [secondsLeft, setSecondsLeft] = useState((test?.durationMinutes ?? 60) * 60);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    total: number;
    band: number;
    timeSpent: number;
  }>(null);
  const [activeSection, setActiveSection] = useState(0);
  const startedAtRef = useRef<number>(Date.now());

  // Auth gate: must be logged-in approved IELTS student
  useEffect(() => {
    if (loading) return;
    if (!user) router.navigate({ to: "/login" });
    else if (profile && (profile.status !== "approved" || profile.course !== "IELTS")) {
      toast.error("Mock tests are available to approved IELTS students only");
      router.navigate({ to: "/mocktest" });
    }
  }, [loading, user, profile, router]);

  // Countdown timer
  useEffect(() => {
    if (result || !test) return;
    const id = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(id);
          void handleSubmit(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, test]);

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
        <main className="flex-1 container mx-auto px-4 py-20 max-w-xl text-center">
          <AlertCircle className="h-10 w-10 text-destructive mx-auto" />
          <h1 className="font-display text-2xl font-bold mt-4">Test not found</h1>
          <Link to="/mocktest" className="inline-block mt-4">
            <Button variant="outline">Back to Mock Tests</Button>
          </Link>
        </main>
      </div>
    );
  }

  const allQuestions: Question[] = test.sections.flatMap((s) => s.questions);
  const answeredCount = allQuestions.filter((q) => (answers[q.number] ?? "").trim() !== "").length;
  const section = test.sections[activeSection];

  const fmt = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const ss = (s % 60).toString().padStart(2, "0");
    return `${m}:${ss}`;
  };

  const computeScore = () => {
    let correct = 0;
    for (const q of allQuestions) {
      const given = (answers[q.number] ?? "").trim();
      if (!given) continue;
      if (q.type === "tfng" && isTfngCorrect(given, q.answer)) correct++;
      else if (q.type === "fill" && isFillCorrect(given, q.answer)) correct++;
      else if (q.type === "match" && isMatchCorrect(given, q.answer)) correct++;
    }
    return correct;
  };

  async function handleSubmit(auto = false) {
    if (submitting || result) return;
    setSubmitting(true);
    const score = computeScore();
    const total = allQuestions.length;
    const band = rawScoreToBand(score);
    const timeSpent = Math.floor((Date.now() - startedAtRef.current) / 1000);

    if (user) {
      const { error } = await supabase.from("mock_test_attempts").insert({
        student_id: user.id,
        test_number: test!.id,
        test_title: test!.title,
        score,
        total_questions: total,
        band_score: band,
        time_spent_seconds: timeSpent,
        answers: answers as any,
        completed: true,
      });
      if (error) toast.error("Could not save result: " + error.message);
      else if (!auto) toast.success("Test submitted!");
    }

    setResult({ score, total, band, timeSpent });
    setSubmitting(false);
  }

  // RESULT VIEW
  if (result) {
    return (
      <div className="min-h-screen flex flex-col">
        <AppHeader />
        <main className="flex-1 container mx-auto px-4 py-12 max-w-3xl">
          <Card className="overflow-hidden">
            <div className="bg-hero p-8 text-center">
              <Trophy className="h-12 w-12 text-gold mx-auto" />
              <h1 className="font-display text-3xl md:text-4xl font-bold text-primary-foreground mt-3">
                Test Complete
              </h1>
              <p className="text-primary-foreground/80 mt-1">{test.title}</p>
            </div>
            <CardContent className="p-8 grid sm:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Score</div>
                <div className="font-display text-4xl font-bold mt-1">
                  {result.score}/{result.total}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Band</div>
                <div className="font-display text-4xl font-bold mt-1 text-gradient-neon">
                  {result.band.toFixed(1)}
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Time</div>
                <div className="font-display text-4xl font-bold mt-1">
                  {Math.floor(result.timeSpent / 60)}m
                </div>
              </div>
            </CardContent>
            <div className="border-t border-border p-6 flex flex-wrap gap-3 justify-center">
              <Link to="/mocktest">
                <Button variant="outline">Back to all tests</Button>
              </Link>
              <Link to="/dashboard">
                <Button className="bg-neon-gradient text-primary-foreground">Open dashboard</Button>
              </Link>
            </div>
          </Card>

          {/* Answer review */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Answer review</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="divide-y divide-border">
                {allQuestions.map((q) => {
                  const given = (answers[q.number] ?? "").trim();
                  const ok =
                    q.type === "tfng"
                      ? isTfngCorrect(given, q.answer)
                      : q.type === "fill"
                      ? isFillCorrect(given, q.answer)
                      : isMatchCorrect(given, q.answer);
                  return (
                    <li key={q.number} className="py-3 flex items-start gap-3">
                      <span className="font-mono text-xs w-8 text-muted-foreground">{q.number}.</span>
                      <div className="flex-1">
                        <div className="text-sm">{q.prompt}</div>
                        <div className="mt-1 text-xs">
                          <span className="text-muted-foreground">Your answer: </span>
                          <span className={ok ? "text-success" : "text-destructive"}>
                            {given || "—"}
                          </span>
                          {!ok && (
                            <>
                              <span className="text-muted-foreground"> · Correct: </span>
                              <span className="text-success">{q.answer}</span>
                            </>
                          )}
                        </div>
                      </div>
                      <Badge variant={ok ? "default" : "destructive"} className="font-mono">
                        {ok ? "✓" : "✗"}
                      </Badge>
                    </li>
                  );
                })}
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  // CBT RUNNER VIEW
  const lowTime = secondsLeft < 5 * 60;

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-6 max-w-6xl">
        {/* Header bar */}
        <div className="sticky top-0 z-10 -mx-4 px-4 py-3 backdrop-blur bg-background/80 border-b border-border flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[180px]">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">CBT Mode</div>
            <div className="font-display text-lg font-semibold leading-tight">{test.title}</div>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border font-mono text-sm ${
              lowTime ? "border-destructive text-destructive animate-pulse" : "border-border"
            }`}
          >
            <Clock className="h-4 w-4" />
            {fmt(secondsLeft)}
          </div>
          <Badge variant="secondary" className="font-mono">
            {answeredCount}/{allQuestions.length}
          </Badge>
          <Button
            size="sm"
            className="bg-neon-gradient text-primary-foreground"
            onClick={() => handleSubmit(false)}
            disabled={submitting}
          >
            <Send className="h-4 w-4" /> Submit
          </Button>
        </div>

        <Progress value={(answeredCount / allQuestions.length) * 100} className="mt-3 h-1.5" />

        {/* Section tabs */}
        <div className="mt-4 flex gap-2 flex-wrap">
          {test.sections.map((s, i) => (
            <button
              key={s.number}
              onClick={() => setActiveSection(i)}
              className={`px-3 py-1.5 rounded-md text-xs border transition-colors ${
                i === activeSection
                  ? "bg-neon-gradient text-primary-foreground border-transparent"
                  : "border-border hover:border-neon/50"
              }`}
            >
              Section {s.number} · Q{s.questions[0].number}-{s.questions[s.questions.length - 1].number}
            </button>
          ))}
        </div>

        {/* Two-pane layout */}
        <div className="grid lg:grid-cols-2 gap-6 mt-4">
          {/* Passage */}
          <Card className="lg:sticky lg:top-32 lg:self-start lg:max-h-[calc(100vh-10rem)] overflow-auto">
            <CardHeader>
              <CardTitle className="text-base">{section.passage.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none text-sm leading-relaxed whitespace-pre-wrap text-foreground/90">
                {section.passage.body}
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Questions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {section.questions.map((q) => (
                <QuestionInput
                  key={q.number}
                  q={q}
                  value={answers[q.number] ?? ""}
                  onChange={(v) => setAnswers((a) => ({ ...a, [q.number]: v }))}
                />
              ))}
              <div className="flex justify-between pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={activeSection === 0}
                  onClick={() => setActiveSection((s) => Math.max(0, s - 1))}
                >
                  <ArrowLeft className="h-4 w-4" /> Previous section
                </Button>
                {activeSection < test.sections.length - 1 ? (
                  <Button
                    size="sm"
                    onClick={() => setActiveSection((s) => Math.min(test.sections.length - 1, s + 1))}
                  >
                    Next section <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="bg-neon-gradient text-primary-foreground"
                    onClick={() => handleSubmit(false)}
                    disabled={submitting}
                  >
                    {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Submit Test
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

function QuestionInput({
  q,
  value,
  onChange,
}: {
  q: Question;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="rounded-lg border border-border p-4">
      <div className="flex gap-2 items-start">
        <span className="font-mono text-xs text-gold mt-0.5">{q.number}.</span>
        <div className="flex-1">
          <div className="text-sm">{q.prompt}</div>

          {q.type === "tfng" && (
            <RadioGroup value={value} onValueChange={onChange} className="mt-3 grid grid-cols-3 gap-2">
              {["TRUE", "FALSE", "NOT GIVEN"].map((opt) => (
                <Label
                  key={opt}
                  className={`flex items-center gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs transition-colors ${
                    value === opt ? "border-neon bg-neon/10 text-neon" : "border-border hover:border-neon/40"
                  }`}
                >
                  <RadioGroupItem value={opt} className="h-3.5 w-3.5" />
                  {opt}
                </Label>
              ))}
            </RadioGroup>
          )}

          {q.type === "fill" && (
            <Input
              className="mt-3"
              placeholder="Your answer (no more than two words)"
              value={value}
              onChange={(e) => onChange(e.target.value)}
            />
          )}

          {q.type === "match" && (
            <RadioGroup value={value} onValueChange={onChange} className="mt-3 grid gap-1.5">
              {q.options.map((o) => (
                <Label
                  key={o.key}
                  className={`flex items-start gap-2 rounded-md border px-3 py-2 cursor-pointer text-xs transition-colors ${
                    value === o.key ? "border-neon bg-neon/10" : "border-border hover:border-neon/40"
                  }`}
                >
                  <RadioGroupItem value={o.key} className="h-3.5 w-3.5 mt-0.5" />
                  <span>
                    <span className="font-mono text-gold">{o.key}.</span> {o.label}
                  </span>
                </Label>
              ))}
            </RadioGroup>
          )}
        </div>
      </div>
    </div>
  );
}
