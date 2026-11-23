import type { CSSProperties } from "react";
import SocialLinks from "../../components/SocialLinks";
import SiteHeader from "../../components/SiteHeader";
import VolunteerForm from "./VolunteerForm";

const areas = [
  { title: "Medical and clinical services", description: "For appropriately qualified healthcare professionals supporting clinical activities within their scope of practice.", accent: "#c9a227" },
  { title: "Nursing and patient support", description: "For nurses and care professionals interested in appropriate patient guidance and support.", accent: "#376b51" },
  { title: "Community health education", description: "Help share practical, approved information about diabetes awareness, prevention and healthy living.", accent: "#356c8c" },
  { title: "Outreach and screening assistance", description: "Support community mobilisation and the practical coordination of outreach activities.", accent: "#a65d3d" },
  { title: "Research and data support", description: "Contribute relevant research, documentation and responsible programme data support.", accent: "#9274a8" },
  { title: "Communications and operations", description: "Support communications, administration, logistics and other non-clinical activities.", accent: "#66866d" },
];

export default function VolunteerPage() {
  return (
    <main className="volunteer-page">
      <SiteHeader />
      <section className="volunteer-hero">
        <div>
          <p className="eyebrow light">VOLUNTEER WITH SUDF</p>
          <h1>Give your time.<br /><span>Strengthen healthier communities.</span></h1>
          <p className="volunteer-hero-copy">Join a community of people who want to support diabetes awareness, prevention, education and outreach. Tell us about your skills, experience and the ways you may be able to contribute.</p>
        </div>
        <div className="volunteer-hero-art" aria-hidden="true">
          <div className="volunteer-orbit" />
          <div className="volunteer-emblem">SUDF</div>
          <span className="volunteer-hero-note">Service · Compassion · Community</span>
        </div>
      </section>
      <section className="section volunteer-intro">
        <div>
          <p className="eyebrow">MAKE A CONTRIBUTION</p>
          <h2>Different skills. One shared purpose.</h2>
        </div>
        <div className="volunteer-intro-copy">
          <p>Volunteers can contribute in different ways, depending on their qualifications, experience, interests and availability. SUDF welcomes enquiries from healthcare professionals and people who can support community-based, administrative and other non-clinical activities.</p>
          <p>Submitting an application is the first step in expressing interest. It does not automatically confirm acceptance, appointment or deployment.</p>
        </div>
      </section>
      <section className="section volunteer-areas">
        <div className="volunteer-areas-heading">
          <p className="eyebrow">WAYS TO GET INVOLVED</p>
          <h2>Where could you make a difference?</h2>
          <p>Choose the area that best reflects your skills or interests. The Foundation can discuss suitable opportunities during its review of your application.</p>
        </div>
        <div className="volunteer-area-grid">
          {areas.map((area) => (
            <article className="volunteer-area-card" key={area.title} style={{ "--area-accent": area.accent } as CSSProperties}>
              <h3>{area.title}</h3>
              <p>{area.description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="volunteer-application" className="section volunteer-form-section">
        <div className="volunteer-form-copy">
          <p className="eyebrow light">VOLUNTEER APPLICATION</p>
          <h2>Tell us how you would like to contribute.</h2>
          <p>Share your background and preferred area of involvement. The information will help the Foundation understand your interests and consider appropriate next steps.</p>
          <div className="volunteer-safety-note"><strong>Professional and personal information</strong><br />Please provide accurate information. Where a role involves clinical duties, relevant qualifications and professional registration may be checked before any clinical responsibility is assigned. Do not submit patient records or personal medical information.</div>
        </div>
        <VolunteerForm />
      </section>
      <footer className="volunteer-footer">
        <div><strong>SYLVESTER UJONG DIABETES FOUNDATION</strong><p>Awareness · Prevention · Education · Support</p></div>
        <nav aria-label="Footer navigation"><a href="/#about">About</a><a href="/#programs">Our Work</a><a href="/team">Meet Our Team</a><a href="/donate-support">Donate / Support</a><a href="/contact">Contact</a></nav>
        <SocialLinks />
        <span>© 2026 Sylvester Ujong Diabetes Foundation. All rights reserved.</span>
      </footer>
    </main>
  );
}