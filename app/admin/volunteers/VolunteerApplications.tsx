"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, RefreshCw, Search, Users, X } from "lucide-react";
import styles from "./VolunteerApplications.module.css";

type Application = {
  id:string; name:string; email:string; phone:string; state:string; lga:string|null;
  volunteer_area:string; profession:string; specialisation:string|null; qualifications:string|null;
  registration_number:string|null; experience:string|null; availability:string; motivation:string;
  contact_consent:boolean; status:"pending"|"under_review"|"approved"|"declined"|"withdrawn";
  internal_notes:string|null; created_at:string; updated_at:string;
};
const statuses = ["pending","under_review","approved","declined","withdrawn"] as const;

export default function VolunteerApplications({initialApplications,loadError}:{initialApplications:Application[];loadError:string|null}) {
  const router=useRouter();
  const [items,setItems]=useState(initialApplications);
  const [query,setQuery]=useState("");
  const [filter,setFilter]=useState<"all"|Application["status"]>("all");
  const [selected,setSelected]=useState<Application|null>(null);
  const [notes,setNotes]=useState("");
  const [busy,setBusy]=useState<string|null>(null);
  const [feedback,setFeedback]=useState(loadError);
  const counts=useMemo(()=>({all:items.length,pending:items.filter(x=>x.status==="pending").length,under_review:items.filter(x=>x.status==="under_review").length,approved:items.filter(x=>x.status==="approved").length,declined:items.filter(x=>x.status==="declined").length,withdrawn:items.filter(x=>x.status==="withdrawn").length}),[items]);
  const visible=useMemo(()=>{const q=query.trim().toLowerCase();return items.filter(x=>(filter==="all"||x.status===filter)&&(!q||[x.name,x.email,x.phone,x.state,x.lga??"",x.profession,x.volunteer_area].some(v=>v.toLowerCase().includes(q))));},[items,query,filter]);

  async function save(item:Application,status:Application["status"],internal_notes=notes) {
    setBusy(item.id);setFeedback(null);
    try {
      const response=await fetch("/api/admin/volunteers",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:item.id,status,internal_notes})});
      const result=await response.json();if(!response.ok)throw new Error(result.error||"Application could not be updated.");
      setItems(current=>current.map(x=>x.id===item.id?result.item:x));setSelected(result.item);setNotes(result.item.internal_notes??"");router.refresh();
    } catch(error){setFeedback(error instanceof Error?error.message:"Something went wrong.");}
    finally{setBusy(null);}
  }
  function open(item:Application){setSelected(item);setNotes(item.internal_notes??"");if(item.status==="pending")void save(item,"under_review",item.internal_notes??"");}
  return <div className={styles.page}>
    <header className={styles.heading}><div><p className={styles.eyebrow}>COMMUNITY ENGAGEMENT</p><h1>Volunteer Applications</h1><p>Review applications and manage volunteer recruitment decisions.</p></div><button className={styles.refresh} onClick={()=>router.refresh()} type="button"><RefreshCw size={16}/> Refresh</button></header>
    {feedback&&<p className={styles.feedback} role="alert">{feedback}</p>}
    <section className={styles.stats}>{(["all",...statuses] as const).map(key=><button type="button" key={key} onClick={()=>setFilter(key)} className={filter===key?styles.statActive:styles.stat}><span>{key==="all"?"All applications":key.replace("_"," ")}</span><strong>{counts[key]}</strong></button>)}</section>
    <section className={styles.panel}><div className={styles.toolbar}><div><h2>Applications</h2><p>{visible.length} records</p></div><label className={styles.search}><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search applicant, email or profession"/></label></div>
      {visible.length===0?<div className={styles.empty}><Users size={28}/><strong>{items.length?"No matching applications":"No volunteer applications yet"}</strong><p>Applications submitted through the public volunteer form will appear here.</p></div>:<div className={styles.list}>{visible.map(item=><button type="button" className={styles.row} key={item.id} onClick={()=>open(item)}><span className={styles.icon}><Users size={19}/></span><span className={styles.main}><strong>{item.name}</strong><span>{item.volunteer_area} · {item.profession}</span><small>{item.email} · {item.state}</small></span><span className={styles.meta}><span className={styles[item.status]}>{item.status.replace("_"," ")}</span><time>{new Date(item.created_at).toLocaleDateString("en-NG",{dateStyle:"medium"})}</time></span></button>)}</div>}
    </section>
    {selected&&<div className={styles.overlay} onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null);}}><section className={styles.detail} role="dialog" aria-modal="true" aria-labelledby="app-title"><header><div><p className={styles.eyebrow}>VOLUNTEER APPLICATION</p><h2 id="app-title">{selected.name}</h2></div><button className={styles.close} type="button" onClick={()=>setSelected(null)} aria-label="Close"><X/></button></header>
      <div className={styles.fields}>{[["Email",selected.email],["Phone",selected.phone],["Location",[selected.lga,selected.state].filter(Boolean).join(", ")],["Volunteer area",selected.volunteer_area],["Profession",selected.profession],["Specialisation",selected.specialisation],["Qualifications",selected.qualifications],["Professional registration",selected.registration_number],["Availability",selected.availability],["Consent",selected.contact_consent?"Granted":"Not recorded"]].filter((x):x is [string,string]=>Boolean(x[1])).map(([label,value])=><div key={label}><small>{label}</small><strong>{value}</strong></div>)}</div>
      {selected.experience&&<div className={styles.block}><small>Experience</small><p>{selected.experience}</p></div>}<div className={styles.block}><small>Motivation</small><p>{selected.motivation}</p></div>
      <label className={styles.notes}>Internal review notes<textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={4} placeholder="Private notes for the admin team"/></label>
      <div className={styles.actions}><button type="button" className={styles.primary} disabled={busy===selected.id} onClick={()=>void save(selected,selected.status,notes)}><Check size={16}/> Save notes</button>{statuses.filter(s=>s!==selected.status&&s!=="withdrawn").map(s=><button key={s} type="button" className={s==="approved"?styles.approve:styles.secondary} disabled={busy===selected.id} onClick={()=>void save(selected,s,notes)}>{s==="under_review"?"Move to review":s==="approved"?"Approve":s==="declined"?"Decline":"Mark pending"}</button>)}<button type="button" className={styles.secondary} onClick={()=>setSelected(null)}>Close</button></div>
    </section></div>}
  </div>;
}
