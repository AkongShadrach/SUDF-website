"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const initialValues = { name: "", email: "", message: "", website: "" };

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not send your message. Please try again.");
      setStatus("success");
      setFeedback("Thank you. Your message has been received by the Foundation.");
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <label>
        Your name
        <input required name="name" maxLength={120} autoComplete="name" placeholder="Your name" value={values.name} onChange={(event) => update("name", event.target.value)} />
      </label>
      <label>
        Email address
        <input required name="email" type="email" maxLength={254} autoComplete="email" placeholder="Email address" value={values.email} onChange={(event) => update("email", event.target.value)} />
      </label>
      <label>
        How can we help?
        <textarea required name="message" maxLength={3000} placeholder="How can we help?" rows={5} value={values.message} onChange={(event) => update("message", event.target.value)} />
      </label>
      <div className="contact-honeypot" aria-hidden="true">
        <label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(event) => update("website", event.target.value)} /></label>
      </div>
      <button className="button button-green" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send Message"}
      </button>
      {feedback && <p className={status === "success" ? "contact-feedback success" : "contact-feedback error"} role="status">{feedback}</p>}
    </form>
  );
}
