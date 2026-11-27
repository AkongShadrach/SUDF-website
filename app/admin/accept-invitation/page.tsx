"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "../../../utils/supabase/client";

export default function AcceptAdminInvitationPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [ready, setReady] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function prepareInvitation() {
      const supabase = createClient();
      try {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          window.history.replaceState({}, "", window.location.pathname);
        }

        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          throw new Error("This invitation link is invalid, expired, or has already been used. Ask the SUDF super administrator to send a new invitation.");
        }

        const response = await fetch("/api/admin/verify", { cache: "no-store" });
        if (!response.ok) {
          throw new Error("This email is not listed as an active SUDF administrator. Contact the super administrator.");
        }

        if (active) {
          setEmail(user.email ?? "");
          setReady(true);
        }
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "We could not verify this invitation.");
      } finally {
        if (active) setChecking(false);
      }
    }
    void prepareInvitation();
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
      if (!response.ok || !result.authorized) {
        throw new Error("Your password was saved, but this account is not authorised for the SUDF dashboard. Please contact the super administrator.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not save your password. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sudf-admin-login">
      <section className="sudf-admin-login-card">
        <div className="sudf-admin-mark">SUDF</div>
        <p className="sudf-admin-eyebrow">FOUNDATION ADMINISTRATION</p>
        <h1>Create your password</h1>
        <p className="sudf-admin-muted">Complete your administrator invitation to access the secure SUDF workspace.</p>
        {checking ? (
          <p className="sudf-admin-muted" role="status">Verifying your invitation…</p>
        ) : ready ? (
          <form onSubmit={submit}>
            <label>Email address<input type="email" value={email} readOnly /></label>
            <label>
              Create password
              <span className="sudf-password-field">
                <input type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={12} required value={password} onChange={(event) => setPassword(event.target.value)} />
                <button className="sudf-password-toggle" type="button" onClick={() => setShowPassword((visible) => !visible)} aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword} title={showPassword ? "Hide password" : "Show password"}>
                  {showPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </span>
            </label>
            <label>
              Confirm password
              <span className="sudf-password-field">
                <input type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" minLength={12} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
                <button className="sudf-password-toggle" type="button" onClick={() => setShowConfirmPassword((visible) => !visible)} aria-label={showConfirmPassword ? "Hide confirmation password" : "Show confirmation password"} aria-pressed={showConfirmPassword} title={showConfirmPassword ? "Hide password" : "Show password"}>
                  {showConfirmPassword ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}
                </button>
              </span>
            </label>
            <p className="sudf-admin-muted">Use at least 12 characters. Keep this password private.</p>
            {error && <p className="sudf-admin-error" role="alert">{error}</p>}
            <button className="sudf-admin-primary" type="submit" disabled={busy}>{busy ? "Saving password…" : "Create password and continue"}</button>
          </form>
        ) : (
          <p className="sudf-admin-error" role="alert">{error}</p>
        )}
        <p className="sudf-admin-login-foot">This invitation is for authorised SUDF administrators only.</p>
      </section>
    </main>
  );
}
