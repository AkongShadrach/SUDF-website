import SocialLinks from "../components/SocialLinks";
import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { Linkedin, UserRound } from "lucide-react";

const profileGroups = [
  {
    label: "FOUNDATION LEADERSHIP",
    title: "Leadership",
    description: "Meet the people providing leadership, direction and oversight for the Foundation.",
    count: 2,
  },
  {
    label: "PROGRAMMES & OUTREACH",
    title: "Programme team",
    description: "Discover the people supporting community screening, health education and outreach activities.",
    count: 3,
  },
  {
    label: "OPERATIONS & PARTNERSHIPS",
    title: "Our wider team",
    description: "Meet the people helping coordinate the Foundation's work and relationships with communities and partners.",
    count: 3,
  },
];

export default function TeamPage() {
  return (
    <main className="sudf-team-page">
      <SiteHeader />
      <section className="sudf-team-hero">
        <div className="sudf-team-hero-inner">
          <p className="eyebrow">THE PEOPLE BEHIND THE WORK</p>
          <h1>Meet our team.</h1>
          <p>Get to know the people whose leadership, commitment and service help advance the Sylvester Ujong Diabetes Foundation's work.</p>
          <span className="sudf-team-hero-rule" aria-hidden="true" />
        </div>
        <div className="sudf-team-hero-mark" aria-hidden="true"><UserRound size={76} strokeWidth={1} /></div>
      </section>

      <section className="sudf-team-intro section">
        <div>
          <p className="eyebrow">OUR PEOPLE</p>
          <h2>Working together for healthier communities.</h2>
        </div>
        <div>
          <p>SUDF's work is supported by people who contribute leadership, programme coordination, community engagement and specialist support.</p>
          <p>Individual profiles, official photographs, role descriptions and professional links will be published here as they are confirmed by the Foundation.</p>
        </div>
      </section>

      <section className="sudf-team-groups section" aria-label="SUDF team profile areas">
        <div className="sudf-team-section-heading">
          <p className="eyebrow">MEET THE PEOPLE</p>
          <h2>Our team and leadership</h2>
          <p>Explore the areas of responsibility represented across the Foundation.</p>
        </div>
        <div className="sudf-team-grid">
          {profileGroups.map((group) => (
            <article className="sudf-team-card" key={group.title}>
              <div className="sudf-team-photo-placeholder" aria-label="Team photograph to be added">
                <UserRound size={52} strokeWidth={1.2} aria-hidden="true" />
                <span>PROFILE PHOTO</span>
              </div>
              <div className="sudf-team-card-copy">
                <p className="eyebrow">{group.label}</p>
                <h3>{group.title}</h3>
                <p>{group.description}</p>
                <span className="sudf-team-profile-note">Individual profiles coming soon</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="sudf-team-connect">
        <div>
          <p className="eyebrow light">CONNECT WITH SUDF</p>
          <h2>Interested in working with the Foundation?</h2>
          <p>For enquiries about collaboration, volunteering or working with SUDF, please get in touch with the Foundation.</p>
        </div>
        <Link className="button button-gold" href="/contact">Contact the Foundation <span aria-hidden="true">→</span></Link>
      </section>

      <footer className="footer">
        <div>
          <strong>SYLVESTER UJONG DIABETES FOUNDATION</strong>
          <p>Awareness • Prevention • Education • Support</p>
        </div>
        <div className="footer-links">
          <Link href="/#about">About</Link><Link href="/#mission">Our Mission</Link><Link href="/#programs">Our Work</Link><Link href="/events">Events</Link><Link href="/team">Meet Our Team</Link><Link href="/contact">Contact</Link><Link href="/donate-support">Donate / Support</Link>
        </div>
        <SocialLinks />
        <div className="footer-legal">© SUDF. All rights reserved.</div>
      </footer>
    </main>
  );
}
