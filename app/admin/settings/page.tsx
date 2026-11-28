"use client";

import { FormEvent, useState } from "react";
import { MailPlus, ShieldCheck, Users } from "lucide-react";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"content_editor" | "admin_email" | "super_admin">("content_editor");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function sendInvitation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setNotice(null);
    try {
      const response = await fetch("/api/admin/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The invitation could not be sent.");
      setNotice({ type: "success", text: result.message });
      setEmail("");
    } catch (error) {
      setNotice({ type: "error", text: error instanceof Error ? error.message : "The invitation could not be sent." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="sudf-admin-dashboard">
      <div className="sudf-admin-page-heading">
        <div><p className="sudf-admin-eyebrow">ACCESS & SECURITY</p><h1>Administration</h1><p>Invite authorised people to help manage the SUDF website.</p></div>
      </div>
      <section className="sudf-admin-panel" style={{ maxWidth: 720 }}>
        <span className="sudf-admin-stat-icon"><Users size={20} /></span>
        <p className="sudf-admin-eyebrow">ADMINISTRATOR ONBOARDING</p>
        <h2>Invite an administrator</h2>
        <p>Supabase will email a secure, one-time invitation link. The link opens the SUDF password setup page—not the public homepage.</p>
        <form onSubmit={sendInvitation} className="sudf-admin-invite-form">
          <div className="sudf-admin-form-field">
            <label htmlFor="admin-invite-email">Email address</label>
            <input className="sudf-admin-form-control" id="admin-invite-email" type="email" autoComplete="email" autoCapitalize="none" autoCorrect="off" spellCheck={false} required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="name@example.com" />
          </div>
          <div className="sudf-admin-form-field">
            <label htmlFor="admin-invite-role">Administrator role</label>
            <select className="sudf-admin-form-control sudf-admin-form-select" id="admin-invite-role" value={role} onChange={(event) => setRole(event.target.value as "content_editor" | "admin_email" | "super_admin")}>
              <option value="content_editor">Content Editor — manage website content</option>
              <option value="admin_email">Founder &amp; Operations — Communications, Donations &amp; Foundation Administration</option>
              <option value="super_admin">Super Admin — full administration access</option>
            </select>
          </div>
          {notice && <p role="status" style={{ color: notice.type === "success" ? "#16734a" : "#b42318" }}>{notice.text}</p>}
          <button className="sudf-admin-primary" type="submit" disabled={busy}>
            <MailPlus size={17} /> {busy ? "Sending invitation…" : "Send invitation"}
          </button>
        </form>
      </section>
      <section className="sudf-admin-panel" style={{ maxWidth: 720, marginTop: 20 }}>
        <span className="sudf-admin-stat-icon"><ShieldCheck size={20} /></span>
        <h2>Invitation security</h2>
        <ul>
          <li>Only active super administrators can send invitations.</li>
          <li>Invitations redirect to <strong>/admin/accept-invitation</strong>.</li>
          <li>Access is checked against the SUDF administrator register before the dashboard is available.</li>
        </ul>
      </section>
    </div>
  );
}
