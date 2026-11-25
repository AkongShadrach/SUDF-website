"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Mail, MailOpen, RefreshCw, Search, X } from "lucide-react";
import styles from "./ContactInbox.module.css";

type Message = {
  id: string;
  name: string;
  email: string;
  message: string;
  status: "new" | "read" | "resolved";
  created_at: string;
};

export default function ContactInbox({ initialMessages, loadError }: { initialMessages: Message[]; loadError: string | null }) {
  const router = useRouter();
  const [messages, setMessages] = useState(initialMessages);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "new" | "read" | "resolved">("all");
  const [busy, setBusy] = useState<string | null>(null);
  const [feedback, setFeedback] = useState(loadError);

  const counts = useMemo(() => ({
    all: messages.length,
    new: messages.filter((item) => item.status === "new").length,
    read: messages.filter((item) => item.status === "read").length,
    resolved: messages.filter((item) => item.status === "resolved").length,
  }), [messages]);

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return messages.filter((item) => (filter === "all" || item.status === filter) &&
      (!term || [item.name, item.email, item.message].some((value) => value.toLowerCase().includes(term))));
  }, [messages, query, filter]);

  async function updateStatus(item: Message, status: Message["status"]) {
    setBusy(item.id);
    setFeedback(null);
    try {
      const response = await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: item.id, status }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The message status could not be updated.");
      setMessages((current) => current.map((message) => message.id === item.id ? result.item : message));
      setSelected((current) => current?.id === item.id ? result.item : current);
      router.refresh();
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Something went wrong.");
    } finally {
      setBusy(null);
    }
  }

  function openMessage(item: Message) {
    setSelected(item);
    if (item.status === "new") void updateStatus(item, "read");
  }

  return (
    <div className={styles.page}>
      <header className={styles.heading}>
        <div><p className={styles.eyebrow}>FOUNDATION MESSAGES</p><h1>Contact Inbox</h1><p>Review and manage messages submitted through the public contact form.</p></div>
        <button className={styles.refresh} type="button" onClick={() => router.refresh()}><RefreshCw size={16}/> Refresh</button>
      </header>

      {feedback && <p className={styles.feedback} role="alert">{feedback}</p>}

      <section className={styles.stats} aria-label="Message counts">
        {(["all", "new", "read", "resolved"] as const).map((key) => (
          <button type="button" key={key} onClick={() => setFilter(key)} className={filter === key ? styles.statActive : styles.stat}>
            <span>{key === "all" ? "All messages" : key === "new" ? "New" : key === "read" ? "Read" : "Resolved"}</span><strong>{counts[key]}</strong>
          </button>
        ))}
      </section>

      <section className={styles.panel}>
        <div className={styles.toolbar}>
          <div><h2>Messages</h2><p>{visible.length} {visible.length === 1 ? "message" : "messages"}</p></div>
          <label className={styles.search}><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email or message"/></label>
        </div>
        {visible.length === 0 ? <div className={styles.empty}><Mail size={28}/><strong>{messages.length ? "No matching messages" : "Your inbox is empty"}</strong><p>{messages.length ? "Try a different search or status filter." : "Messages submitted through the website contact form will appear here."}</p></div> :
          <div className={styles.list}>
            {visible.map((item) => <button type="button" className={styles.messageRow} key={item.id} onClick={() => openMessage(item)}>
              <span className={styles.mailIcon}>{item.status === "new" ? <Mail size={19}/> : <MailOpen size={19}/>}</span>
              <span className={styles.messageMain}><strong>{item.name}</strong><span>{item.email}</span><small>{item.message}</small></span>
              <span className={styles.messageMeta}><span className={styles[item.status]}>{item.status.replace("_", " ")}</span><time>{new Date(item.created_at).toLocaleString("en-NG", { dateStyle: "medium", timeStyle: "short" })}</time></span>
            </button>)}
          </div>}
      </section>

      {selected && <div className={styles.overlay} role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="message-title">
          <header><div><p className={styles.eyebrow}>CONTACT MESSAGE</p><h2 id="message-title">{selected.name}</h2></div><button type="button" className={styles.close} onClick={() => setSelected(null)} aria-label="Close message"><X size={20}/></button></header>
          <a className={styles.email} href={`mailto:${selected.email}`}>{selected.email}</a>
          <p className={styles.date}>{new Date(selected.created_at).toLocaleString("en-NG", { dateStyle: "full", timeStyle: "short" })}</p>
          <div className={styles.messageBody}>{selected.message}</div>
          <div className={styles.detailActions}>
            {selected.status !== "resolved" && <button type="button" className={styles.resolve} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "resolved")}><Check size={16}/> Mark resolved</button>}
            {selected.status !== "read" && selected.status !== "new" && <button type="button" className={styles.secondary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "read")}>Mark as read</button>}
            {selected.status === "resolved" && <button type="button" className={styles.secondary} disabled={busy === selected.id} onClick={() => void updateStatus(selected, "new")}>Reopen message</button>}
            <button type="button" className={styles.secondary} onClick={() => setSelected(null)}>Close</button>
          </div>
        </section>
      </div>}
    </div>
  );
}
