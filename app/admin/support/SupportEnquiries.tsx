"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ExternalLink, HandHeart, RefreshCw, Search, X } from "lucide-react";
import styles from "./SupportEnquiries.module.css";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  support_type: string;
  support_area: string;
  indicative_amount: string | null;
  message: string | null;
  status: "new" | "read" | "responded" | "closed";
  contact_consent: boolean;
  created_at: string;
};

const statuses = ["new", "read", "responded", "closed"] as const;

export default function SupportEnquiries({ initialEnquiries, loadError }: { initialEnquiries: Enquiry[]; loadError: string | null }) {
  const router = useRouter();
  const [items, setItems] = useState(initialEnquiries);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | Enquiry["status"]>("all");
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(loadError);

  const counts = useMemo(() => ({
    all: items.length,
    new: items.filter((item) => item.status === "new").length,
    read: items.filter((item) => item.status === "read").length,
    responded: items.filter((item) => item.status === "responded").length,
    closed: items.filter((item) => item.status === "closed").length,
  }), [items]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => (filter === "all" || item.status === filter) &&
      (!term || [item.name, item.email, item.organisation ?? "", item.support_type, item.support_area, item.message ?? ""].some((value) => value.toLowerCase().includes(term))));
  }, [items, query, filter]);

  async function updateStatus(item: Enquiry, status: Enquiry["status"]) {
    setBusy(item.id);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/support-enquiries", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The enquiry status could not be updated.");
      setItems((current) => current.map((entry) => entry.id === item.id ? result.item : entry));
      setSelected((current) => current?.id === item.id ? result.item : current);
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  function openEnquiry(item: Enquiry) {
    setSelected(item);
    if (item.status === "new") void updateStatus(item, "read");
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>FOUNDATION ENGAGEMENT</p><h1>Support Enquiries</h1><p>Review and follow up on offers of support submitted through the website.</p></div>
        <button className={styles.refresh} type="button" onClick={() => router.refresh()}><RefreshCw size={16}/> Refresh</button>
      </header>
      {feedback && <p className={styles.feedback} role="alert">{feedback}</p>}
      <section className={styles.stats} aria-label="Enquiry counts">
        {(["all", ...statuses] as const).map((key) => (
          <button type="button" key={key} onClick={() => setFilter(key)} className={filter === key ? styles.statActive : styles.stat}>
            <span>{key === "all" ? "All enquiries" : key === "new" ? "New" : key === "read" ? "Read" : key === "responded" ? "Responded" : "Closed"}</span><strong>{counts[key]}</strong>
          </button>
        ))}
      </section>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div><h2>Enquiries</h2><p>{visible.length} {visible.length === 1 ? "enquiry" : "enquiries"}</p></div>
          <label className={styles.search}><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, organisation or enquiry"/></label>
        </div>
        {visible.length === 0 ? <div className={styles.empty}><HandHeart size={28}/><strong>{items.length ? "No matching enquiries" : "No support enquiries yet"}</strong><p>{items.length ? "Try another search or status filter." : "Submissions from the public support form will appear here."}</p></div> :
          <div className={styles.list}>
            {visible.map((item) => <button type="button" className={styles.row} key={item.id} onClick={() => openEnquiry(item)}>
              <span className={styles.icon}><HandHeart size={19}/></span>
              <span className={styles.main}><strong>{item.name}</strong><span>{item.support_type} · {item.support_area}</span><small>{item.organisation || item.email}</small></span>
              <span className={styles.meta}><span className={styles[item.status]}>{item.status}</span><time>{new Date(item.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</time></span>
            </button>)}
          </div>}
      </section>
      {selected && <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
          <header><div><p className={styles.eyebrow}>SUPPORT ENQUIRY</p><h2 id="enquiry-title">{selected.name}</h2></div><button type="button" className={styles.close} onClick={() => setSelected(null)} aria-label="Close enquiry"><X size={20}/></button></header>
          <div className={styles.fields}>
            <div><small>Email</small><a href={`mailto:${selected.email}`}>{selected.email} <ExternalLink size={13}/></a></div>
            {selected.phone && <div><small>Phone</small><a href={`tel:${selected.phone}`}>{selected.phone}</a></div>}
            {selected.organisation && <div><small>Organisation</small><strong>{selected.organisation}</strong></div>}
            <div><small>Support type</small><strong>{selected.support_type}</strong></div>
            <div><small>Area of support</small><strong>{selected.support_area}</strong></div>
            {selected.indicative_amount && <div><small>Indicative amount / details</small><strong>{selected.indicative_amount}</strong></div>}
            <div><small>Contact consent</small><strong>{selected.contact_consent ? "Granted" : "Not recorded"}</strong></div>
            <div><small>Submitted</small><strong>{new Date(selected.created_at).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}</strong></div>
          </div>
          <div className={styles.message}>{selected.message || "No additional message was provided."}</div>
          <div className={styles.actions}>
            {selected.status !== "responded" && selected.status !== "closed" && <button type="button" className={styles.primary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "responded")}><Check size={16}/> Mark responded</button>}
            {selected.status !== "closed" && <button type="button" className={styles.secondary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "closed")}>Close enquiry</button>}
            {selected.status === "closed" && <button type="button" className={styles.secondary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "read")}>Reopen enquiry</button>}
            <button type="button" className={styles.secondary} onClick={() => setSelected(null)}>Done</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
