"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import styles from "./QuickDonate.module.css";

export default function QuickDonate() {
  const router = useRouter();
  const [amount, setAmount] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          fullName: name,
          email,
          phone,
          purpose: "General support",
          source: "quick_donate",
          contactConsent: consent,
          idempotencyKey: crypto.randomUUID(),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not start your donation. Please try again.");
      if (result.nextUrl) router.push(result.nextUrl);
      else throw new Error("Your donation could not be prepared. Please try again.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setBusy(false);
    }
  }

  return (
    <section className={styles.section} id="quick-donate" aria-labelledby="quick-donate-title">
      <div className={styles.intro}>
        <p className={styles.eyebrow}>QUICK DONATION</p>
        <h2 id="quick-donate-title">Prefer to give right away?</h2>
        <p>Skip the full support enquiry. Enter the essentials and continue to the donation payment options.</p>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <label>Donation amount (₦)
          <input required type="number" min="1" max="1000000000" step="0.01" inputMode="decimal" value={amount} onChange={(event) => setAmount(event.target.value)} placeholder="e.g. 10000" />
        </label>
        <label>Full name
          <input required maxLength={120} autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
        </label>
        <label>Email address
          <input required type="email" maxLength={254} autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
        </label>
        <label>Phone number <span>(optional)</span>
          <input type="tel" maxLength={40} autoComplete="tel" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="Your phone number" />
        </label>
        <label className={styles.consent}>
          <input type="checkbox" required checked={consent} onChange={(event) => setConsent(event.target.checked)} />
          <span>I agree that SUDF may contact me about this donation.</span>
        </label>
        <button className={styles.submit} type="submit" disabled={busy}>{busy ? "Preparing donation..." : "Continue to payment"} <span aria-hidden="true">→</span></button>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <p className={styles.note}>Your details are used to record this donation and support payment confirmation. No payment is taken on this page.</p>
      </form>
    </section>
  );
}
