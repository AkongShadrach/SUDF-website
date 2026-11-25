"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (signInError) throw signInError;
      const response = await fetch("/api/admin/verify", { method: "GET", cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.authorized) {
        await supabase.auth.signOut();
        throw new Error("This account is not authorised to access the SUDF administration dashboard.");
      }
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to sign in. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sudf-admin-login">
      <section className="sudf-admin-login-card">
        <div className="sudf-admin-mark">SUDF</div>
        <p className="sudf-admin-eyebrow">FOUNDATION ADMINISTRATION</p>
        <h1>Welcome back.</h1>
        <p className="sudf-admin-muted">Sign in with your authorised Foundation administrator account.</p>
        <form onSubmit={submit}>
          <label>Email address<input type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>
            Password
            <span className="sudf-password-field">
              <input type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} />
              <button className="sudf-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} title={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
              </button>
            </span>
          </label>
          {error && <p className="sudf-admin-error" role="alert">{error}</p>}
          <button className="sudf-admin-primary" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in securely"}</button>
        </form>
        <div className="sudf-admin-login-recovery"><Link href="/admin/forgot-password">Forgot password?</Link></div>
        <p className="sudf-admin-login-foot">Access is restricted to approved SUDF administrators.</p>
      </section>
    </main>
  );
}
