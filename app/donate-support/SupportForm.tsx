"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const initialState = {
  name: "",
  organisation: "",
  email: "",
  phone: "",
  supportType: "Financial donation",
  amount: "",
  supportArea: "General support",
  message: "",
  consent: false,
  website: "",
};

export default function SupportForm() {
  const [values, setValues] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update(field: keyof typeof initialState, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/support-enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not submit your enquiry. Please try again.");
      setStatus("success");
      setFeedback("Thank you. Your support enquiry has been received by the Foundation.");
      setValues(initialState);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <div className="support-form-heading">
        <span>SUDF SUPPORT ENQUIRY</span>
        <h3>Become a supporter</h3>
        <p>Share a few details and tell us how you would like to contribute.</p>
      </div>
      <div className="support-form-grid">
        <label>Full name<input required maxLength={120} value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" autoComplete="name" /></label>
        <label>Organisation <span>(optional)</span><input maxLength={160} value={values.organisation} onChange={(e) => update("organisation", e.target.value)} placeholder="Organisation or company" autoComplete="organization" /></label>
        <label>Email address<input required type="email" maxLength={254} value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
        <label>Phone number <span>(optional)</span><input type="tel" maxLength={40} value={values.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Your phone number" autoComplete="tel" /></label>
        <label className="support-form-full">How would you like to support us?
          <select value={values.supportType} onChange={(e) => update("supportType", e.target.value)}>
            <option>Financial donation</option><option>Programme sponsorship</option><option>In-kind contribution</option><option>Partnership</option><option>Other practical support</option>
          </select>
        </label>
        <label className="support-form-full">Amount / budget <span>(optional, for financial support)</span><input maxLength={80} value={values.amount} onChange={(e) => update("amount", e.target.value)} placeholder="e.g. ₦500,000 or open to discussion" /></label>
        <label className="support-form-full">What would you like to support?
          <select value={values.supportArea} onChange={(e) => update("supportArea", e.target.value)}>
            <option>General support</option><option>Community diabetes screening</option><option>Care and patient support</option><option>Health education and awareness</option><option>Medical outreach</option><option>Other</option>
          </select>
        </label>
        <label className="support-form-full">Your message<textarea rows={5} maxLength={3000} value={values.message} onChange={(e) => update("message", e.target.value)} placeholder="Tell us what you have in mind..." /></label>
      </div>
      <div className="support-honeypot" aria-hidden="true">
        <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} /></label>
      </div>
      <label className="support-consent">
        <input type="checkbox" required checked={values.consent} onChange={(e) => update("consent", e.target.checked)} />
        <span>I agree that Sylvester Ujong Diabetes Foundation may contact me about this support enquiry.</span>
      </label>
      <button className="button button-green support-submit" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending enquiry..." : "BECOME A SUPPORTER"} <span aria-hidden="true">→</span>
      </button>
      {feedback && <p className={status === "success" ? "support-form-feedback success" : "support-form-feedback error"} role="status">{feedback}</p>}
      <p className="support-form-footnote">Submitting this form does not make a payment or create a financial commitment. The Foundation will follow up with next steps.</p>
    </form>
  );
}
