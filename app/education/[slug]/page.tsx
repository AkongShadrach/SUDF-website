import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock3, ExternalLink } from "lucide-react";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { educationArticles, getEducationArticle } from "../education-data";

export function generateStaticParams() {
  return educationArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{slug:string}> }): Promise<Metadata> {
  const {slug}=await params;
  const article=getEducationArticle(slug);
  return { title: article ? `${article.title} | SUDF Knowledge Centre` : "Education | SUDF", description: article?.summary };
}

export default async function EducationArticlePage({params}:{params:Promise<{slug:string}>}) {
  const {slug}=await params;
  const article=getEducationArticle(slug);
  if(!article) notFound();

  return (
    <main className="education-page">
      <SiteHeader />
      <section className="education-article-hero">
        <div className="education-article-hero-inner">
          <Link className="education-back-link" href="/education"><ArrowLeft size={16}/> Knowledge Centre</Link>
          <p className="eyebrow light">{article.category}</p>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <span className="education-article-readtime"><Clock3 size={15}/>{article.readingTime}</span>
        </div>
      </section>
      <article className="education-reading section">
        <div className="education-reading-content">
          {article.sections.map((section,index)=>(
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs?.map((paragraph,i)=><p key={i}>{paragraph}</p>)}
              {section.bullets && <ul>{section.bullets.map((item,i)=><li key={i}>{item}</li>)}</ul>}
            </section>
          ))}
          <aside className="education-disclaimer"><strong>Important health information</strong><p>This article is for general education. It does not provide a diagnosis or replace advice from a qualified health professional. Seek professional care for personal health concerns and urgent medical help for severe or rapidly worsening symptoms.</p></aside>
          <section className="education-sources"><h2>Trusted sources and further reading</h2>{article.sources.map(source=><a href={source.url} key={source.url} target="_blank" rel="noreferrer">{source.label}<ExternalLink size={15}/></a>)}</section>
          <Link className="education-back-bottom" href="/education">← Back to all education topics</Link>
        </div>
        <aside className="education-reading-aside"><p className="eyebrow">KEEP LEARNING</p><h3>Explore another topic.</h3>{educationArticles.filter(item=>item.slug!==article.slug).slice(0,4).map(item=><Link href={`/education/${item.slug}`} key={item.slug}>{item.title}<span>→</span></Link>)}</aside>
      </article>
      <SiteFooter />
    </main>
  );
}
