import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

const programmes = {
  "community-diabetes-screening": {
    number: "01",
    category: "SCREENING & EARLY DETECTION",
    title: "Community Diabetes Screening",
    introduction: "Early detection can save lives. SUDF takes diabetes screening directly into communities, helping individuals understand their blood glucose status and identify potential risks before serious complications develop.",
    focusTitle: "What this programme focuses on",
    focus: [
      "Taking diabetes screening directly into communities.",
      "Helping individuals understand their blood glucose status.",
      "Supporting awareness of potential diabetes risks and the importance of early detection."
    ]
  },
  "health-education-outreach": {
    number: "02",
    category: "AWARENESS & PREVENTION",
    title: "Health Education & Outreach",
    introduction: "Prevention begins with knowledge. Through seminars, outreach programmes, community engagements, and public health campaigns, SUDF provides practical information about nutrition, physical activity, healthy lifestyles, diabetes risk factors, and disease management.",
    focusTitle: "What this programme focuses on",
    focus: [
      "Diabetes awareness and prevention.",
      "Practical information about nutrition and physical activity.",
      "Healthy lifestyles, diabetes risk factors and disease management.",
      "Seminars, outreach programmes, community engagements and public health campaigns."
    ]
  },
  "medical-outreach-partnerships": {
    number: "03",
    category: "COLLABORATION & ACCESS",
    title: "Medical Outreach & Partnerships",
    introduction: "SUDF collaborates with healthcare professionals, hospitals, clinics, community organisations, volunteers, development partners, and other stakeholders to expand access to diabetes services and strengthen community health systems.",
    focusTitle: "How this area of work is approached",
    focus: [
      "Collaboration with healthcare professionals, hospitals and clinics.",
      "Engagement with community organisations and volunteers.",
      "Working with development partners and other stakeholders.",
      "Expanding access to diabetes services and strengthening community health systems."
    ]
  }
} as const;

type ProgrammeSlug = keyof typeof programmes;

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

  const legacyProgramme = programmes[slug as ProgrammeSlug];
  const programme = databaseProgramme
    ? {
        number: "SUDF",
        category: "SUDF PROGRAMME",
        title: databaseProgramme.title,
        introduction: databaseProgramme.summary || databaseProgramme.description || "Learn more about this programme and its work with communities.",
        focusTitle: "About this programme",
        focus: databaseProgramme.description && databaseProgramme.summary
          ? [databaseProgramme.description]
          : ["Contact the Foundation to learn more about this programme."],
      }
    : legacyProgramme;
  if (!programme) return null;

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
