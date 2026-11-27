import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, HeartPulse, Search, ShieldCheck, Stethoscope } from "lucide-react";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { educationArticles } from "./education-data";

export const metadata: Metadata = {
  title: "Diabetes Education | SUDF Knowledge Centre",
  description: "Clear, practical information about diabetes, prevention, early detection and living well from the Sylvester Ujong Diabetes Foundation.",
};

const topics = [
  { title: "Diabetes basics", description: "Understand diabetes and its main types.", icon: BookOpen },
  { title: "Early detection", description: "Recognise symptoms and learn about screening.", icon: Search },
  { title: "Prevention", description: "Explore risk factors and healthier everyday habits.", icon: HeartPulse },
  { title: "Care and wellbeing", description: "Learn about ongoing care and support.", icon: Stethoscope },
];

export default function EducationPage() {
  return (
    <main className="education-page">
      <SiteHeader />
      <section className="education-hero">
        <div className="education-hero-inner">
          <p className="eyebrow light">SUDF KNOWLEDGE CENTRE</p>
          <h1>Understand diabetes<br /><span>Make informed choices</span></h1>
          <p>Clear, practical information to support diabetes awareness, prevention, early detection and care.</p>
          <a className="button button-gold" href="#education-library">Explore the knowledge centre ↓</a>
        </div>
      </section>

      <section className="education-topics section">
        <div className="education-section-heading">
          <div><p className="eyebrow">EXPLORE BY TOPIC</p><h2>Knowledge for every step</h2></div>
          <p>Start with the topic that matters to you. Each guide is written in plain language and includes links to trusted health information.</p>
        </div>
        <div className="education-topic-grid">
          {topics.map(({title,description,icon:Icon}) => (
            <article className="education-topic-card" key={title}>
              <span className="education-topic-icon"><Icon size={23} aria-hidden="true" /></span>
              <h3>{title}</h3><p>{description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="education-library section" id="education-library">
        <div className="education-section-heading">
          <div><p className="eyebrow">LEARNING LIBRARY</p><h2>Explore diabetes education</h2></div>
          <p>{educationArticles.length} introductory guides to help you learn at your own pace.</p>
        </div>
        <div className="education-article-grid">
          {educationArticles.map((article,index) => (
            <Link className="education-article-card" href={`/education/${article.slug}`} key={article.slug}>
              <span className="education-article-number">{String(index+1).padStart(2,"0")}</span>
              <span className="education-article-category">{article.category}</span>
              <h3>{article.title}</h3>
              <p>{article.summary}</p>
              <span className="education-article-meta">{article.readingTime} <span aria-hidden="true">→</span></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="education-trust">
        <div><ShieldCheck size={30} aria-hidden="true" /><p className="eyebrow light">INFORMATION YOU CAN CHECK</p><h2>Learn from reliable sources</h2><p>Our introductory guides link to recognised health organisations. They are for general education and do not replace personal medical advice, diagnosis or treatment.</p><a href="https://www.who.int/news-room/fact-sheets/detail/diabetes" target="_blank" rel="noreferrer">Visit the World Health Organization →</a></div>
      </section>
      <SiteFooter />
    </main>
  );
}
