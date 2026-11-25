"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Edit3, LoaderCircle, Plus, Search, Trash2, X } from "lucide-react";
import styles from "./AdminContentManager.module.css";

type Section = "programmes" | "events" | "news" | "impact";
type Item = Record<string, string | number | boolean | null> & { id: string };

type Field = { name: string; label: string; type?: "text" | "textarea" | "date" | "datetime-local" | "number" | "url" | "select" | "checkbox"; required?: boolean; options?: string[] };

const fields: Record<Section, Field[]> = {
  programmes: [
    { name: "title", label: "Programme title", required: true },
    { name: "slug", label: "URL slug", required: true },
    { name: "summary", label: "Short summary", type: "textarea" },
    { name: "description", label: "Full description", type: "textarea" },
    { name: "status", label: "Publishing status", type: "select", options: ["draft", "published", "archived"] },
  ],
  events: [
    { name: "title", label: "Event title", required: true },
    { name: "slug", label: "URL slug", required: true },
    { name: "description", label: "Description", type: "textarea" },
    { name: "starts_at", label: "Starts", type: "datetime-local" },
    { name: "ends_at", label: "Ends", type: "datetime-local" },
    { name: "location", label: "Location" },
    { name: "registration_url", label: "Registration link", type: "url" },
    { name: "status", label: "Event status", type: "select", options: ["draft", "published", "cancelled", "completed"] },
  ],
  news: [
    { name: "title", label: "Article title", required: true },
    { name: "slug", label: "URL slug", required: true },
    { name: "excerpt", label: "Short excerpt", type: "textarea" },
    { name: "body", label: "Article body", type: "textarea", required: true },
    { name: "status", label: "Publishing status", type: "select", options: ["draft", "published", "archived"] },
  ],
  impact: [
    { name: "metric_name", label: "Metric name", required: true },
    { name: "metric_value", label: "Value", type: "number" },
    { name: "unit", label: "Unit (e.g. people, communities)" },
    { name: "period_start", label: "Period start", type: "date" },
    { name: "period_end", label: "Period end", type: "date" },
    { name: "source_note", label: "Source / verification note", type: "textarea" },
    { name: "verified", label: "Verified figure", type: "checkbox" },
  ],
};

function emptyValues(section: Section) {
  const values: Record<string, string | boolean> = {};
  for (const field of fields[section]) values[field.name] = field.type === "checkbox" ? false : field.name === "status" ? (section === "events" ? "draft" : "draft") : "";
  return values;
}

function toInputValue(field: Field, value: Item[string] | undefined) {
  if (value == null) return field.type === "checkbox" ? false : "";
  if (field.type === "datetime-local" && typeof value === "string") return value.slice(0, 16);
  if (field.type === "date" && typeof value === "string") return value.slice(0, 10);
  return value;
}

