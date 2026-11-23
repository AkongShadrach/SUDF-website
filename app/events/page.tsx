import SocialLinks from "../../components/SocialLinks";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";

export default function EventsPage() {
  return (
    <main className="sudf-events-page">
      <SiteHeader />
      <section className="sudf-events-hero">
        <div className="sudf-events-hero-inner">
          <p className="eyebrow">EVENTS & COMMUNITY ACTIVITIES</p>
          <h1>Community activities and opportunities to participate.</h1>
          <p>Find updates about SUDF events, community outreach and opportunities to take part in the Foundation's work.</p>
        </div>
      </section>
      <section className="sudf-events-empty section">
        <span className="sudf-events-empty-mark" aria-hidden="true">SUDF</span>
        <div>
          <p className="eyebrow">EVENT UPDATES</p>
          <h2>Event information will be published here.</h2>
          <p>There are no event announcements to display at the moment. Please check back for verified dates, locations and participation details.</p>
          <Link className="button button-gold" href="/contact">Contact the Foundation →</Link>
        </div>
      </section>
      <section className="sudf-events-programmes">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EXPLORE OUR WORK</p>
            <h2>Learn about SUDF's programmes.</h2>
          </div>
          <p>Explore the Foundation's programme areas while event announcements are being prepared.</p>
        </div>
        <div className="sudf-events-programme-links">
          <Link href="/programmes/community-diabetes-screening">Community Diabetes Screening <span>Explore programme →</span></Link>
          <Link href="/programmes/health-education-outreach">Health Education & Outreach <span>Explore programme →</span></Link>
          <Link href="/programmes/medical-outreach-partnerships">Medical Outreach & Partnerships <span>Explore programme →</span></Link>
        </div>
      </section>
      <footer className="support-footer sudf-programme-footer">
        <div><strong>SYLVESTER UJONG DIABETES FOUNDATION</strong><p>Awareness · Prevention · Education · Support</p></div>
        <nav aria-label="Footer navigation"><Link href="/#about">About</Link><Link href="/#programmes">Programmes</Link><Link href="/events">Events</Link><Link href="/donate-support">Donate / Support</Link><Link href="/contact">Contact</Link></nav>
        <SocialLinks />
        <span>© 2026 Sylvester Ujong Diabetes Foundation. All rights reserved.</span>
      </footer>
    </main>
  );
}
