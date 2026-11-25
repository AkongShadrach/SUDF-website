"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { createClient } from "../../../utils/supabase/client";

export default function AdminForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const supabase = createClient();
      const redirectTo = new URL("/admin/reset-password", window.location.origin).toString();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
      if (resetError) throw resetError;
      setSent(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not send the password reset email.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="sudf-admin-login">
      <section className="sudf-admin-login-card">
        <div className="sudf-admin-mark">SUDF</div>
        <p className="sudf-admin-eyebrow">FOUNDATION ADMINISTRATION</p>
        <h1>Reset your password.</h1>
        {sent ? (
          <p className="sudf-admin-muted" role="status">If an account exists for that address, a password-reset email has been sent. Open it on this device and follow the secure link to choose a new password.</p>
        ) : (
          <>
            <p className="sudf-admin-muted">Enter the email address associated with your SUDF administrator account.</p>
            <form onSubmit={submit}>
              <label>Email address<input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
              {error && <p className="sudf-admin-error" role="alert">{error}</p>}
              <button className="sudf-admin-primary" type="submit" disabled={busy}>{busy ? "Sending reset link…" : "Send password reset link"}</button>
            </form>
          </>
        )}
        <p className="sudf-admin-login-foot"><Link href="/admin-login">Return to administrator sign in</Link></p>
      </section>
    </main>
  );
}
