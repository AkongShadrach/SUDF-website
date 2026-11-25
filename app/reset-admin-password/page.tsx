"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "../../utils/supabase/client";

export default function AdminResetPasswordPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [valid, setValid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function verifyRecovery() {
      const supabase = createClient();
      try {
        // The server-side /auth/callback route exchanges the one-time code and
        // stores the session in shared Supabase SSR cookies before this page loads.
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) throw new Error("This password-reset link is invalid, expired, or has already been used. Request a new one.");
        if (active) setValid(true);
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "We could not verify this password-reset link.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void verifyRecovery();
    return () => { active = false; };
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (password.length < 12) {
      setError("Use at least 12 characters for a strong password.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      const response = await fetch("/api/admin/verify", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok || !result.authorized) throw new Error("Your password was updated, but this account is not authorised for the SUDF administration dashboard.");
      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not update your password.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sudf-admin-login">
      <section className="sudf-admin-login-card sudf-admin-reset-card">
        <div className="sudf-admin-mark">SUDF</div>
        <p className="sudf-admin-eyebrow">FOUNDATION ADMINISTRATION</p>
        <h1>Create a new password.</h1>
        {checking ? <p className="sudf-admin-muted" role="status">Verifying your secure link…</p> : valid ? (
          <form onSubmit={submit}>
            <label>
              New password
              <span className="sudf-password-field">
                <input type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="sudf-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} title={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </span>
            </label>
            <label>
              Confirm new password
              <span className="sudf-password-field">
                <input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                <button className="sudf-password-toggle" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword} title={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </span>
            </label>
            <p className="sudf-admin-muted">Use at least 12 characters and keep your password private.</p>
            {error && <p className="sudf-admin-error" role="alert">{error}</p>}
            <button className="sudf-admin-primary" type="submit" disabled={busy}>{busy ? "Updating password…" : "Save password and open dashboard"}</button>
          </form>
        ) : <p className="sudf-admin-error" role="alert">{error}</p>}
      </section>
    </main>
  );
}
