import SocialLinks from "../../components/SocialLinks";
import SiteHeader from "../../components/SiteHeader";
import SupportForm from "./SupportForm";
import { Activity, HandHeart, BookOpen, BedDouble } from "lucide-react";

const supportOptions = [
  { number: "01", title: "Community diabetes screening", description: "Help SUDF bring diabetes screening closer to individuals and families, supporting earlier awareness and access to appropriate guidance.", Icon: Activity },
  { number: "02", title: "Care and patient support", description: "Support guidance, basic care assistance and referral pathways for people living with diabetes, particularly vulnerable communities.", Icon: HandHeart },
  { number: "03", title: "Health education", description: "Help share practical knowledge about diabetes prevention, risk factors, healthy lifestyles and disease management.", Icon: BookOpen },
  { number: "04", title: "Medical outreach", description: "Contribute to outreach activities and the collaboration needed to extend diabetes services within communities.", Icon: BedDouble },
];

export default function DonateSupportPage() {
  return (
    <main className="support-page">
      <SiteHeader />
      <section className="support-hero support-hero-reference">
        <div className="support-hero-inner">
          <p className="eyebrow light">SUPPORT THE MISSION</p>
          <h1>Stand with SUDF.<br /><span>Help protect healthier lives.</span></h1>
          <p className="support-hero-copy">Help us bring diabetes awareness, screening, education and support closer to individuals, families and communities across Nigeria.</p>
        </div>
        <div className="support-hero-art" aria-hidden="true">
          <div className="support-orbit orbit-one" /><div className="support-orbit orbit-two" />
          <div className="support-emblem">SUDF</div>
          <div className="support-art-caption"><strong>Awareness</strong><span>Prevention · Early detection · Support</span></div>
        </div>
      </section>
      <section className="support-more support-more-reference section">
        <div className="support-more-heading">
          <p className="eyebrow">MORE THAN FUNDING</p>
          <h2>Support the work. Expand the reach.</h2>
          <p>Support for SUDF can take different forms. You may wish to contribute towards community screening, help strengthen health education, support people living with diabetes or provide practical resources for outreach. Tell us what you have in mind and we can discuss a useful way forward.</p>
        </div>
        <div className="support-options-grid">
          {supportOptions.map(({ number, title, description, Icon }) => (
            <article className="support-option-card support-option-card-reference" key={number}>
              <span className="support-option-icon" aria-hidden="true"><Icon size={30} strokeWidth={2.1} /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="support-enquiry" className="support-enquiry support-enquiry-reference section">
        <div className="support-enquiry-copy">
          <p className="eyebrow">BECOME A SUPPORTER</p>
          <h2>Tell us what support looks like for you.</h2>
          <p>There is no single way to support this mission. Tell us what you have in mind and the Foundation will have a conversation with you about the most useful way to move forward.</p>
          <div className="support-trust-note">
            <span aria-hidden="true">✓</span>
            <p><strong>Your information matters.</strong><br />Please share only the details needed for this enquiry. Do not include patient health information or sensitive personal medical records.</p>
          </div>
        </div>
        <SupportForm />
      </section>
      <footer className="support-footer">
        <div><strong>SYLVESTER UJONG DIABETES FOUNDATION</strong><p>Awareness · Prevention · Education · Support</p></div>
        <nav aria-label="Footer navigation"><a href="/#about">About</a><a href="/#programs">Our Work</a><a href="/#events">Events</a><a href="/#contact">Contact</a></nav>
        <SocialLinks />
        <span>© SUDF. All rights reserved.</span>
      </footer>
    </main>
  );
}