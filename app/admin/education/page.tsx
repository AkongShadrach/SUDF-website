import Link from "next/link";
import { educationArticles } from "../../education/education-data";

export const dynamic = "force-dynamic";

export default function KnowledgeCentreAdminPage() {
  return <section style={{display:"grid",gap:22,color:"#203b31"}}>
    <header><p style={{fontSize:".7rem",fontWeight:800,letterSpacing:".2em",color:"#9b8b4c"}}>EDUCATION CONTENT</p><h1 style={{fontFamily:"Georgia,serif",fontWeight:500,fontSize:"clamp(2rem,4vw,2.8rem)",margin:"8px 0"}}>Knowledge Centre</h1><p style={{color:"#748078"}}>Review the learning guides currently published in the SUDF Knowledge Centre.</p></header>
    <div style={{display:"flex",gap:12,flexWrap:"wrap"}}><span style={{background:"#f1f5ee",padding:"12px 16px",borderRadius:12}}><strong>{educationArticles.length}</strong> learning guides</span><Link href="/education" target="_blank" style={{color:"#315343",fontWeight:700,padding:12}}>View public Knowledge Centre ↗</Link></div>
    <div style={{background:"#fff",border:"1px solid #e5e8e2",borderRadius:18,padding:18,display:"grid",gap:0}}>
      {educationArticles.map((article,index)=><div key={article.slug} style={{display:"flex",justifyContent:"space-between",gap:16,alignItems:"center",padding:"16px 4px",borderBottom:index===educationArticles.length-1?0:"1px solid #edf0eb"}}>
        <div><strong>{article.title}</strong><p style={{margin:"5px 0 0",color:"#748078",fontSize:".85rem"}}>{article.category} · {article.readingTime}</p><small style={{color:"#89938c"}}>{article.summary}</small></div>
        <Link href={`/education/${article.slug}`} target="_blank" style={{color:"#315343",fontWeight:700,whiteSpace:"nowrap"}}>Preview ↗</Link>
      </div>)}
    </div>
    <p style={{fontSize:".85rem",color:"#748078"}}>These guides are currently maintained in the website's education content files. This page provides an inventory and preview; editing and publishing controls are not yet connected.</p>
  </section>;
}
