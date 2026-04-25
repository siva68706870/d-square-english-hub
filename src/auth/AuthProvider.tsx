import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  course: "IELTS" | "English Communication" | "AI App Development & Digital Marketing" | null;
  mobile_number: string | null;
  parent_name: string | null;
  status: "pending" | "approved" | "rejected";
  payment_plan?: "monthly" | "full" | null;
  payment_status?: "paid" | "not_paid";
  total_amount?: number;
};

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  loading: boolean;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProfileAndRole = async (uid: string, email?: string | null) => {
    try {
      const [profRes, rolesRes] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", uid),
      ]);

      let prof = profRes.data as Profile | null;

      // Self-heal: if profile is missing, create a minimal one so the UI is never stuck.
      if (!prof) {
        const fallback = {
          user_id: uid,
          full_name: email?.split("@")[0] ?? "Student",
          email: email ?? "",
          status: "pending" as const,
          payment_status: "not_paid" as const,
          total_amount: 0,
        };
        const { data: inserted } = await supabase
          .from("profiles")
          .insert(fallback)
          .select("*")
          .maybeSingle();
        prof = (inserted as Profile | null) ?? null;
      }

      setProfile(prof);
      setIsAdmin((rolesRes.data ?? []).some((r) => r.role === "admin"));
    } catch (err) {
      // Never let a query error block the app — surface as no profile so guards can act.
      console.warn("loadProfileAndRole failed", err);
      setProfile(null);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    // Set up listener FIRST
    const { data: sub } = supabase.auth.onAuthStateChange((_event, sess) => {
      if (cancelled) return;
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        // Defer to avoid deadlock with auth lock
        setTimeout(() => {
          loadProfileAndRole(sess.user.id, sess.user.email).finally(() => setLoading(false));
        }, 0);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setLoading(false);
      }
    });

    // Then check existing session
    supabase.auth.getSession().then(({ data: { session: sess } }) => {
      if (cancelled) return;
      setSession(sess);
      setUser(sess?.user ?? null);
      if (sess?.user) {
        loadProfileAndRole(sess.user.id, sess.user.email).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  const refreshProfile = async () => {
    if (user) await loadProfileAndRole(user.id, user.email);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, isAdmin, loading, refreshProfile, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
