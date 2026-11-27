import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import SiteFooter from "../../components/SiteFooter";
import { createAdminServiceClient } from "../../utils/supabase/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  const supabase = createAdminServiceClient();
  const [{ data: publishedEvents }, { data: publishedProgrammes }] = await Promise.all([
    supabase.from("events").select("id,title,slug,description,starts_at,ends_at,location,registration_url,status").eq("status", "published").order("starts_at", { ascending: true }),
    supabase.from("programs").select("id,title,slug").eq("status", "published").order("created_at", { ascending: true }),
  ]);

  return (
    <main className="sudf-events-page">
      <SiteHeader />
      <section className="sudf-events-hero">
        <div className="sudf-events-hero-inner">
          <p className="eyebrow">EVENTS & COMMUNITY ACTIVITIES</p>
          <h1>Community activities and opportunities to participate</h1>
          <p>Find updates about SUDF events, community outreach and opportunities to take part in the Foundation's work.</p>
        </div>
      </section>
            <section className="section sudf-events-list">
        {publishedEvents && publishedEvents.length > 0 ? (
          <div className="event-grid sudf-programme-cards">
            {publishedEvents.map((event) => (
              <article className="event-card sudf-programme-card" key={event.id}>
                <div>
                  <p className="event-no">SUDF EVENT</p>
                  <h2>{event.title}</h2>
                  <p>{event.description || "Contact the Foundation for more information about this event."}</p>
                  {event.starts_at ? <p>{new Date(event.starts_at).toLocaleString("en-NG", { dateStyle: "long", timeStyle: "short" })}</p> : null}
                  {event.location ? <p>{event.location}</p> : null}
                  {event.registration_url ? <a href={event.registration_url} target="_blank" rel="noreferrer">Register / Learn more →</a> : null}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="sudf-events-empty">
            <span className="sudf-events-empty-mark" aria-hidden="true">SUDF</span>
            <div>
              <p className="eyebrow">EVENT UPDATES</p>
              <h2>Event information will be published here</h2>
              <p>There are no event announcements to display at the moment. Please check back for verified dates, locations and participation details.</p>
              <Link className="button button-gold" href="/contact">Contact the Foundation →</Link>
            </div>
          </div>
        )}
      </section>
      <section className="sudf-events-programmes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE OUR WORK</p>
            <h2>Learn about SUDF's programmes</h2>
          </div>
          <p>Explore the Foundation's programme areas while event announcements are being prepared.</p>
        </div>
                <div className="sudf-events-programme-links">
          {(publishedProgrammes ?? []).map((programme) => (
            <Link key={programme.id} href={"/programmes/" + programme.slug}>{programme.title} <span>Explore programme →</span></Link>
          ))}
          {(!publishedProgrammes || publishedProgrammes.length === 0) ? <p>Programme information will appear here when published.</p> : null}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
