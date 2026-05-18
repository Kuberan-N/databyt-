"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase, Organization, OrgUser } from "@/lib/supabase";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

interface AuthContextType {
  user: User | null;
  session: Session | null;
  orgUser: OrgUser | null;
  organization: Organization | null;
  loading: boolean;
  signUp: (email: string, password: string, companyName: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ error: string | null }>;
  refreshOrganization: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [orgUser, setOrgUser] = useState<OrgUser | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadUserData(userId: string, _email: string) {
    const { data: ou } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single<OrgUser>();

    if (!ou) return;
    setOrgUser(ou);

    const { data: org } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", ou.org_id)
      .single<Organization>();

    setOrganization(org);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadUserData(s.user.id, s.user.email ?? "");
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        loadUserData(s.user.id, s.user.email ?? "");
      } else {
        setOrgUser(null);
        setOrganization(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function signUp(email: string, password: string, companyName: string) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message };
    if (!data.user) return { error: "Signup failed — no user returned." };

    // Use security definer function — works before email confirmation
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: fnErr } = await (supabase as any).rpc("create_org_for_user", {
      p_user_id: data.user.id,
      p_email: email,
      p_org_name: companyName,
    });

    if (fnErr) return { error: fnErr.message };

    return { error: null };
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function signOut() {
    await supabase.auth.signOut();
    setOrgUser(null);
    setOrganization(null);
  }

  async function requestPasswordReset(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    if (error) return { error: error.message };
    return { error: null };
  }

  async function refreshOrganization() {
    if (user) await loadUserData(user.id, user.email ?? "");
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        orgUser,
        organization,
        loading,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        refreshOrganization,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
