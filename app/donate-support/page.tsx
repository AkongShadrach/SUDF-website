import SiteHeader from "../../components/SiteHeader";
import SupportChoices from "./SupportChoices";
import { Activity, HandHeart, BookOpen, BedDouble } from "lucide-react";
import SiteFooter from "../../components/SiteFooter";

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
          <h1>Stand with SUDF<br /><span>Help protect healthier lives</span></h1>
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
          <h2>Support the work. Expand the reach</h2>
          <p>Support for SUDF can take different forms. You may wish to contribute towards community screening, help strengthen health education, support people living with diabetes or provide practical resources for outreach.</p>
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
      <SupportChoices />
      <SiteFooter />
    </main>
  );
}
