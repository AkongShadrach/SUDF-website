import Link from "next/link";
import SiteHeader from "../../../components/SiteHeader";
import SiteFooter from "../../../components/SiteFooter";
import { createAdminServiceClient } from "../../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function FieldStoriesIndexPage() {
  const supabase = createAdminServiceClient();
  const { data: stories } = await supabase.from("field_stories").select("id,title,slug,excerpt,activity_date,venue,lga,state,activity_type,cover_image_url,people_reached,people_screened").eq("status", "published").order("activity_date", { ascending: false });
  return (
    <main className="sudf-field-story-page">
      <SiteHeader />
      <section className="section sudf-field-index">
        <p className="eyebrow">FROM THE FIELD</p>
        <h1>Stories from our communities</h1>
        <p className="sudf-field-index-intro">Explore SUDF outreach activities, diabetes screening, health education and the people and communities behind the work.</p>
        <div className="sudf-field-index-grid">
          {(stories ?? []).map(story => (
            <Link href={"/field-stories/" + story.slug} className="sudf-field-index-card" key={story.id}>
              <img src={story.cover_image_url} alt={story.title} />
              <div><p className="sudf-field-date">{new Date(story.activity_date + "T12:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "long", year: "numeric" })} · {[story.venue, story.lga, story.state].filter(Boolean).join(", ") || story.activity_type}</p><h2>{story.title}</h2><p>{story.excerpt}</p><span>Read the full story →</span></div>
            </Link>
          ))}
          {(!stories || stories.length === 0) && <div className="sudf-field-empty"><h2>Field stories are coming soon</h2><p>SUDF's community activities and outreach stories will appear here as they are published.</p></div>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
