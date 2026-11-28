import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, CalendarDays, UsersRound, HeartPulse } from "lucide-react";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type StoryImage = { url: string; path: string; alt?: string };
type FieldStory = {
  title: string; slug: string; excerpt: string; body: string; activity_date: string;
  venue: string | null; lga: string | null; state: string | null; activity_type: string;
  cover_image_url: string; gallery_images: StoryImage[]; people_reached: number | null;
  people_screened: number | null; impact_notes: string | null; partners: string[]; published_at: string | null;
};

function formatDate(value: string) {
  return new Date(value + "T12:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" });
}

export default async function FieldStoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = createAdminServiceClient();
  const { data } = await supabase.from("field_stories").select("*").eq("slug", slug).eq("status", "published").maybeSingle();
  if (!data) notFound();
  const story = data as FieldStory;
  const location = [story.venue, story.lga, story.state].filter(Boolean).join(", ");

  return (
    <main className="sudf-field-story-page">
      <SiteHeader />
      <article className="sudf-field-story">
        <Link href="/#from-the-field" className="sudf-field-back"><ArrowLeft size={16} /> Back to SUDF in Action</Link>
        <header className="sudf-field-story-header">
          <p className="eyebrow">SUDF IN ACTION · {story.activity_type.toUpperCase()}</p>
          <h1>{story.title}</h1>
          <div className="sudf-field-story-meta">
            <span><CalendarDays size={16} />{formatDate(story.activity_date)}</span>
            {location && <span><MapPin size={16} />{location}</span>}
          </div>
          <p className="sudf-field-story-excerpt">{story.excerpt}</p>
        </header>
        <figure className="sudf-field-cover">
          <img src={story.cover_image_url} alt={story.title} />
        </figure>
        <div className="sudf-field-story-content">
          <div className="sudf-field-report">
            <p className="eyebrow">THE FIELD REPORT</p>
            {story.body.split(/\n\s*\n/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          </div>
          {(story.people_reached !== null || story.people_screened !== null || story.impact_notes) && (
            <section className="sudf-field-impact">
              <p className="eyebrow">ACTIVITY HIGHLIGHTS</p>
              <div className="sudf-field-impact-grid">
                {story.people_reached !== null && <div><UsersRound size={22}/><strong>{story.people_reached.toLocaleString("en-NG")}</strong><span>People reached</span></div>}
                {story.people_screened !== null && <div><HeartPulse size={22}/><strong>{story.people_screened.toLocaleString("en-NG")}</strong><span>People screened</span></div>}
              </div>
              {story.impact_notes && <ul className="sudf-field-impact-notes">{story.impact_notes.split(/\\r?\\n/).map(line => line.trim()).filter(Boolean).map((line, index) => <li key={index}>{line.replace(/^[•·\\-]+\\s*/, "")}</li>)}</ul>}
            </section>
          )}
          {story.partners?.length > 0 && <section className="sudf-field-partners"><p className="eyebrow">PARTNERS & COLLABORATORS</p><p>{story.partners.join(" · ")}</p></section>}
          {story.gallery_images?.length > 0 && <section className="sudf-field-photo-gallery"><p className="eyebrow">MOMENTS FROM THE ACTIVITY</p><h2>In pictures</h2><div>{story.gallery_images.map((image, index) => <figure key={image.path || image.url}><img src={image.url} alt={image.alt || `${story.title} — photograph ${index + 1}`} /></figure>)}</div></section>}
        </div>
        <div className="sudf-field-story-cta"><p className="eyebrow light">SUPPORT OUR WORK</p><h2>Help us take healthier communities further</h2><p>Support diabetes awareness, prevention, screening and community outreach.</p><Link href="/donate-support" className="button button-gold">Support SUDF</Link></div>
      </article>
      <SiteFooter />
    </main>
  );
}
