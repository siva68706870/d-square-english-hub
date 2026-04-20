import { createFileRoute, useRouter, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/auth/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { GraduationCap, Loader2 } from "lucide-react";
import { PaymentQR } from "@/components/PaymentQR";
import upiQr from "@/assets/upi-qr.png";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup"]).optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  component: LoginPage,
});

const signupSchema = z.object({
  full_name: z.string().trim().min(2, "Name is too short").max(100),
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(6, "Min 6 characters").max(72),
  course: z.enum(["IELTS", "English Communication"]),
  mobile_number: z.string().trim().min(7, "Enter a valid mobile").max(20),
  parent_name: z.string().trim().min(2).max(100),
});

const signinSchema = z.object({
  email: z.string().trim().email("Enter a valid email").max(255),
  password: z.string().min(1, "Password required").max(72),
});

function LoginPage() {
  const router = useRouter();
  const { mode = "signin" } = Route.useSearch();
  const { user, isAdmin, loading } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  // Redirect after login
  useEffect(() => {
    if (!loading && user) {
      router.navigate({ to: isAdmin ? "/admin" : "/dashboard" });
    }
  }, [loading, user, isAdmin, router]);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signinSchema.safeParse({
      email: fd.get("email"),
      password: fd.get("password"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Welcome back!");
  };

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const parsed = signupSchema.safeParse({
      full_name: fd.get("full_name"),
      email: fd.get("email"),
      password: fd.get("password"),
      course: fd.get("course"),
      mobile_number: fd.get("mobile_number"),
      parent_name: fd.get("parent_name"),
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.auth.signUp({
      email: parsed.data.email,
      password: parsed.data.password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: parsed.data.full_name,
          course: parsed.data.course,
          mobile_number: parsed.data.mobile_number,
          parent_name: parsed.data.parent_name,
        },
      },
    });
    setSubmitting(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Awaiting admin approval.");
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="relative hidden lg:flex bg-hero p-12 flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_oklch(0.78_0.13_75_/_0.25),_transparent_60%)]" />
        <Link to="/" className="relative flex items-center gap-2.5 text-primary-foreground">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/20 backdrop-blur">
            <GraduationCap className="h-5 w-5 text-gold" />
          </div>
          <span className="font-display text-xl font-bold">D² English Hub</span>
        </Link>
        <div className="relative">
          <h2 className="font-display text-5xl font-bold text-primary-foreground leading-tight">
            Where words<br />become wings.
          </h2>
          <p className="mt-4 text-primary-foreground/75 max-w-md">
            Join hundreds of students mastering IELTS and English communication with structured guidance.
          </p>
        </div>
        <div className="relative text-xs text-primary-foreground/60">
          © {new Date().getFullYear()} D Square English Hub
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-hero">
                <GraduationCap className="h-5 w-5 text-gold" />
              </div>
              <span className="font-display text-xl font-bold">D² English Hub</span>
            </Link>
          </div>

          <div className="flex gap-2 rounded-lg bg-muted p-1 mb-8">
            <Link
              to="/login"
              search={{ mode: "signin" }}
              className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition ${mode === "signin" ? "bg-card shadow-card" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign in
            </Link>
            <Link
              to="/login"
              search={{ mode: "signup" }}
              className={`flex-1 rounded-md px-4 py-2 text-center text-sm font-medium transition ${mode === "signup" ? "bg-card shadow-card" : "text-muted-foreground hover:text-foreground"}`}
            >
              Admission
            </Link>
          </div>

          {mode === "signin" ? (
            <form onSubmit={handleSignIn} className="space-y-4">
              <h1 className="font-display text-3xl font-bold">Welcome back</h1>
              <p className="text-sm text-muted-foreground -mt-2">Continue your learning journey</p>

              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-hero text-primary-foreground hover:opacity-90">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign in
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSignUp} className="space-y-4">
              <h1 className="font-display text-3xl font-bold">Create your account</h1>
              <p className="text-sm text-muted-foreground -mt-2">Tell us a bit about yourself</p>

              <div className="space-y-1.5">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" required maxLength={100} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" minLength={6} required />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="course">Course</Label>
                <Select name="course" required>
                  <SelectTrigger id="course"><SelectValue placeholder="Choose a course" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="IELTS">IELTS</SelectItem>
                    <SelectItem value="English Communication">English Communication</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="mobile_number">Mobile number</Label>
                  <Input id="mobile_number" name="mobile_number" type="tel" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="parent_name">Parent's name</Label>
                  <Input id="parent_name" name="parent_name" required />
                </div>
              </div>

              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 text-center">
                  Pay course fee
                </p>
                <div className="flex justify-center">
                  <PaymentQR
                    imageSrc={upiQr}
                    size={220}
                    caption="Scan with any UPI app to pay. Show payment screenshot to admin to get approved."
                  />
                </div>
                <div className="mt-3 rounded-lg border border-border bg-card px-3 py-2 text-center">
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground">UPI ID</p>
                  <p className="font-mono text-sm font-semibold text-foreground select-all">
                    preciousarun-1@okicici
                  </p>
                </div>
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-hero text-primary-foreground hover:opacity-90">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create account
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
