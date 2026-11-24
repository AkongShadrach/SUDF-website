"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "../../utils/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          <label>Email address<input type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
          <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
          {error && <p className="sudf-admin-error" role="alert">{error}</p>}
          <button className="sudf-admin-primary" type="submit" disabled={busy}>{busy ? "Signing in..." : "Sign in securely"}</button>
        </form>
        <p className="sudf-admin-login-foot">Access is restricted to approved SUDF administrators.</p>
      </section>
    </main>
  );
}
