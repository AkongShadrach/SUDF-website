"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, FilePlus2, Pencil, Search, Trash2, Upload, X, Check, RefreshCw, Star } from "lucide-react";

type StoryImage = { url: string; path: string; alt?: string };
type FieldStory = {
  id: string; title: string; slug: string; excerpt: string; body: string; activity_date: string;
  venue: string | null; lga: string | null; state: string | null; activity_type: string;
  cover_image_url: string; cover_storage_path: string; gallery_images: StoryImage[];
  people_reached: number | null; people_screened: number | null; impact_notes: string | null;
  partners: string[]; is_featured: boolean; status: "draft" | "published" | "archived";
  published_at: string | null; created_at: string;
};
const inputStyle = { width: "100%", boxSizing: "border-box" as const, border: "1px solid #dce4dd", borderRadius: 10, padding: "12px 13px", font: "inherit", color: "#203b31", background: "#fff" };
const buttonStyle = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, border: "1px solid #244b3b", background: "#244b3b", color: "#fff", borderRadius: 999, padding: "11px 16px", fontWeight: 700, cursor: "pointer" };
const secondaryStyle = { ...buttonStyle, background: "#fff", color: "#315343", borderColor: "#dce4dd" };
const labelStyle = { display: "grid", gap: 6, color: "#315343", fontSize: 13, fontWeight: 650 };

function slugPreview(value: string) {
  return value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "your-story";
}
async function preparePhoto(file: File): Promise<File> {
  const extension = file.name.split(".").pop()?.toLowerCase();
  const inferredType = file.type || (extension === "png" ? "image/png" : extension === "jpg" || extension === "jpeg" ? "image/jpeg" : extension === "webp" ? "image/webp" : extension === "avif" ? "image/avif" : "");
  if (!["image/jpeg", "image/png", "image/webp", "image/avif"].includes(inferredType)) {
    throw new Error(`${file.name} is not a supported JPG, PNG, WebP or AVIF image.`);
  }
  const source = file.type === inferredType ? file : new File([file], file.name, { type: inferredType, lastModified: file.lastModified });
  // Keep every image compact so a cover plus 12 supporting photos fit safely
  // inside Vercel's serverless request-body limit.
  if (source.size <= 240 * 1024) return source;
  let bitmap: ImageBitmap | null = null;
  let image: HTMLImageElement | null = null;
  let objectUrl: string | null = null;
  try {
    if (typeof createImageBitmap === "function") {
      try { bitmap = await createImageBitmap(source); } catch { /* Android fallback below */ }
    }
    let width = bitmap?.width ?? 0;
    let height = bitmap?.height ?? 0;
    if (!bitmap) {
      objectUrl = URL.createObjectURL(source);
      image = new Image();
      image.decoding = "async";
      image.src = objectUrl;
      await new Promise<void>((resolve, reject) => {
        image!.onload = () => resolve();
        image!.onerror = () => reject(new Error("The browser could not decode this photograph."));
      });
      width = image.naturalWidth;
      height = image.naturalHeight;
    }
    if (!width || !height) throw new Error("The selected photograph has invalid image dimensions.");
    const scale = Math.min(1, 1600 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Your browser could not prepare the photograph.");
    if (bitmap) context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    else if (image) context.drawImage(image, 0, 0, canvas.width, canvas.height);
    for (const quality of [0.76, 0.68, 0.60, 0.52, 0.44, 0.36]) {
      const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, "image/webp", quality));
      if (blob && blob.size <= 240 * 1024) {
        const base = source.name.replace(/\.[^.]+$/, "") || "sudf-photo";
        return new File([blob], `${base}.webp`, { type: "image/webp", lastModified: Date.now() });
      }
    }
    throw new Error(`${file.name} could not be reduced enough for upload. Please choose a smaller photograph.`);
  } finally {
    bitmap?.close();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  }
}

function dateLabel(value: string) {
  if (!value) return "Date not set";
  return new Date(value + (value.length === 10 ? "T12:00:00" : "")).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
}

