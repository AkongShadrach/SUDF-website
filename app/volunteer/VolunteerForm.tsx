"use client";

import { useState } from "react";
import type { FormEvent } from "react";

const initialValues = {
  name: "", email: "", phone: "", state: "", lga: "",
  volunteerArea: "Nursing and patient support",
  profession: "", specialisation: "", qualifications: "",
  registrationNumber: "", experience: "", availability: "Flexible",
  motivation: "", consent: false, website: "",
};

export default function VolunteerForm() {
  const [values, setValues] = useState(initialValues);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  function update(field: keyof typeof initialValues, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");
    try {
      const response = await fetch("/api/volunteer-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "We could not submit your application. Please try again.");
      setStatus("success");
      setFeedback("Thank you. Your volunteer application has been received. The Foundation may contact you about next steps.");
      setValues(initialValues);
    } catch (error) {
      setStatus("error");
      setFeedback(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form className="volunteer-form" onSubmit={handleSubmit}>
      <div className="volunteer-form-heading">
        <span>SUDF VOLUNTEER NETWORK</span>
        <h3>Volunteer application</h3>
        <p>Fields marked required must be completed.</p>
      </div>
      <div className="volunteer-form-grid">
        <label>Full name<input required maxLength={120} autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" /></label>
        <label>Email address<input required type="email" maxLength={254} autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} placeholder="you@example.com" /></label>
        <label>Phone number<input required type="tel" maxLength={40} autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} placeholder="Your phone number" /></label>
        <label>State<input required maxLength={80} value={values.state} onChange={(e) => update("state", e.target.value)} placeholder="State of residence" /></label>
        <label>Local Government Area<input maxLength={100} value={values.lga} onChange={(e) => update("lga", e.target.value)} placeholder="LGA" /></label>
        <label>Preferred volunteer area
          <select value={values.volunteerArea} onChange={(e) => update("volunteerArea", e.target.value)}>
            <option>Medical and clinical services</option><option>Nursing and patient support</option><option>Community health education</option><option>Outreach and screening assistance</option><option>Research and data support</option><option>Communications and operations</option><option>General community volunteering</option>
          </select>
        </label>
        <label>Profession / occupation<input required maxLength={120} value={values.profession} onChange={(e) => update("profession", e.target.value)} placeholder="e.g. Registered Nurse, Student, Administrator" /></label>
        <label>Area of specialisation <span>(if applicable)</span><input maxLength={160} value={values.specialisation} onChange={(e) => update("specialisation", e.target.value)} placeholder="Your area of specialisation" /></label>
        <label className="volunteer-form-full">Qualifications / relevant training <span>(if applicable)</span><input maxLength={500} value={values.qualifications} onChange={(e) => update("qualifications", e.target.value)} placeholder="List relevant qualifications or training" /></label>
        <label className="volunteer-form-full">Professional registration number <span>(where applicable)</span><input maxLength={120} value={values.registrationNumber} onChange={(e) => update("registrationNumber", e.target.value)} placeholder="Relevant professional registration number" /></label>
        <label className="volunteer-form-full">Relevant experience<textarea rows={3} maxLength={2000} value={values.experience} onChange={(e) => update("experience", e.target.value)} placeholder="Briefly describe relevant experience" /></label>
        <label>Availability
          <select value={values.availability} onChange={(e) => update("availability", e.target.value)}>
            <option>Flexible</option><option>Weekdays</option><option>Weekends</option><option>Occasional / event-based</option><option>Remote support</option>
          </select>
        </label>
        <label className="volunteer-form-full">Why would you like to volunteer with SUDF?<textarea required rows={4} maxLength={2000} value={values.motivation} onChange={(e) => update("motivation", e.target.value)} placeholder="Tell us about your interest and how you hope to contribute" /></label>
      </div>
      <div className="volunteer-honeypot" aria-hidden="true"><label>Leave this field empty<input tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} /></label></div>
      <label className="volunteer-consent"><input type="checkbox" required checked={values.consent} onChange={(e) => update("consent", e.target.checked)} style={{ width: 22, height: 22, flex: "0 0 22px", marginTop: 2 }} /><span>I consent to SUDF using the information I provide to review this volunteer application and contact me about it.</span></label>
      <button className="button button-gold volunteer-submit" type="submit" disabled={status === "sending"}>{status === "sending" ? "Submitting application..." : "SUBMIT VOLUNTEER APPLICATION"} <span aria-hidden="true">→</span></button>
      {feedback && <p className={status === "success" ? "volunteer-feedback success" : "volunteer-feedback error"} role="status">{feedback}</p>}
      <p className="volunteer-form-footnote">Submitting this form does not guarantee acceptance or deployment. SUDF will review applications and contact applicants where appropriate.</p>
    </form>
  );
}
