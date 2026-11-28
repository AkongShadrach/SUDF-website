import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";

export default async function ProgrammeDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminServiceClient();
  const { data: databaseProgramme } = await supabase
    .from("programs")
    .select("title,slug,summary,description,status")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (!databaseProgramme) notFound();
  const programme = {
    number: "SUDF",
    category: "SUDF PROGRAMME",
    title: databaseProgramme.title,
    introduction: databaseProgramme.summary || databaseProgramme.description || "Learn more about this programme and its work with communities.",
    focusTitle: "About this programme",
    focus: databaseProgramme.description && databaseProgramme.summary
      ? [databaseProgramme.description]
      : ["Contact the Foundation to learn more about this programme."],
  };

  return (
    <main className="sudf-programme-page">
      <SiteHeader />
      <section className="sudf-programme-hero">
        <div className="sudf-programme-hero-inner">
          <p className="eyebrow light">{programme.category}</p>
          <span className="sudf-programme-number">{programme.number}</span>
          <h1>{programme.title}</h1>
          <p className="sudf-programme-intro">{programme.introduction}</p>
        </div>
      </section>
      <section className="sudf-programme-content section">
        <div className="sudf-programme-content-heading">
          <p className="eyebrow">ABOUT THIS PROGRAMME</p>
          <h2>{programme.focusTitle}</h2>
          <p>The information below describes the Foundation's stated programme focus. Specific activity dates, locations and participation arrangements can be confirmed directly with SUDF.</p>
        </div>
        <div className="sudf-programme-focus-list">
          {programme.focus.map((item, index) => (
            <article className="sudf-programme-focus-item" key={item}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{item}</p>
            </article>
          ))}
        </div>
      </section>
      <section className="sudf-programme-next">
        <p className="eyebrow light">CONNECT WITH SUDF</p>
        <h2>Would you like to learn more or discuss participation?</h2>
        <p>Contact the Foundation to enquire about this area of work and current opportunities.</p>
        <Link className="button button-gold" href="/contact">Contact the Foundation →</Link>
      </section>
      <SiteFooter />
    </main>
  );
}