function toPayload(section: Section, values: Record<string, string | boolean>) {
  const payload: Record<string, unknown> = { ...values };
  for (const field of fields[section]) {
    if (field.type === "datetime-local" && typeof payload[field.name] === "string" && payload[field.name]) {
      payload[field.name] = new Date(payload[field.name] as string).toISOString();
    }
    if (field.type === "number") payload[field.name] = payload[field.name] === "" ? null : Number(payload[field.name]);
    if (field.type !== "checkbox" && payload[field.name] === "") payload[field.name] = null;
  }
  return payload;
}

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminContentManager({ section, title, description, initialItems, loadError }: {
  section: Section; title: string; description: string; initialItems: Item[]; loadError: string | null;
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Item | null>(null);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => emptyValues(section));
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(loadError ? { kind: "error", text: loadError } : null);
  const [formOpen, setFormOpen] = useState(false);
  const sectionFields = fields[section];

  const filteredItems = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) => Object.values(item).some((value) => String(value ?? "").toLowerCase().includes(term)));
  }, [items, query]);

  function startNew() {
    setEditing(null);
    setValues(emptyValues(section));
    setNotice(null);
    setFormOpen(true);
  }

  function startEdit(item: Item) {
    setEditing(item);
    const next = emptyValues(section);
    for (const field of sectionFields) next[field.name] = toInputValue(field, item[field.name]) as string | boolean;
    setValues(next);
    setNotice(null);
    setFormOpen(true);
  }

  function updateField(name: string, value: string | boolean) {
    setValues((current) => {
      const next = { ...current, [name]: value };
      if (name === "title" && section !== "impact" && (!editing || current.slug === makeSlug(String(editing.title ?? "")))) next.slug = makeSlug(String(value));
      return next;
    });
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...toPayload(section, values), ...(editing ? { id: editing.id } : {}) }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The record could not be saved.");
      if (editing) setItems((current) => current.map((item) => item.id === editing.id ? result.item : item));
      else setItems((current) => [result.item, ...current]);
      setFormOpen(false);
      setNotice({ kind: "success", text: editing ? "Changes saved successfully." : "Record created successfully." });
      router.refresh();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  }

  async function remove(item: Item) {
    const label = String(item.title ?? item.metric_name ?? "this record");
    if (!window.confirm(`Delete "${label}"? This cannot be undone.`)) return;
    setNotice(null);
    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "The record could not be deleted.");
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setNotice({ kind: "success", text: "Record deleted." });
      router.refresh();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "Something went wrong." });
    }
  }

  function displayName(item: Item) {
    return String(item.title ?? item.metric_name ?? "Untitled");
  }

  function displayStatus(item: Item) {
    if (section === "impact") return item.verified ? "Verified" : "Unverified";
    return String(item.status ?? "draft").replaceAll("_", " ");
  }

  return (
    <div className={styles.page}>
      <div className={styles.heading}>
        <div><p className={styles.eyebrow}>CONTENT MANAGEMENT</p><h1>{title}</h1><p>{description}</p></div>
        <button className={styles.primary} onClick={startNew}><Plus size={17}/> Add new</button>
      </div>

      {notice && <div className={notice.kind === "error" ? styles.error : styles.success} role="status">{notice.text}</div>}

      {formOpen && <section className={styles.formPanel}>
        <div className={styles.formHeading}><div><p className={styles.eyebrow}>{editing ? "EDIT RECORD" : "NEW RECORD"}</p><h2>{editing ? "Update content" : "Create content"}</h2></div><button className={styles.iconButton} type="button" onClick={() => setFormOpen(false)} aria-label="Close form"><X size={19}/></button></div>
        <form onSubmit={save} className={styles.formGrid}>
          {sectionFields.map((field) => <label key={field.name} className={field.type === "textarea" ? styles.wide : ""}>
            <span>{field.label}{field.required ? " *" : ""}</span>
            {field.type === "textarea" ? <textarea required={field.required} rows={5} value={String(values[field.name] ?? "")} onChange={(event) => updateField(field.name, event.target.value)} />
              : field.type === "select" ? <select value={String(values[field.name] ?? "draft")} onChange={(event) => updateField(field.name, event.target.value)}>{field.options?.map((option) => <option key={option} value={option}>{option.replaceAll("_", " ")}</option>)}</select>
              : field.type === "checkbox" ? <input type="checkbox" checked={Boolean(values[field.name])} onChange={(event) => updateField(field.name, event.target.checked)} />
              : <input type={field.type ?? "text"} required={field.required} value={String(values[field.name] ?? "")} onChange={(event) => updateField(field.name, event.target.value)} />}
          </label>)}
          <div className={styles.formActions}><button className={styles.secondary} type="button" onClick={() => setFormOpen(false)}>Cancel</button><button className={styles.primary} type="submit" disabled={saving}>{saving ? <LoaderCircle className={styles.spin} size={17}/> : <Check size={17}/>} {saving ? "Saving…" : "Save record"}</button></div>
        </form>
      </section>}

      <section className={styles.listPanel}>
        <div className={styles.listHeading}><div><h2>All records</h2><p>{items.length} {items.length === 1 ? "record" : "records"} in this section</p></div><label className={styles.search}><Search size={17}/><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search records"/></label></div>
        {filteredItems.length === 0 ? <div className={styles.empty}><span>{items.length ? "No matching records" : "Nothing here yet"}</span><p>{items.length ? "Try another search term." : "Create the first record to populate this section of the website."}</p>{!items.length && <button className={styles.secondary} onClick={startNew}><Plus size={16}/> Create first record</button>}</div>
          : <div className={styles.tableWrap}><table><thead><tr><th>Content</th><th>Status</th><th>Last updated</th><th><span className={styles.srOnly}>Actions</span></th></tr></thead><tbody>{filteredItems.map((item) => <tr key={item.id}><td><strong>{displayName(item)}</strong><small>{String(item.slug ?? item.unit ?? "")}</small></td><td><span className={styles.status}>{displayStatus(item)}</span></td><td>{String(item.updated_at ?? item.created_at ?? item.starts_at ?? "—").slice(0, 10)}</td><td><div className={styles.actions}><button onClick={() => startEdit(item)} aria-label={`Edit ${displayName(item)}`}><Edit3 size={16}/></button><button onClick={() => remove(item)} aria-label={`Delete ${displayName(item)}`}><Trash2 size={16}/></button></div></td></tr>)}</tbody></table></div>}
      </section>
    </div>
  );
}
