"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Pencil, Search, Trash2, X, Upload, Check, RefreshCw } from "lucide-react";

type GalleryItem={id:string;title:string;caption:string|null;image_url:string;storage_path:string|null;category:string;status:"draft"|"published"|"archived";display_order:number;created_at:string};
const inputStyle={width:"100%",boxSizing:"border-box" as const,border:"1px solid #dce4dd",borderRadius:10,padding:"12px 13px",font:"inherit",color:"#203b31",background:"#fff"};
const buttonStyle={display:"inline-flex",alignItems:"center",justifyContent:"center",gap:8,border:"1px solid #244b3b",background:"#244b3b",color:"#fff",borderRadius:999,padding:"11px 16px",fontWeight:700,cursor:"pointer"};
const secondaryStyle={...buttonStyle,background:"#fff",color:"#315343",borderColor:"#dce4dd"};
async function compressGalleryImage(file:File):Promise<File>{
 if(!file.type.startsWith("image/")) return file;
 const url=URL.createObjectURL(file);
 try {
  const image=new Image(); image.src=url;
  await new Promise<void>((resolve,reject)=>{image.onload=()=>resolve();image.onerror=()=>reject(new Error("The browser could not decode "+file.name));});
  const scale=Math.min(1,1800/Math.max(image.naturalWidth,image.naturalHeight));
  const canvas=document.createElement("canvas"); canvas.width=Math.max(1,Math.round(image.naturalWidth*scale)); canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));
  const context=canvas.getContext("2d"); if(!context) return file;
  context.drawImage(image,0,0,canvas.width,canvas.height);
  const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.78)); if(!blob) return file;
  const name=file.name.replace(/\\.[^.]+$/,"")||"gallery-photo";
  return new File([blob],name+".jpg",{type:"image/jpeg",lastModified:Date.now()});
 } finally { URL.revokeObjectURL(url); }
}
export default function GalleryManager({initialItems,loadError}:{initialItems:GalleryItem[];loadError:string|null}) {
 const router=useRouter();
 const [items,setItems]=useState(initialItems);
 const [query,setQuery]=useState("");
 const [editor,setEditor]=useState<GalleryItem|null>(null);
 const [formOpen,setFormOpen]=useState(false);
 const [title,setTitle]=useState(""); const [caption,setCaption]=useState(""); const [category,setCategory]=useState("outreach");
 const [status,setStatus]=useState<"draft"|"published"|"archived">("draft"); const [order,setOrder]=useState("0");
 const [files,setFiles]=useState<File[]>([]); const [busy,setBusy]=useState(false); const [notice,setNotice]=useState(loadError);
 const visible=useMemo(()=>{const q=query.trim().toLowerCase();return items.filter(x=>!q||[x.title,x.caption??"",x.category,x.status].some(v=>v.toLowerCase().includes(q)));},[items,query]);
 function reset(){setFormOpen(false);setEditor(null);setTitle("");setCaption("");setCategory("outreach");setStatus("draft");setOrder("0");setFiles([]);}
 function edit(item:GalleryItem){setFormOpen(true);setEditor(item);setTitle(item.title);setCaption(item.caption??"");setCategory(item.category);setStatus(item.status);setOrder(String(item.display_order));setFiles([]);setNotice(null);}
 async function save(e:FormEvent<HTMLFormElement>){e.preventDefault();setBusy(true);setNotice(null);
 try{
  let response:Response;
  if(editor){response=await fetch("/api/admin/gallery",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:editor.id,title,caption,category,status,display_order:Number(order)||0})});}
  else {const form=new FormData();form.set("title",title);form.set("caption",caption);form.set("category",category);form.set("status",status);form.set("display_order",order);for(const selected of files){const compressed=await compressGalleryImage(selected);form.append("images",compressed,compressed.name);}response=await fetch("/api/admin/gallery",{method:"POST",body:form});}
  const result=await response.json();if(!response.ok)throw new Error(result.error||"Gallery item could not be saved.");
  if(editor)setItems(current=>current.map(x=>x.id===editor.id?result.item:x));else setItems(current=>[...(result.items??[result.item]).slice().reverse(),...current]);
  reset();setNotice(editor?"Gallery item updated.":"Image uploaded and added to the gallery.");router.refresh();
 }catch(err){setNotice(err instanceof Error?err.message:"Something went wrong.");}finally{setBusy(false);}
 }
 async function remove(item:GalleryItem){if(!window.confirm(`Delete "${item.title}" and its stored image?`))return;setBusy(true);setNotice(null);try{const response=await fetch("/api/admin/gallery",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:item.id})});const result=await response.json();if(!response.ok)throw new Error(result.error||"Delete failed.");setItems(current=>current.filter(x=>x.id!==item.id));setNotice("Gallery item deleted.");router.refresh();}catch(err){setNotice(err instanceof Error?err.message:"Something went wrong.");}finally{setBusy(false);}}
 return <div style={{display:"grid",gap:22,color:"#203b31"}}>
  <header style={{display:"flex",justifyContent:"space-between",alignItems:"end",gap:14,flexWrap:"wrap"}}><div><p style={{fontSize:".7rem",fontWeight:800,letterSpacing:".2em",color:"#9b8b4c",margin:0}}>MEDIA MANAGEMENT</p><h1 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(2rem,4vw,2.8rem)",margin:"8px 0"}}>Gallery &amp; Partners</h1><p style={{color:"#748078",margin:0}}>Upload outreach photos, add captions and control what appears publicly.</p></div><button type="button" style={buttonStyle} onClick={()=>{reset();setFormOpen(true);setNotice(null);}}><ImagePlus size={17}/> Upload photo</button></header>
  {notice&&<p role="status" style={{padding:12,borderRadius:12,background:notice.toLowerCase().includes("could not")||notice.toLowerCase().includes("failed")?"#fff1ef":"#edf5ee",color:notice.toLowerCase().includes("could not")||notice.toLowerCase().includes("failed")?"#a52c22":"#286342",margin:0}}>{notice}</p>}
  <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))",gap:12}}>{[["Total photos",items.length],["Published",items.filter(x=>x.status==="published").length],["Drafts",items.filter(x=>x.status==="draft").length]].map(([label,value])=><div key={label} style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:16,padding:18}}><span style={{color:"#748078"}}>{label}</span><strong style={{display:"block",fontSize:"1.8rem"}}>{value}</strong></div>)}</div>
  {formOpen?<section style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:20,display:"grid",gap:14}}><header style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0}}>{editor?"Edit gallery item":"Upload a gallery photo"}</h2><button type="button" aria-label="Close editor" onClick={reset} style={secondaryStyle}><X size={16}/></button></header><form onSubmit={save} style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:13}}>
   <label style={{display:"grid",gap:6}}>Title *<input required value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle}/></label>
   <label style={{display:"grid",gap:6}}>Category<select value={category} onChange={e=>setCategory(e.target.value)} style={inputStyle}><option value="outreach">Outreach</option><option value="screening">Screening</option><option value="education">Education</option><option value="events">Events</option><option value="community">Community</option><option value="other">Other</option></select></label>
   <label style={{display:"grid",gap:6}}>Caption<textarea rows={3} value={caption} onChange={e=>setCaption(e.target.value)} style={inputStyle}/></label>
   <label style={{display:"grid",gap:6}}>Display order<input type="number" value={order} onChange={e=>setOrder(e.target.value)} style={inputStyle}/></label>
   <label style={{display:"grid",gap:6}}>Publishing status<select value={status} onChange={e=>setStatus(e.target.value as typeof status)} style={inputStyle}><option value="draft">Draft</option><option value="published">Published</option><option value="archived">Archived</option></select></label>
   {!editor&&<div style={{gridColumn:"1/-1",display:"grid",gap:10}}><label style={{display:"grid",gap:6}}>Select photographs *<input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" onChange={e=>{const picked=Array.from(e.target.files??[]);setFiles(current=>[...current,...picked].slice(0,12));e.currentTarget.value="";}} style={inputStyle}/><small style={{color:"#748078"}}>Select up to 12 photographs. You can remove individual photos before uploading. All selected photos share the title, caption, category and status above.</small></label>{files.length>0&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(112px,1fr))",gap:10}}>{files.map((selected,index)=><div key={selected.name+"-"+selected.lastModified+"-"+index} style={{position:"relative",border:"1px solid #e5e8e2",borderRadius:12,overflow:"hidden"}}><img src={URL.createObjectURL(selected)} alt={selected.name} style={{display:"block",width:"100%",height:92,objectFit:"cover"}}/><button type="button" aria-label={"Remove "+selected.name} onClick={()=>setFiles(current=>current.filter((_,i)=>i!==index))} style={{position:"absolute",top:5,right:5,width:28,height:28,border:0,borderRadius:"50%",background:"#fff",color:"#a52c22",display:"grid",placeItems:"center"}}><X size={16}/></button><small style={{display:"block",padding:6,fontSize:".7rem",overflowWrap:"anywhere"}}>{selected.name}</small></div>)}</div>}<small>{files.length} of 12 photographs selected</small></div>}
   {editor&&<div style={{display:"flex",gap:12,alignItems:"center"}}><img src={editor.image_url} alt={editor.title} style={{width:100,height:76,objectFit:"cover",borderRadius:10}}/><span style={{fontSize:".85rem",color:"#748078"}}>Current image. To replace it, delete this item and upload the new photo.</span></div>}
   <div style={{gridColumn:"1/-1",display:"flex",gap:9,flexWrap:"wrap"}}><button type="submit" disabled={busy||(!editor&&files.length===0)} style={{...buttonStyle,opacity:busy?.65:1}}>{busy?<RefreshCw size={16}/>:editor?<Check size={16}/>:<Upload size={16}/>} {busy?"Saving…":editor?"Save changes":"Upload "+files.length+" photos"}</button><button type="button" style={secondaryStyle} onClick={reset}>Cancel</button></div>
  </form></section>:null}
  <section style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",gap:12,flexWrap:"wrap",marginBottom:14}}><div><h2 style={{margin:"0 0 4px"}}>Gallery photos</h2><p style={{margin:0,color:"#748078"}}>{visible.length} of {items.length} photos</p></div><label style={{display:"flex",gap:8,alignItems:"center",border:"1px solid #dce4dd",borderRadius:999,padding:"10px 13px",color:"#748078"}}><Search size={16}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search gallery" style={{border:0,outline:0,minWidth:0,width:160,font:"inherit"}}/></label></div>
   {!visible.length?<div style={{textAlign:"center",padding:36,color:"#748078"}}><ImagePlus size={28}/><p>{items.length?"No matching photos.":"No gallery photos have been added yet."}</p><button type="button" style={secondaryStyle} onClick={()=>{reset();setFormOpen(true);}}>Add your first photo</button></div>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>{visible.map(item=><article key={item.id} style={{border:"1px solid #edf0eb",borderRadius:14,overflow:"hidden"}}><img src={item.image_url} alt={item.title} style={{width:"100%",height:145,objectFit:"cover"}}/><div style={{padding:12,display:"grid",gap:7}}><strong>{item.title}</strong>{item.caption&&<p style={{margin:0,fontSize:".82rem",color:"#748078"}}>{item.caption}</p>}<small style={{color:"#748078"}}>{item.category} · {item.status} · Order {item.display_order}</small><div style={{display:"flex",gap:8}}><button type="button" style={secondaryStyle} onClick={()=>edit(item)}><Pencil size={15}/> Edit</button><button type="button" aria-label={`Delete ${item.title}`} style={{...secondaryStyle,color:"#a52c22"}} disabled={busy} onClick={()=>void remove(item)}><Trash2 size={15}/></button></div></div></article>)}</div>}
  </section>
 </div>;
}
