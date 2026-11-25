import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPartnersAdminPage() {
  const supabase = createAdminServiceClient();
  const [{data:gallery,error:galleryError},{data:partners,error:partnersError}] = await Promise.all([
    supabase.from("gallery_items").select("id,title,caption,image_url,category,status,display_order,created_at").order("display_order",{ascending:true}).order("created_at",{ascending:false}),
    supabase.from("partners").select("id,name,description,website_url,logo_url,status,display_order,created_at").order("display_order",{ascending:true}).order("created_at",{ascending:false})
  ]);
  const card={background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:20};
  return <section style={{display:"grid",gap:22,color:"#203b31"}}>
    <header><p style={{fontSize:".7rem",fontWeight:800,letterSpacing:".2em",color:"#9b8b4c"}}>MEDIA MANAGEMENT</p><h1 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(2rem,4vw,2.8rem)",margin:"8px 0"}}>Gallery &amp; Partners</h1><p style={{color:"#748078"}}>Review outreach photos and the organisations partnering with SUDF.</p></header>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(220px,1fr))",gap:14}}>
      <div style={card}><p style={{margin:0,color:"#748078"}}>Gallery items</p><strong style={{fontSize:"2rem"}}>{gallery?.length??0}</strong></div>
      <div style={card}><p style={{margin:0,color:"#748078"}}>Partners</p><strong style={{fontSize:"2rem"}}>{partners?.length??0}</strong></div>
    </div>
    {galleryError&&<p role="alert" style={{color:"#a52c22"}}>Gallery records could not be loaded: {galleryError.message}</p>}
    <section style={card}><h2 style={{marginTop:0}}>Gallery</h2>{!gallery?.length?<p style={{color:"#748078"}}>No gallery photos have been added yet.</p>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:14}}>{gallery.map(item=><article key={item.id} style={{border:"1px solid #edf0eb",borderRadius:12,overflow:"hidden"}}><img src={item.image_url} alt={item.title} style={{width:"100%",height:130,objectFit:"cover"}}/><div style={{padding:12}}><strong>{item.title}</strong><p style={{fontSize:".8rem",color:"#748078"}}>{item.category} · {item.status}</p></div></article>)}</div>}</section>
    {partnersError&&<p role="alert" style={{color:"#a52c22"}}>Partner records could not be loaded: {partnersError.message}</p>}
    <section style={card}><h2 style={{marginTop:0}}>Partners</h2>{!partners?.length?<p style={{color:"#748078"}}>No partners have been added yet.</p>:<div style={{display:"grid",gap:0}}>{partners.map((partner,index)=><div key={partner.id} style={{display:"flex",alignItems:"center",gap:14,padding:"13px 0",borderBottom:index===partners.length-1?0:"1px solid #edf0eb"}}>{partner.logo_url&&<img src={partner.logo_url} alt="" style={{width:48,height:48,objectFit:"contain"}}/>}<div><strong>{partner.name}</strong><p style={{margin:"4px 0",fontSize:".82rem",color:"#748078"}}>{partner.status}{partner.website_url? ` · ${partner.website_url}`:""}</p></div></div>)}</div>}</section>
    <p style={{fontSize:".85rem",color:"#748078"}}>This route currently provides a live inventory of existing gallery and partner records. Upload, edit and publish controls are the next implementation step.</p>
  </section>;
}
