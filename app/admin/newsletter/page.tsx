import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewsletterAdminPage() {
  const supabase = createAdminServiceClient();
  const {data:subscribers,error}=await supabase.from("newsletter_subscribers").select("id,email,status,created_at").order("created_at",{ascending:false}).limit(500);
  const active=(subscribers??[]).filter(item=>item.status==="active").length;
  const inactive=(subscribers??[]).length-active;
  return <section style={{display:"grid",gap:22,color:"#203b31"}}>
    <header><p style={{fontSize:".7rem",fontWeight:800,letterSpacing:".2em",color:"#9b8b4c"}}>AUDIENCE MANAGEMENT</p><h1 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(2rem,4vw,2.8rem)",margin:"8px 0"}}>Newsletter</h1><p style={{color:"#748078"}}>Review people who have subscribed to SUDF email updates.</p></header>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:14}}>{[["Total subscribers",subscribers?.length??0],["Active",active],["Other statuses",inactive]].map(([label,value])=><div key={label} style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:16,padding:18}}><p style={{margin:0,color:"#748078"}}>{label}</p><strong style={{fontSize:"2rem"}}>{value}</strong></div>)}</div>
    {error?<p role="alert" style={{color:"#a52c22"}}>Subscribers could not be loaded: {error.message}</p>:!subscribers?.length?<div style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:28,color:"#748078"}}>No newsletter subscribers have been recorded yet.</div>:<div style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:18,overflowX:"auto"}}><h2 style={{marginTop:0}}>Subscriber list</h2><table style={{width:"100%",borderCollapse:"collapse",textAlign:"left"}}><thead><tr><th style={{padding:12}}>Email</th><th style={{padding:12}}>Status</th><th style={{padding:12}}>Subscribed</th></tr></thead><tbody>{subscribers.map(item=><tr key={item.id} style={{borderTop:"1px solid #edf0eb"}}><td style={{padding:12}}>{item.email}</td><td style={{padding:12}}>{item.status}</td><td style={{padding:12}}>{new Date(item.created_at).toLocaleDateString("en-NG",{dateStyle:"medium"})}</td></tr>)}</tbody></table></div>}
    <p style={{fontSize:".85rem",color:"#748078"}}>This page currently provides a live subscriber list. Campaign composition, sending and unsubscribe management are not yet connected.</p>
  </section>;
}
