import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/auth/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, Legend,
} from "recharts";
import { Loader2, Pencil, Trash2, CheckCircle2, XCircle, ClockIcon, TrendingUp, Users, BookOpen } from "lucide-react";

type Profile = {
  id: string; user_id: string; full_name: string; email: string;
  course: "IELTS" | "English Communication" | null; mobile_number: string | null;
  parent_name: string | null; status: "pending" | "approved" | "rejected"; created_at: string;
};
type Attendance = { id: string; student_id: string; date: string; status: "present" | "absent" | "late" };
type Mark = { id: string; student_id: string; test_name: string; test_date: string; score: number; max_score: number; test_id: string | null };
type Test = { id: string; title: string; course: "IELTS" | "English Communication" | null; max_score: number; test_date: string };

export const Route = createFileRoute("/admin")({
  component: AdminPage,
});

function AdminPage() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) router.navigate({ to: "/" });
  }, [loading, user, isAdmin, router]);

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <AppHeader />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <h1 className="font-display text-4xl font-bold">Admin Console</h1>
          <p className="text-muted-foreground mt-1">Manage students, attendance, marks and analytics</p>
        </div>

        <Tabs defaultValue="students">
          <TabsList className="mb-6">
            <TabsTrigger value="students"><Users className="h-4 w-4 mr-2" />Students</TabsTrigger>
            <TabsTrigger value="attendance"><CheckCircle2 className="h-4 w-4 mr-2" />Attendance</TabsTrigger>
            <TabsTrigger value="marks"><BookOpen className="h-4 w-4 mr-2" />Test Marks</TabsTrigger>
            <TabsTrigger value="agency"><TrendingUp className="h-4 w-4 mr-2" />Agency Ready</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="students"><StudentsTab /></TabsContent>
          <TabsContent value="attendance"><AttendanceTab /></TabsContent>
          <TabsContent value="marks"><MarksTab /></TabsContent>
          <TabsContent value="agency"><AgencyTab /></TabsContent>
          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ---------- Hooks ----------
function useStudents() {
  return useQuery({
    queryKey: ["students"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      // Filter out admin profiles (those with admin role) — keep students only
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const adminIds = new Set((roles ?? []).filter((r) => r.role === "admin").map((r) => r.user_id));
      return (data ?? []).filter((p) => !adminIds.has(p.user_id)) as Profile[];
    },
  });
}

