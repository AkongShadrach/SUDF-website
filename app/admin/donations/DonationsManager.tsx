"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, CalendarDays, CheckCircle2, Clock3, Download, Eye, RefreshCw, Search, ShieldAlert, Wallet, X } from "lucide-react";
import styles from "./DonationsManager.module.css";

type Donor = { id: string; full_name: string; email: string; phone: string | null; organisation: string | null } | null;
type Payment = { id: string; provider: string; payment_method: string | null; provider_reference: string | null; amount: number; currency: string; status: string; verified_at: string | null; created_at: string } | null;
export type DonationRecord = {
  id: string; donor_id: string; amount: number; currency: string; purpose: string; message: string | null;
  source: string; status: "pending" | "paid" | "failed" | "cancelled" | "pledged" | "manual_review";
  created_at: string; updated_at: string; donor: Donor; payment: Payment;
};

const filters = ["all", "pending", "paid", "pledged", "manual_review", "failed", "cancelled"] as const;
type Filter = typeof filters[number];
const money = (value: number, currency = "NGN") => new Intl.NumberFormat("en-NG", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value || 0));
const date = (value: string) => new Date(value).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" });

export default function DonationsManager({ initialDonations, loadError, relatedError }: { initialDonations: DonationRecord[]; loadError: string | null; relatedError: string | null }) {
  const router = useRouter();
  const [items, setItems] = useState(initialDonations);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<DonationRecord | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(loadError || relatedError);

  const stats = useMemo(() => ({
    total: items.length,
    received: items.filter((item) => item.status === "paid").reduce((sum, item) => sum + Number(item.amount), 0),
    pending: items.filter((item) => item.status === "pending").length,
    paid: items.filter((item) => item.status === "paid").length,
    pledged: items.filter((item) => item.status === "pledged").length,
    review: items.filter((item) => item.status === "manual_review").length,
  }), [items]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((item) => (filter === "all" || item.status === filter) &&
      (!term || [item.id, item.donor?.full_name ?? "", item.donor?.email ?? "", item.donor?.organisation ?? "", item.purpose, item.payment?.provider_reference ?? ""].some((part) => part.toLowerCase().includes(term))));
  }, [items, filter, query]);

  async function updateStatus(item: DonationRecord, status: "pledged" | "cancelled" | "manual_review") {
    setBusy(item.id);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/donations", {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Donation status could not be updated.");
      setItems((current) => current.map((entry) => entry.id === item.id ? { ...entry, status: result.item.status, updated_at: result.item.updated_at } : entry));
      setSelected((current) => current?.id === item.id ? { ...current, status: result.item.status, updated_at: result.item.updated_at } : current);
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  function exportCsv() {
    const columns = ["Donation reference", "Donor", "Email", "Phone", "Organisation", "Amount", "Currency", "Purpose", "Donation status", "Payment provider", "Payment status", "Payment reference", "Created at"];
    const rows = visible.map((item) => [item.id, item.donor?.full_name ?? "", item.donor?.email ?? "", item.donor?.phone ?? "", item.donor?.organisation ?? "", item.amount, item.currency, item.purpose, item.status, item.payment?.provider ?? "", item.payment?.status ?? "", item.payment?.provider_reference ?? "", item.created_at]);
    const quote = (value: unknown) => '"' + String(value ?? "").replace(/"/g, '""') + '"';
    const csv = [columns, ...rows].map((row) => row.map(quote).join(",")).join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = `sudf-donations-${new Date().toISOString().slice(0, 10)}.csv`; anchor.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>FINANCIAL ADMINISTRATION</p><h1>Donations</h1><p>Monitor donor records, contribution amounts and payment verification status.</p></div>
        <div className={styles.headingActions}><button type="button" className={styles.secondary} onClick={() => router.refresh()}><RefreshCw size={16}/> Refresh</button><button type="button" className={styles.primary} onClick={exportCsv} disabled={!visible.length}><Download size={16}/> Export CSV</button></div>
      </header>
      {feedback && <p className={styles.feedback} role="alert">{feedback}</p>}
      <section className={styles.stats}>
        <article><span><Wallet size={17}/> Donation records</span><strong>{stats.total}</strong><small>All recorded contributions</small></article>
        <article><span><Banknote size={17}/> Confirmed received</span><strong>{money(stats.received)}</strong><small>Only records marked paid</small></article>
        <article><span><Clock3 size={17}/> Pending</span><strong>{stats.pending}</strong><small>Awaiting payment or follow-up</small></article>
        <article><span><CheckCircle2 size={17}/> Paid</span><strong>{stats.paid}</strong><small>Verified paid donation records</small></article>
      </section>
      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div><h2>Donation register</h2><p>{visible.length} of {items.length} records</p></div>
          <label className={styles.search}><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search donor, email or reference"/></label>
        </div>
        <div className={styles.filters}>{filters.map((key) => <button type="button" key={key} onClick={() => setFilter(key)} className={filter === key ? styles.filterActive : styles.filter}>{key === "all" ? "All" : key.replaceAll("_", " ")}</button>)}</div>
        {visible.length === 0 ? <div className={styles.empty}><Wallet size={30}/><strong>{items.length ? "No matching donations" : "No donation records yet"}</strong><p>{items.length ? "Try a different search or status filter." : "New donations submitted through the public website will appear here."}</p></div> :
          <div className={styles.tableWrap}><table className={styles.table}>
            <thead><tr><th>Donor</th><th>Amount</th><th>Purpose</th><th>Payment</th><th>Status</th><th>Date</th><th></th></tr></thead>
            <tbody>{visible.map((item) => <tr key={item.id}>
              <td><strong>{item.donor?.full_name ?? "Donor details unavailable"}</strong><small>{item.donor?.email ?? item.id.slice(0, 8)}</small></td>
              <td className={styles.amount}>{money(item.amount, item.currency)}</td>
              <td>{item.purpose}</td>
              <td><span className={styles.paymentStatus}>{item.payment?.status ?? "Not started"}</span><small>{item.payment?.provider ?? "—"}</small></td>
              <td><span className={styles[item.status]}>{item.status.replaceAll("_", " ")}</span></td>
              <td><span className={styles.date}><CalendarDays size={13}/>{new Date(item.created_at).toLocaleDateString("en-NG", { dateStyle: "medium" })}</span></td>
              <td><button type="button" className={styles.view} onClick={() => setSelected(item)} aria-label={`View donation from ${item.donor?.full_name ?? "donor"}`}><Eye size={16}/></button></td>
            </tr>)}</tbody>
          </table></div>}
      </section>
      <p className={styles.securityNote}><ShieldAlert size={16}/> Payment status is not manually marked as paid here. A donation can only become paid after a verified payment-gateway callback or a controlled reconciliation process.</p>
      {selected && <div className={styles.overlay} onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="donation-detail-title">
          <header><div><p className={styles.eyebrow}>DONATION DETAILS</p><h2 id="donation-detail-title">{selected.donor?.full_name ?? "Donor record"}</h2><p>{selected.donor?.email}</p></div><button type="button" className={styles.close} onClick={() => setSelected(null)} aria-label="Close details"><X size={19}/></button></header>
          <div className={styles.detailGrid}>
            <div><small>Donation amount</small><strong>{money(selected.amount, selected.currency)}</strong></div>
            <div><small>Donation status</small><strong className={styles[selected.status]}>{selected.status.replaceAll("_", " ")}</strong></div>
            <div><small>Purpose</small><b>{selected.purpose}</b></div>
            <div><small>Source</small><b>{selected.source.replaceAll("_", " ")}</b></div>
            <div><small>Phone</small><b>{selected.donor?.phone || "Not provided"}</b></div>
            <div><small>Organisation</small><b>{selected.donor?.organisation || "Individual donor"}</b></div>
            <div><small>Payment provider</small><b>{selected.payment?.provider || "Not selected"}</b></div>
            <div><small>Payment method</small><b>{selected.payment?.payment_method || "Not started"}</b></div>
            <div><small>Payment status</small><b>{selected.payment?.status || "Not started"}</b></div>
            <div><small>Payment reference</small><b>{selected.payment?.provider_reference || "Not assigned"}</b></div>
            <div><small>Created</small><b>{date(selected.created_at)}</b></div>
            <div><small>Last updated</small><b>{date(selected.updated_at)}</b></div>
          </div>
          {selected.message && <div className={styles.message}>{selected.message}</div>}
          <div className={styles.actions}>
            {selected.status === "pending" && <button type="button" className={styles.primary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "pledged")}>Mark as pledged</button>}
            {selected.status !== "cancelled" && selected.status !== "paid" && <button type="button" className={styles.secondary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "manual_review")}>Flag for review</button>}
            {selected.status !== "cancelled" && selected.status !== "paid" && <button type="button" className={styles.danger} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "cancelled")}>Cancel record</button>}
            <button type="button" className={styles.secondary} onClick={() => setSelected(null)}>Close</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
