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
import { Loader2, Pencil, Trash2, CheckCircle2, XCircle, ClockIcon, TrendingUp, Users, BookOpen, Wallet, Plus } from "lucide-react";

type Profile = {
  id: string; user_id: string; full_name: string; email: string;
  course: "IELTS" | "English Communication" | null; mobile_number: string | null;
  parent_name: string | null; status: "pending" | "approved" | "rejected"; created_at: string;
  payment_plan: "monthly" | "full" | null;
  payment_status: "paid" | "not_paid";
};
type Attendance = { id: string; student_id: string; date: string; status: "present" | "absent" | "late" };
type Mark = { id: string; student_id: string; test_name: string; test_date: string; score: number; max_score: number; test_id: string | null };
type Test = { id: string; title: string; course: "IELTS" | "English Communication" | null; max_score: number; test_date: string };
type MonthlyPayment = { id: string; student_id: string; month: string; amount: number; status: "paid" | "not_paid"; notes: string | null };

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
            <TabsTrigger value="commission"><Wallet className="h-4 w-4 mr-2" />Commission</TabsTrigger>
          </TabsList>

          <TabsContent value="students"><StudentsTab /></TabsContent>
          <TabsContent value="attendance"><AttendanceTab /></TabsContent>
          <TabsContent value="marks"><MarksTab /></TabsContent>
          <TabsContent value="agency"><AgencyTab /></TabsContent>
          <TabsContent value="analytics"><AnalyticsTab /></TabsContent>
          <TabsContent value="commission"><CommissionTab /></TabsContent>
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
  const [paymentsFor, setPaymentsFor] = useState<Profile | null>(null);
  const [courseFilter, setCourseFilter] = useState<"all" | "IELTS" | "English Communication">("all");

  const togglePaid = async (s: Profile) => {
    const next: Profile["payment_status"] = s.payment_status === "paid" ? "not_paid" : "paid";
    const { error } = await supabase.from("profiles").update({ payment_status: next }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success(`Marked ${next === "paid" ? "Paid" : "Not paid"}`);
    qc.invalidateQueries({ queryKey: ["students"] });
  };

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
      payment_plan: (fd.get("payment_plan") || null) as Profile["payment_plan"],
    };
    const { error } = await supabase.from("profiles").update(update).eq("id", editing.id);
    if (error) return toast.error(error.message);
    toast.success("Updated");
    setEditing(null);
    qc.invalidateQueries({ queryKey: ["students"] });
  };

  const filtered = (students ?? []).filter((s) => courseFilter === "all" || s.course === courseFilter);
  const ieltsCount = (students ?? []).filter((s) => s.course === "IELTS").length;
  const ecCount = (students ?? []).filter((s) => s.course === "English Communication").length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Members</CardTitle>
            <CardDescription>
              {students?.length ?? 0} total · {ieltsCount} IELTS · {ecCount} English Communication
            </CardDescription>
          </div>
          <Tabs value={courseFilter} onValueChange={(v) => setCourseFilter(v as typeof courseFilter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="IELTS">IELTS</TabsTrigger>
              <TabsTrigger value="English Communication">English Comm.</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
                  <TableHead>Plan</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-medium">{s.full_name}</div>
                      <div className="text-xs text-muted-foreground">{s.email}</div>
                    </TableCell>
                    <TableCell>
                      {s.course ? (
                        <Badge variant="outline" className={s.course === "IELTS" ? "border-primary/40 text-primary" : "border-gold/40 text-gold-foreground"}>
                          {s.course}
                        </Badge>
                      ) : "—"}
                    </TableCell>
                    <TableCell>
                      {s.payment_plan ? (
                        <Badge variant="outline" className="capitalize">{s.payment_plan}</Badge>
                      ) : <span className="text-muted-foreground">—</span>}
                    </TableCell>
                    <TableCell>
                      <button
                        type="button"
                        onClick={() => togglePaid(s)}
                        title="Click to toggle"
                        className="focus:outline-none"
                      >
                        {s.payment_status === "paid" ? (
                          <Badge className="bg-success text-success-foreground hover:opacity-90 cursor-pointer">
                            <CheckCircle2 className="h-3 w-3 mr-1" />Paid
                          </Badge>
                        ) : (
                          <Badge variant="destructive" className="hover:opacity-90 cursor-pointer">
                            <XCircle className="h-3 w-3 mr-1" />Not paid
                          </Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell>{s.mobile_number ?? "—"}</TableCell>
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
                        {s.payment_plan === "monthly" && (
                          <Button size="sm" variant="ghost" onClick={() => setPaymentsFor(s)} title="Monthly payments">
                            <Wallet className="h-4 w-4 text-primary" />
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
                {!filtered.length && (
                  <TableRow><TableCell colSpan={8} className="text-center text-muted-foreground py-8">No students in this course.</TableCell></TableRow>
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
              <div className="space-y-1.5">
                <Label htmlFor="ef-plan">Payment plan</Label>
                <Select name="payment_plan" defaultValue={editing.payment_plan ?? undefined}>
                  <SelectTrigger id="ef-plan"><SelectValue placeholder="Choose a plan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full">Full payment</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      <MonthlyPaymentsDialog student={paymentsFor} onClose={() => setPaymentsFor(null)} />
    </Card>
  );
}

// ---------- Monthly Payments Dialog ----------
function MonthlyPaymentsDialog({ student, onClose }: { student: Profile | null; onClose: () => void }) {
  const qc = useQueryClient();
  const open = !!student;
  const studentId = student?.user_id ?? "";

  const { data: payments, isLoading } = useQuery({
    queryKey: ["monthly_payments", studentId],
    enabled: open,
    queryFn: async (): Promise<MonthlyPayment[]> => {
      const { data, error } = await supabase
        .from("monthly_payments")
        .select("*")
        .eq("student_id", studentId)
        .order("month", { ascending: false });
      if (error) throw error;
      return (data ?? []) as MonthlyPayment[];
    },
  });

  const addPayment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!student) return;
    const fd = new FormData(e.currentTarget);
    const month = String(fd.get("month") ?? "").trim();
    const amount = Number(fd.get("amount") ?? 0);
    const status = (fd.get("status") || "not_paid") as MonthlyPayment["status"];
    const notes = String(fd.get("notes") ?? "").trim() || null;
    if (!month) return toast.error("Pick a month");
    const { error } = await supabase.from("monthly_payments").upsert(
      { student_id: student.user_id, month, amount, status, notes },
      { onConflict: "student_id,month" },
    );
    if (error) return toast.error(error.message);
    toast.success("Saved");
    (e.currentTarget as HTMLFormElement).reset();
    qc.invalidateQueries({ queryKey: ["monthly_payments", studentId] });
  };

  const togglePay = async (p: MonthlyPayment) => {
    const next: MonthlyPayment["status"] = p.status === "paid" ? "not_paid" : "paid";
    const { error } = await supabase.from("monthly_payments").update({ status: next }).eq("id", p.id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["monthly_payments", studentId] });
  };

  const removePay = async (p: MonthlyPayment) => {
    const { error } = await supabase.from("monthly_payments").delete().eq("id", p.id);
    if (error) return toast.error(error.message);
    toast.success("Removed");
    qc.invalidateQueries({ queryKey: ["monthly_payments", studentId] });
  };

  const totalPaid = (payments ?? []).filter((p) => p.status === "paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const totalDue = (payments ?? []).filter((p) => p.status === "not_paid").reduce((sum, p) => sum + Number(p.amount || 0), 0);

  const currentMonth = new Date().toISOString().slice(0, 7);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Monthly payments — {student?.full_name}</DialogTitle>
          <CardDescription>
            Track each month's installment. Total paid: ₹{totalPaid.toLocaleString()} · Due: ₹{totalDue.toLocaleString()}
          </CardDescription>
        </DialogHeader>

        <form onSubmit={addPayment} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end border border-border rounded-lg p-3 bg-muted/30">
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="mp-month" className="text-xs">Month</Label>
            <Input id="mp-month" name="month" type="month" defaultValue={currentMonth} required />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="mp-amount" className="text-xs">Amount (₹)</Label>
            <Input id="mp-amount" name="amount" type="number" min="0" step="1" defaultValue={0} required />
          </div>
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="mp-status" className="text-xs">Status</Label>
            <Select name="status" defaultValue="not_paid">
              <SelectTrigger id="mp-status"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="not_paid">Not paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1 sm:col-span-1">
            <Label htmlFor="mp-notes" className="text-xs">Notes</Label>
            <Input id="mp-notes" name="notes" placeholder="optional" />
          </div>
          <Button type="submit" className="sm:col-span-1">
            <Plus className="h-4 w-4 mr-1" /> Save
          </Button>
        </form>

        <div className="max-h-[40vh] overflow-y-auto border border-border rounded-lg">
          {isLoading ? (
            <div className="p-6 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payments ?? []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.month}</TableCell>
                    <TableCell>₹{Number(p.amount).toLocaleString()}</TableCell>
                    <TableCell>
                      <button type="button" onClick={() => togglePay(p)}>
                        {p.status === "paid" ? (
                          <Badge className="bg-success text-success-foreground cursor-pointer"><CheckCircle2 className="h-3 w-3 mr-1" />Paid</Badge>
                        ) : (
                          <Badge variant="destructive" className="cursor-pointer"><XCircle className="h-3 w-3 mr-1" />Not paid</Badge>
                        )}
                      </button>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">{p.notes ?? "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" variant="ghost" onClick={() => removePay(p)} title="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {!payments?.length && (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No monthly entries yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
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
  const [courseFilter, setCourseFilter] = useState<"all" | "IELTS" | "English Communication">("all");
  const approved = (students ?? []).filter((s) => s.status === "approved" && (courseFilter === "all" || s.course === courseFilter));

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
            <CardDescription>Pick a course and date, then tap status for each student.</CardDescription>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Tabs value={courseFilter} onValueChange={(v) => setCourseFilter(v as typeof courseFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="IELTS">IELTS</TabsTrigger>
                <TabsTrigger value="English Communication">English Comm.</TabsTrigger>
              </TabsList>
            </Tabs>
            <div className="flex items-center gap-2">
              <Label htmlFor="att-date">Date</Label>
              <Input id="att-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-auto" />
            </div>
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
  const { data: tests } = useTests();
  const approved = students?.filter((s) => s.status === "approved") ?? [];
  const [selectedTestId, setSelectedTestId] = useState<string>("");

  const selectedTest = tests?.find((t) => t.id === selectedTestId);

  const addTest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      title: String(fd.get("title") ?? "").trim(),
      course: (fd.get("course") as Test["course"]) || null,
      max_score: Number(fd.get("max_score") || 100),
      test_date: String(fd.get("test_date") || new Date().toISOString().slice(0, 10)),
    };
    if (!payload.title) return toast.error("Test title is required");
    const { error } = await supabase.from("tests").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Test created");
    (e.currentTarget as HTMLFormElement).reset();
    qc.invalidateQueries({ queryKey: ["tests"] });
  };

  const deleteTest = async (id: string) => {
    const { error } = await supabase.from("tests").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (selectedTestId === id) setSelectedTestId("");
    qc.invalidateQueries({ queryKey: ["tests"] });
    qc.invalidateQueries({ queryKey: ["marks"] });
  };

  const addMark = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedTest) return toast.error("Select a test first");
    const fd = new FormData(e.currentTarget);
    const payload = {
      student_id: String(fd.get("student_id")),
      test_id: selectedTest.id,
      test_name: selectedTest.title,
      score: Number(fd.get("score")),
      max_score: Number(selectedTest.max_score),
      test_date: selectedTest.test_date,
    };
    if (!payload.student_id || isNaN(payload.score)) return toast.error("Pick a student and enter a score");
    const { error } = await supabase.from("test_marks").upsert(payload, { onConflict: "student_id,test_id" } as never).select();
    // Fallback: if upsert constraint not present, just insert
    if (error) {
      const { error: e2 } = await supabase.from("test_marks").insert(payload);
      if (e2) return toast.error(e2.message);
    }
    toast.success("Mark saved");
    (e.currentTarget as HTMLFormElement).reset();
    qc.invalidateQueries({ queryKey: ["marks"] });
  };

  const deleteMark = async (id: string) => {
    const { error } = await supabase.from("test_marks").delete().eq("id", id);
    if (error) return toast.error(error.message);
    qc.invalidateQueries({ queryKey: ["marks"] });
  };

  const nameOf = (uid: string) => approved.find((s) => s.user_id === uid)?.full_name ?? "Unknown";
  const marksForSelected = (marks ?? []).filter((m) => m.test_id === selectedTestId);

  return (
    <div className="space-y-6">
      {/* Step 1: Create / pick a test */}
      <Card>
        <CardHeader>
          <CardTitle>Step 1 — Tests</CardTitle>
          <CardDescription>Create a test first, then enter marks for students against it.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={addTest} className="grid md:grid-cols-5 gap-3 mb-6">
            <div className="md:col-span-2 space-y-1.5">
              <Label htmlFor="t-title">Test title</Label>
              <Input id="t-title" name="title" placeholder="e.g. IELTS Reading Mock 4" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-course">Course</Label>
              <Select name="course">
                <SelectTrigger id="t-course"><SelectValue placeholder="Any" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="IELTS">IELTS</SelectItem>
                  <SelectItem value="English Communication">English Communication</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-max">Out of</Label>
              <Input id="t-max" name="max_score" type="number" step="0.5" defaultValue={100} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="t-date">Date</Label>
              <Input id="t-date" name="test_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} />
            </div>
            <div className="md:col-span-5">
              <Button type="submit" className="bg-hero text-primary-foreground hover:opacity-90">Create test</Button>
            </div>
          </form>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Out of</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(tests ?? []).map((t) => (
                <TableRow key={t.id} className={selectedTestId === t.id ? "bg-muted/50" : ""}>
                  <TableCell className="font-medium">{t.title}</TableCell>
                  <TableCell>{t.course ?? "—"}</TableCell>
                  <TableCell>{t.test_date}</TableCell>
                  <TableCell className="font-mono">{t.max_score}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button size="sm" variant={selectedTestId === t.id ? "default" : "outline"} onClick={() => setSelectedTestId(t.id)}>
                        {selectedTestId === t.id ? "Selected" : "Enter marks"}
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => deleteTest(t.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {!tests?.length && (
                <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No tests yet — create one above.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Step 2: Enter marks */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2 — Enter marks</CardTitle>
            <CardDescription>
              {selectedTest
                ? <>For test: <span className="font-semibold text-foreground">{selectedTest.title}</span> ({selectedTest.test_date}, out of {selectedTest.max_score})</>
                : "Pick a test from the table above to start entering marks."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={addMark} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="m-test-pick">Test</Label>
                <Select value={selectedTestId} onValueChange={setSelectedTestId}>
                  <SelectTrigger id="m-test-pick"><SelectValue placeholder="Choose test" /></SelectTrigger>
                  <SelectContent>
                    {(tests ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{t.title} — {t.test_date}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
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
                <Label htmlFor="m-score">Score {selectedTest ? `(out of ${selectedTest.max_score})` : ""}</Label>
                <Input id="m-score" name="score" type="number" step="0.5" required disabled={!selectedTest} />
              </div>
              <Button type="submit" disabled={!selectedTest} className="w-full bg-hero text-primary-foreground hover:opacity-90">Save mark</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{selectedTest ? `Marks for ${selectedTest.title}` : "Recent marks (all tests)"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-h-[480px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    {!selectedTest && <TableHead>Test</TableHead>}
                    <TableHead>Score</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(selectedTest ? marksForSelected : (marks ?? []).slice(0, 50)).map((m) => (
                    <TableRow key={m.id}>
                      <TableCell>{nameOf(m.student_id)}</TableCell>
                      {!selectedTest && (
                        <TableCell>
                          <div>{m.test_name}</div>
                          <div className="text-xs text-muted-foreground">{m.test_date}</div>
                        </TableCell>
                      )}
                      <TableCell className="font-mono">{m.score}/{m.max_score}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" onClick={() => deleteMark(m.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {(selectedTest ? marksForSelected : marks)?.length === 0 && (
                    <TableRow><TableCell colSpan={selectedTest ? 3 : 4} className="text-center text-muted-foreground py-6">No marks yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ---------- Agency Tab ----------
function AgencyTab() {
  const { data: students } = useStudents();
  const { data: attendance } = useAttendance();
  const { data: marks } = useMarks();
  const [courseFilter, setCourseFilter] = useState<"all" | "IELTS" | "English Communication">("all");

  const rows = (students ?? [])
    .filter((s) => s.status === "approved" && (courseFilter === "all" || s.course === courseFilter))
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
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <CardTitle>Agency-readiness ranking</CardTitle>
            <CardDescription>
              Based on overall performance (60%) + attendance (40%). Students need at least 2 recorded tests to be marked Ready.
            </CardDescription>
          </div>
          <Tabs value={courseFilter} onValueChange={(v) => setCourseFilter(v as typeof courseFilter)}>
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="IELTS">IELTS</TabsTrigger>
              <TabsTrigger value="English Communication">English Comm.</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
type CompareMetric = "attendance" | "marks";

function AnalyticsTab() {
  const { data: students } = useStudents();
  const { data: attendance } = useAttendance();
  const { data: marks } = useMarks();
  const { data: tests } = useTests();
  const [courseFilter, setCourseFilter] = useState<"all" | "IELTS" | "English Communication">("all");
  const approved = (students ?? []).filter((s) => s.status === "approved" && (courseFilter === "all" || s.course === courseFilter));
  const [studentId, setStudentId] = useState<string>("");
  const [metric, setMetric] = useState<CompareMetric>("marks");
  const [testId, setTestId] = useState<string>("all");

  // Compare students by chosen metric
  const compareData = approved.map((s) => {
    const sAtt = (attendance ?? []).filter((a) => a.student_id === s.user_id);
    const sMarksAll = (marks ?? []).filter((m) => m.student_id === s.user_id);
    const sMarks = testId === "all" ? sMarksAll : sMarksAll.filter((m) => m.test_id === testId);
    const attPct = sAtt.length ? Math.round((sAtt.filter((a) => a.status === "present").length / sAtt.length) * 100) : 0;
    const avgPct = sMarks.length
      ? Math.round(sMarks.reduce((sum, m) => sum + (Number(m.score) / Number(m.max_score)) * 100, 0) / sMarks.length)
      : 0;
    return { name: s.full_name.split(" ")[0], value: metric === "attendance" ? attPct : avgPct };
  });

  const metricLabel = metric === "attendance"
    ? "Attendance %"
    : testId === "all" ? "Avg Test Score %" : `Score % — ${tests?.find((t) => t.id === testId)?.title ?? "Test"}`;

  const personal = (marks ?? [])
    .filter((m) => m.student_id === studentId)
    .sort((a, b) => a.test_date.localeCompare(b.test_date))
    .map((m) => ({ name: m.test_name.slice(0, 16), pct: Math.round((Number(m.score) / Number(m.max_score)) * 100) }));

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between flex-wrap gap-3">
            <div>
              <CardTitle>Compare students</CardTitle>
              <CardDescription>Pick an activity to rank approved students.</CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={courseFilter} onValueChange={(v) => setCourseFilter(v as typeof courseFilter)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Course" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All courses</SelectItem>
                  <SelectItem value="IELTS">IELTS</SelectItem>
                  <SelectItem value="English Communication">English Communication</SelectItem>
                </SelectContent>
              </Select>
              <Select value={metric} onValueChange={(v) => setMetric(v as CompareMetric)}>
                <SelectTrigger className="w-[180px]"><SelectValue placeholder="Activity" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="attendance">Attendance</SelectItem>
                  <SelectItem value="marks">Test marks</SelectItem>
                </SelectContent>
              </Select>
              {metric === "marks" && (
                <Select value={testId} onValueChange={setTestId}>
                  <SelectTrigger className="w-[240px]"><SelectValue placeholder="All tests (avg)" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All tests (average)</SelectItem>
                    {(tests ?? []).map((t) => <SelectItem key={t.id} value={t.id}>{t.title}</SelectItem>)}
                  </SelectContent>
                </Select>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="h-[360px]">
          {compareData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={compareData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.88 0.02 95)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="value"
                  name={metricLabel}
                  fill={metric === "attendance" ? "oklch(0.78 0.13 75)" : "oklch(0.34 0.085 160)"}
                  radius={[6, 6, 0, 0]}
                />
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