function useAttendance() {
  return useQuery({
    queryKey: ["attendance"],
    queryFn: async (): Promise<Attendance[]> => {
      const { data, error } = await supabase.from("attendance").select("*").order("date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Attendance[];
    },
  });
}

function useMarks() {
  return useQuery({
    queryKey: ["marks"],
    queryFn: async (): Promise<Mark[]> => {
      const { data, error } = await supabase.from("test_marks").select("*").order("test_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Mark[];
    },
  });
}

function useTests() {
  return useQuery({
    queryKey: ["tests"],
    queryFn: async (): Promise<Test[]> => {
      const { data, error } = await supabase.from("tests").select("*").order("test_date", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Test[];
    },
  });
}

// ---------- Students Tab ----------
function StudentsTab() {
  const qc = useQueryClient();
  const { data: students, isLoading } = useStudents();
  const [editing, setEditing] = useState<Profile | null>(null);

  const updateStatus = async (id: string, status: Profile["status"]) => {
    const { error } = await supabase.from("profiles").update({ status }).eq("id", id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${status}`);
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  const deleteStudent = async (s: Profile) => {
    // Delete profile row (auth user removal needs admin API; we delete the row)
    const { error } = await supabase.from("profiles").delete().eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Student record removed");
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  const saveEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const update = {
      full_name: String(fd.get("full_name") ?? ""),
      mobile_number: String(fd.get("mobile_number") ?? ""),
      parent_name: String(fd.get("parent_name") ?? ""),
      course: fd.get("course") as Profile["course"],
    };
    const { error } = await supabase.from("profiles").update(update).eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Members</CardTitle>
        <CardDescription>{students?.length ?? 0} registered students</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.full_name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </TableCell>
                    <TableCell>{s.course ?? "—"}</TableCell>
                    <TableCell>{s.mobile_number ?? "—"}</TableCell>
                    <TableCell>{s.parent_name ?? "—"}</TableCell>
                    <TableCell><StatusBadge status={s.status} /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {s.status !== "approved" && (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(s.id, "approved")} title="Approve">
                            <CheckCircle2 className="h-4 w-4 text-success" />
                          </Button>
                        )}
                        {s.status !== "rejected" && (
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(s.id, "rejected")} title="Reject">
                            <XCircle className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" onClick={() => setEditing(s)} title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" title="Delete">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete {s.full_name}?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Removes the profile, attendance, and test marks. This cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteStudent(s)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!students?.length && (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No students yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit student</DialogTitle></DialogHeader>
          {editing && (
            <form onSubmit={saveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="ef-name">Full name</Label>
                <Input id="ef-name" name="full_name" defaultValue={editing.full_name} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ef-course">Course</Label>
                <Select name="course" defaultValue={editing.course ?? undefined}>
                  <SelectTrigger id="ef-course"><SelectValue placeholder="Course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="English Communication">English Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ef-mob">Mobile</Label>
                  <Input id="ef-mob" name="mobile_number" defaultValue={editing.mobile_number ?? ""} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ef-parent">Parent's name</Label>
                  <Input id="ef-parent" name="parent_name" defaultValue={editing.parent_name ?? ""} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function StatusBadge({ status }: { status: Profile["status"] }) {
  if (status === "approved") return <Badge className="bg-success text-success-foreground"><CheckCircle2 className="h-3 w-3 mr-1" />Approved</Badge>;
  if (status === "rejected") return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
  return <Badge variant="secondary"><ClockIcon className="h-3 w-3 mr-1" />Pending</Badge>;
}

// ---------- Attendance Tab ----------
function AttendanceTab() {
  const qc = useQueryClient();
  const { data: students } = useStudents();
  const { data: attendance } = useAttendance();
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const approved = students?.filter((s) => s.status === "approved") ?? [];

  const setStatus = async (studentId: string, status: Attendance["status"]) => {
    const { error } = await supabase
      .from("attendance")
      .upsert({ student_id: studentId, date, status }, { onConflict: "student_id,date" });
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["attendance"] });
  };

  const todayMap = new Map(
    (attendance ?? []).filter((a) => a.date === date).map((a) => [a.student_id, a.status]),
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Mark attendance</CardTitle>
            <CardDescription>Pick a date and tap status for each student.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Label htmlFor="att-date">Date</Label>
            <Input id="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {approved.length === 0 ? (
          <p className="text-sm text-muted-foreground">No approved students yet.</p>
        ) : (
          <div className="space-y-2">
            {approved.map((s) => {
              const cur = todayMap.get(s.user_id);
              return (
                <div key={s.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">{s.full_name}</div>
                    <div className="text-xs text-muted-foreground">{s.course}</div>
                  </div>
                  <div className="flex gap-1.5">
                    {(["present", "late", "absent"] as const).map((st) => (
                      <Button
                        key={st}
                        size="sm"
                        variant={cur === st ? "default" : "outline"}
                        onClick={() => setStatus(s.user_id, st)}
                        className={cur === st && st === "present" ? "bg-success text-success-foreground hover:bg-success/90" :
                                   cur === st && st === "late" ? "bg-warning text-warning-foreground hover:bg-warning/90" :
                                   cur === st && st === "absent" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
                      >
                        {st[0].toUpperCase() + st.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ---------- Marks Tab ----------
function MarksTab() {
  const qc = useQueryClient();
  const { data: students } = useStudents();
  const { data: marks } = useMarks();
  const approved = students?.filter((s) => s.status === "approved") ?? [];

  const addMark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      student_id: String(fd.get("student_id")),
      test_name: String(fd.get("test_name")).trim(),
      score: Number(fd.get("score")),
      max_score: Number(fd.get("max_score") || 100),
      test_date: String(fd.get("test_date") || new Date().toISOString().slice(0, 10)),
    };
    if (!payload.student_id || !payload.test_name || isNaN(payload.score)) {
      return toast.error("Fill all required fields");
    }
    const { error } = await supabase.from("test_marks").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Mark added");
    (e.currentTarget as HTMLFormElement).reset();
    qc.invalidateQueries({ queryKey: ["marks"] });
  };

  const deleteMark = async (id: string) => {
    const { error } = await supabase.from("test_marks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["marks"] });
  };

  const nameOf = (uid: string) => approved.find((s) => s.user_id === uid)?.full_name ?? "Unknown";

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader><CardTitle>Add test mark</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={addMark} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="m-student">Student</Label>
              <Select name="student_id" required>
                <SelectTrigger id="m-student"><SelectValue placeholder="Choose student" /></SelectTrigger>
                <SelectContent>
                  {approved.map((s) => <SelectItem key={s.user_id} value={s.user_id}>{s.full_name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="m-test">Test name</Label>
              <Input id="m-test" name="test_name" placeholder="e.g. IELTS Reading Mock 4" required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="m-score">Score</Label>
                <Input id="m-score" name="score" type="number" step="0.5" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-max">Out of</Label>
                <Input id="m-max" name="max_score" type="number" step="0.5" defaultValue={100} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="m-date">Date</Label>
                <Input id="m-date" name="test_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
              </div>
            </div>
            <Button type="submit" className="w-full bg-hero text-primary-foreground hover:opacity-90">Add mark</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent marks</CardTitle></CardHeader>
        <CardContent>
          <div className="max-h-[480px] overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Test</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(marks ?? []).slice(0, 50).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{nameOf(m.student_id)}</TableCell>
                    <TableCell>
                      <div>{m.test_name}</div>
                      <div className="text-xs text-muted-foreground">{m.test_date}</div>
                    </TableCell>
                    <TableCell className="font-mono">{m.score}/{m.max_score}</TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost" onClick={() => deleteMark(m.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!marks?.length && (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-6">No marks yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ---------- Agency Tab ----------
function AgencyTab() {
  const { data: students } = useStudents();
  const { data: attendance } = useAttendance();
  const { data: marks } = useMarks();

  const rows = (students ?? [])
    .filter((s) => s.status === "approved")
    .map((s) => {
      const sAtt = (attendance ?? []).filter((a) => a.student_id === s.user_id);
      const sMarks = (marks ?? []).filter((m) => m.student_id === s.user_id);
      const total = sAtt.length;
      const present = sAtt.filter((a) => a.status === "present").length;
      const attPct = total ? Math.round((present / total) * 100) : 0;
      const avgPct = sMarks.length
        ? Math.round(sMarks.reduce((sum, m) => sum + (Number(m.score) / Number(m.max_score)) * 100, 0) / sMarks.length)
        : 0;
      const overall = Math.round(attPct * 0.4 + avgPct * 0.6);
      let tier: "Ready" | "Promising" | "Needs Work";
      if (overall >= 75 && sMarks.length >= 2) tier = "Ready";
      else if (overall >= 55) tier = "Promising";
      else tier = "Needs Work";
      return { ...s, attPct, avgPct, overall, tests: sMarks.length, tier };
    })
    .sort((a, b) => b.overall - a.overall);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agency-readiness ranking</CardTitle>
        <CardDescription>
          Based on overall performance (60%) + attendance (40%). Students need at least 2 recorded tests to be marked Ready.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rank</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Attendance</TableHead>
              <TableHead>Avg Score</TableHead>
              <TableHead>Overall</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-muted-foreground">#{i + 1}</TableCell>
                <TableCell>
                  <div className="font-medium">{r.full_name}</div>
                  <div className="text-xs text-muted-foreground">{r.tests} tests</div>
                </TableCell>
                <TableCell>{r.course}</TableCell>
                <TableCell>{r.attPct}%</TableCell>
                <TableCell>{r.avgPct}%</TableCell>
                <TableCell><span className="font-semibold">{r.overall}%</span></TableCell>
                <TableCell>
                  {r.tier === "Ready" && <Badge className="bg-success text-success-foreground">Ready</Badge>}
                  {r.tier === "Promising" && <Badge className="bg-gold text-gold-foreground">Promising</Badge>}
                  {r.tier === "Needs Work" && <Badge variant="secondary">Needs Work</Badge>}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-6">No approved students yet.</TableCell></TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

// ---------- Analytics Tab ----------
function AnalyticsTab() {
  const { data: students } = useStudents();
  const { data: attendance } = useAttendance();
  const { data: marks } = useMarks();
  const approved = students?.filter((s) => s.status === "approved") ?? [];
  const [studentId, setStudentId] = useState<string>("");

  // Overall: avg score per student
  const overallData = approved.map((s) => {
    const sMarks = (marks ?? []).filter((m) => m.student_id === s.user_id);
    const avg = sMarks.length
      ? Math.round(sMarks.reduce((sum, m) => sum + (Number(m.score) / Number(m.max_score)) * 100, 0) / sMarks.length)
      : 0;
    const sAtt = (attendance ?? []).filter((a) => a.student_id === s.user_id);
    const att = sAtt.length ? Math.round((sAtt.filter((a) => a.status === "present").length / sAtt.length) * 100) : 0;
    return { name: s.full_name.split(" ")[0], avg, att };
  });

  const personal = (marks ?? [])
    .filter((m) => m.student_id === studentId)
    .sort((a, b) => a.test_date.localeCompare(b.test_date))
    .map((m) => ({ name: m.test_name.slice(0, 16), pct: Math.round((Number(m.score) / Number(m.max_score)) * 100) }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Overall — All students</CardTitle>
          <CardDescription>Average test score vs attendance per student</CardDescription>
        </CardHeader>
        <CardContent className="h-[340px]">
          {overallData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={overallData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 95)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="avg" name="Avg Score %" fill="oklch(0.34 0.085 160)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="att" name="Attendance %" fill="oklch(0.78 0.13 75)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <EmptyState />}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Per-student progress</CardTitle>
              <CardDescription>Score percentage over time</CardDescription>
            </div>
            <Select value={studentId} onValueChange={setStudentId}>
              <SelectTrigger className="w-[240px]"><SelectValue placeholder="Choose student" /></SelectTrigger>
              <SelectContent>
                {approved.map((s) => <SelectItem key={s.user_id} value={s.user_id}>{s.full_name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="h-[340px]">
          {personal.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={personal}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 95)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="pct" stroke="oklch(0.34 0.085 160)" strokeWidth={3} dot={{ r: 5, fill: "oklch(0.78 0.13 75)" }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <EmptyState text={studentId ? "No marks for this student yet." : "Select a student to see their progress."} />}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyState({ text = "Not enough data yet." }: { text?: string }) {
  return <div className="h-full flex items-center justify-center text-sm text-muted-foreground">{text}</div>;
}