export default function FieldStoriesManager({ initialItems, loadError }: { initialItems: FieldStory[]; loadError: string | null }) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<FieldStory | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityType, setActivityType] = useState("Community outreach");
  const [venue, setVenue] = useState("");
  const [lga, setLga] = useState("");
  const [state, setState] = useState("");
  const [peopleReached, setPeopleReached] = useState("");
  const [peopleScreened, setPeopleScreened] = useState("");
  const [impactNotes, setImpactNotes] = useState("");
  const [partners, setPartners] = useState("");
  const [status, setStatus] = useState<"draft" | "published" | "archived">("draft");
  const [featured, setFeatured] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[]>([]);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(loadError);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter(item => !q || [item.title, item.excerpt, item.venue ?? "", item.lga ?? "", item.state ?? "", item.status].some(value => value.toLowerCase().includes(q)));
  }, [items, query]);

  function reset() {
    setFormOpen(false); setEditing(null); setTitle(""); setExcerpt(""); setBody(""); setActivityDate("");
    setActivityType("Community outreach"); setVenue(""); setLga(""); setState(""); setPeopleReached("");
    setPeopleScreened(""); setImpactNotes(""); setPartners(""); setStatus("draft"); setFeatured(false);
    setCover(null); setGallery([]);
  }
  function startCreate() { reset(); setFormOpen(true); setNotice(null); }
  function startEdit(item: FieldStory) {
    setEditing(item); setFormOpen(true); setNotice(null); setTitle(item.title); setExcerpt(item.excerpt);
    setBody(item.body); setActivityDate(item.activity_date); setActivityType(item.activity_type);
    setVenue(item.venue ?? ""); setLga(item.lga ?? ""); setState(item.state ?? "");
    setPeopleReached(item.people_reached === null ? "" : String(item.people_reached));
    setPeopleScreened(item.people_screened === null ? "" : String(item.people_screened));
    setImpactNotes(item.impact_notes ?? ""); setPartners((item.partners ?? []).join("\n"));
    setStatus(item.status); setFeatured(item.is_featured); setCover(null); setGallery([]);
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true); setNotice(null);
    try {
      // Vercel limits a single function request body to roughly 4.5 MB.
      // Optimise photos in the browser before sending multipart data to the API.
      const sourcePhotos = [cover, ...gallery].filter((file): file is File => file !== null);
      const preparedPhotos: File[] = [];
      for (const photo of sourcePhotos) preparedPhotos.push(await preparePhoto(photo));
      const totalPhotoBytes = preparedPhotos.reduce((total, photo) => total + photo.size, 0);
      if (totalPhotoBytes > 3.6 * 1024 * 1024) {
        throw new Error("The selected photographs are still too large to send together. Please reduce the number of additional photos and try again. Your original photos have not been changed.");
      }
      const form = new FormData();
      form.set("title", title); form.set("excerpt", excerpt); form.set("body", body);
      form.set("activity_date", activityDate); form.set("activity_type", activityType);
      form.set("venue", venue); form.set("lga", lga); form.set("state", state);
      form.set("people_reached", peopleReached); form.set("people_screened", peopleScreened);
      form.set("impact_notes", impactNotes); form.set("partners", partners);
      form.set("status", status); form.set("is_featured", String(featured));
      let photoIndex = 0;
      if (cover) form.set("cover", preparedPhotos[photoIndex++]);
      gallery.forEach(() => form.append("gallery", preparedPhotos[photoIndex++]));
      if (editing) form.set("id", editing.id);
      const response = await fetch("/api/admin/field-stories", { method: editing ? "PATCH" : "POST", body: form });
      const result = await response.json().catch(() => null);
      if (!response.ok) throw new Error(result?.error || (response.status === 413
        ? "The photographs exceed the hosting upload limit. Please choose fewer or smaller images."
        : "Field story could not be saved."));
      setItems(current => editing ? current.map(item => item.id === editing.id ? result.item : item) : [result.item, ...current]);
      reset();
      setNotice(editing ? "Field story updated successfully." : status === "published" ? "Field story published successfully." : "Field story saved as a draft.");
      router.refresh();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Something went wrong.");
    } finally { setBusy(false); }
  }

  async function remove(item: FieldStory) {
    if (!window.confirm(`Delete "${item.title}" and all its uploaded photographs?`)) return;
    setBusy(true); setNotice(null);
    try {
      const response = await fetch("/api/admin/field-stories", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: item.id }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Story could not be deleted.");
      setItems(current => current.filter(value => value.id !== item.id));
      setNotice("Field story deleted."); router.refresh();
    } catch (error) { setNotice(error instanceof Error ? error.message : "Something went wrong."); }
    finally { setBusy(false); }
  }

  const stats = [
    ["All stories", items.length],
    ["Published", items.filter(item => item.status === "published").length],
    ["Drafts", items.filter(item => item.status === "draft").length],
    ["Archived", items.filter(item => item.status === "archived").length],
  ];

  return (
    <div style={{ display: "grid", gap: 22, color: "#203b31" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 14, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: ".7rem", fontWeight: 800, letterSpacing: ".2em", color: "#9b8b4c", margin: 0 }}>SUDF IN ACTION</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontWeight: 500, fontSize: "clamp(2rem,4vw,2.8rem)", margin: "8px 0" }}>SUDF in Action</h1>
          <p style={{ color: "#748078", margin: 0 }}>Publish outreach stories, photographs, locations and verified impact from SUDF activities.</p>
        </div>
        <button type="button" style={buttonStyle} onClick={startCreate}><FilePlus2 size={17} /> New field story</button>
      </header>

      {notice && <p role="status" style={{ padding: 12, borderRadius: 12, background: notice.toLowerCase().includes("could not") || notice.toLowerCase().includes("failed") ? "#fff1ef" : "#edf5ee", color: notice.toLowerCase().includes("could not") || notice.toLowerCase().includes("failed") ? "#a52c22" : "#286342", margin: 0 }}>{notice}</p>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(145px,1fr))", gap: 12 }}>
        {stats.map(([label, value]) => <div key={label} style={{ background: "#fff", border: "1px solid #e5e8e2", borderRadius: 16, padding: 18 }}><span style={{ color: "#748078" }}>{label}</span><strong style={{ display: "block", fontSize: "1.8rem" }}>{value}</strong></div>)}
      </div>

      {formOpen && <section style={{ background: "#fff", border: "1px solid #e5e8e2", borderRadius: 18, padding: 20, display: "grid", gap: 16 }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div><h2 style={{ margin: 0 }}>{editing ? "Edit field story" : "Create a field story"}</h2><p style={{ margin: "5px 0 0", color: "#748078", fontSize: 13 }}>The public story page is generated automatically when you publish.</p></div>
          <button type="button" aria-label="Close editor" onClick={reset} style={secondaryStyle}><X size={16} /></button>
        </header>
        <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,260px),1fr))", gap: 14 }}>
          <label style={labelStyle}>Story title *<input required value={title} onChange={event => setTitle(event.target.value)} style={inputStyle} placeholder="e.g. Community diabetes screening in Ugep" /></label>
          <label style={labelStyle}>Activity date *<input required type="date" value={activityDate} onChange={event => setActivityDate(event.target.value)} style={inputStyle} /></label>
          <label style={labelStyle}>Activity type<select value={activityType} onChange={event => setActivityType(event.target.value)} style={inputStyle}><option>Community outreach</option><option>Diabetes screening</option><option>Health education</option><option>Medical outreach</option><option>Advocacy and partnership</option><option>Training and capacity building</option><option>Other</option></select></label>
          <label style={labelStyle}>Venue / community<input value={venue} onChange={event => setVenue(event.target.value)} style={inputStyle} placeholder="Community, venue or facility" /></label>
          <label style={labelStyle}>LGA<input value={lga} onChange={event => setLga(event.target.value)} style={inputStyle} placeholder="Local government area" /></label>
          <label style={labelStyle}>State<input value={state} onChange={event => setState(event.target.value)} style={inputStyle} placeholder="State" /></label>
          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Introductory summary *<textarea required rows={3} value={excerpt} onChange={event => setExcerpt(event.target.value)} style={inputStyle} placeholder="A short introduction shown on the homepage and at the top of the full story." /></label>
          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Full field report *<textarea required rows={10} value={body} onChange={event => setBody(event.target.value)} style={inputStyle} placeholder="Describe the purpose, activities, people involved, observations, outcomes and lessons. Separate paragraphs with a blank line." /></label>
          <label style={labelStyle}>People reached<input type="number" min="0" step="1" value={peopleReached} onChange={event => setPeopleReached(event.target.value)} style={inputStyle} placeholder="Optional verified figure" /></label>
          <label style={labelStyle}>People screened<input type="number" min="0" step="1" value={peopleScreened} onChange={event => setPeopleScreened(event.target.value)} style={inputStyle} placeholder="Optional verified figure" /></label>
          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Impact notes<textarea rows={3} value={impactNotes} onChange={event => setImpactNotes(event.target.value)} style={inputStyle} placeholder="Optional outcomes, referrals, observations or follow-up needs." /></label>
          <label style={{ ...labelStyle, gridColumn: "1 / -1" }}>Partners and collaborators<textarea rows={2} value={partners} onChange={event => setPartners(event.target.value)} style={inputStyle} placeholder="One organisation per line" /></label>
          <label style={labelStyle}>Cover photograph {!editing && "*"}<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" required={!editing} onChange={event => setCover(event.target.files?.[0] ?? null)} style={inputStyle} /><small style={{ color: "#748078", fontWeight: 400 }}>Photos are automatically optimised for reliable upload</small></label>
          <label style={labelStyle}>Additional photographs<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={event => { const selected = Array.from(event.target.files ?? []); setGallery(current => { const combined = [...current]; for (const file of selected) { if (!combined.some(existing => existing.name === file.name && existing.size === file.size && existing.lastModified === file.lastModified)) combined.push(file); } return combined.slice(0, Math.max(0, 12 - (editing?.gallery_images?.length ?? 0))); }); event.target.value = ""; }} style={inputStyle} /><small style={{ color: "#748078", fontWeight: 400 }}>{editing ? `Up to ${Math.max(0, 12 - (editing.gallery_images?.length ?? 0))} more photos; ${editing.gallery_images?.length ?? 0} already attached.` : "Up to 12 supporting photos. You can select photos more than once; selections are added together."} Photos are automatically optimised.</small></label>
          {editing && <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}><img src={editing.cover_image_url} alt={editing.title} style={{ width: 130, height: 84, objectFit: "cover", borderRadius: 10 }} /><span style={{ color: "#748078", fontSize: 13 }}>Current cover photo. Select a new file above to replace it. {editing.gallery_images?.length ?? 0} additional photo(s) already attached.</span></div>}
          <label style={labelStyle}>Publishing status<select value={status} onChange={event => setStatus(event.target.value as typeof status)} style={inputStyle}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
          <label style={{ ...labelStyle, display: "flex", flexDirection: "row", alignItems: "center", gap: 9, alignSelf: "center" }}><input type="checkbox" checked={featured} onChange={event => setFeatured(event.target.checked)} /> Feature this story on the homepage</label>
          <div style={{ gridColumn: "1 / -1", padding: 12, borderRadius: 12, background: "#f5f6f0", color: "#66736b", fontSize: 13 }}>
            <strong style={{ color: "#315343" }}>Story URL preview</strong><br />sudf.org.ng/field-stories/{slugPreview(title)}
          </div>
          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 9, flexWrap: "wrap" }}>
            <button type="submit" disabled={busy} style={{ ...buttonStyle, opacity: busy ? .65 : 1 }}>{busy ? <RefreshCw size={16} /> : editing ? <Check size={16} /> : <Upload size={16} />}{busy ? "Saving…" : editing ? "Save changes" : status === "published" ? "Publish field story" : "Save field story"}</button>
            <button type="button" style={secondaryStyle} onClick={reset}>Cancel</button>
          </div>
        </form>
      </section>}

      <section style={{ background: "#fff", border: "1px solid #e5e8e2", borderRadius: 18, padding: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
          <div><h2 style={{ margin: "0 0 4px" }}>Field stories</h2><p style={{ margin: 0, color: "#748078" }}>{visible.length} of {items.length} stories</p></div>
          <label style={{ display: "flex", gap: 8, alignItems: "center", border: "1px solid #dce4dd", borderRadius: 999, padding: "10px 13px", color: "#748078" }}><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search stories" style={{ border: 0, outline: 0, minWidth: 0, width: 160, font: "inherit" }} /></label>
        </div>
        {!visible.length ? <div style={{ textAlign: "center", padding: 36, color: "#748078" }}><FilePlus2 size={28} /><p>{items.length ? "No matching field stories." : "No field stories have been created yet."}</p><button type="button" style={secondaryStyle} onClick={startCreate}>Create your first story</button></div> :
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
            {visible.map(item => <article key={item.id} style={{ border: "1px solid #edf0eb", borderRadius: 14, overflow: "hidden", display: "grid", gridTemplateRows: "auto 1fr" }}>
              <img src={item.cover_image_url} alt={item.title} style={{ width: "100%", height: 155, objectFit: "cover" }} />
              <div style={{ padding: 13, display: "grid", gap: 8, alignContent: "start" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "center" }}><small style={{ color: "#9b8b4c", fontWeight: 800 }}>{dateLabel(item.activity_date)}</small><small style={{ color: item.status === "published" ? "#286342" : "#748078" }}>{item.status}</small></div>
                <strong>{item.title}</strong><p style={{ margin: 0, fontSize: 13, color: "#748078", lineHeight: 1.5 }}>{item.excerpt}</p>
                <small style={{ color: "#748078" }}>{[item.venue, item.lga, item.state].filter(Boolean).join(" · ") || item.activity_type}</small>
                <div style={{ display: "flex", gap: 7, flexWrap: "wrap", marginTop: 4 }}>
                  <button type="button" style={secondaryStyle} onClick={() => startEdit(item)}><Pencil size={14} /> Edit</button>
                  {item.status === "published" && <a href={`/field-stories/${item.slug}`} target="_blank" rel="noreferrer" style={{ ...secondaryStyle, textDecoration: "none" }}><ArrowUpRight size={14} /> View</a>}
                  <button type="button" aria-label={`Delete ${item.title}`} disabled={busy} onClick={() => void remove(item)} style={{ ...secondaryStyle, color: "#a52c22" }}><Trash2 size={14} /></button>
                  {item.is_featured && <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "#98751b", fontSize: 12, fontWeight: 700 }}><Star size={14} /> Featured</span>}
                </div>
              </div>
            </article>)}
          </div>}
      </section>
    </div>
  );
}
