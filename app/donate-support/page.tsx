import SiteHeader from "../../components/SiteHeader";
import SupportForm from "./SupportForm";

const supportOptions = [
  {
    number: "01",
    title: "Make a Donation",
    description: "Contribute towards SUDF's diabetes awareness, prevention, screening, education and community support work.",
    detail: "Financial support",
  },
  {
    number: "02",
    title: "Sponsor Community Screening",
    description: "Help extend access to community-based screening and support earlier awareness of blood glucose status.",
    detail: "Programme sponsorship",
  },
  {
    number: "03",
    title: "Support Health Education",
    description: "Help share practical information about diabetes risk factors, prevention, healthy lifestyles and disease management.",
    detail: "Education and awareness",
  },
  {
    number: "04",
    title: "Give In Kind or Volunteer",
    description: "Offer relevant supplies, equipment, professional expertise, time or other practical support for SUDF activities.",
    detail: "Skills and resources",
  },
];

export default function DonateSupportPage() {
  return (
    <main className="support-page">
      <SiteHeader />
      <section className="support-hero">
        <div className="support-hero-inner">
          <p className="eyebrow light">STAND WITH SUDF</p>
          <h1>Help protect lives.<br /><span>Support healthier communities.</span></h1>
          <p className="support-hero-copy">
            Your support can help bring diabetes awareness, screening, education and care closer to the people who need them.
          </p>
          <a className="button button-gold" href="#support-enquiry">Explore ways to support SUDF</a>
          <div className="support-hero-note">
            <span aria-hidden="true">✳</span>
            Every contribution begins with a shared commitment to healthier communities.
          </div>
        </div>
        <div className="support-hero-art" aria-hidden="true">
          <div className="support-orbit orbit-one" />
          <div className="support-orbit orbit-two" />
          <div className="support-emblem">SUDF</div>
          <div className="support-art-caption"><strong>Awareness</strong><span>Prevention · Early detection · Support</span></div>
        </div>
      </section>

      <section className="support-intro section">
        <div>
          <p className="eyebrow">BE PART OF THE WORK</p>
          <h2>There are different ways to make a difference.</h2>
        </div>
        <p>
          Whether you are an individual, organisation, healthcare professional or community partner, there are meaningful ways to stand with SUDF and support its mission.
        </p>
      </section>

      <section className="support-options-section section">
        <div className="support-options-grid">
          {supportOptions.map((option) => (
            <article className="support-option-card" key={option.number}>
              <div className="support-option-top">
                <span className="support-option-number">{option.number}</span>
                <span className="support-option-icon" aria-hidden="true">{["♡", "＋", "✳", "↗"][Number(option.number) - 1]}</span>
              </div>
              <p className="support-option-detail">{option.detail}</p>
              <h3>{option.title}</h3>
              <p>{option.description}</p>
              <a href="#support-enquiry">I want to help <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>

      <section className="support-purpose section">
        <div className="support-purpose-heading">
          <p className="eyebrow light">WHAT YOUR SUPPORT CAN HELP ADVANCE</p>
          <h2>Turning compassion into practical action.</h2>
          <p>Support can contribute to the areas of work that are central to SUDF's mission.</p>
        </div>
        <div className="support-purpose-list">
          <div><span>01</span><strong>Community diabetes screening</strong><p>Taking screening closer to people and encouraging early awareness.</p></div>
          <div><span>02</span><strong>Care and support</strong><p>Helping people living with diabetes access guidance and appropriate support.</p></div>
          <div><span>03</span><strong>Health education</strong><p>Sharing practical knowledge about prevention, healthy lifestyles and management.</p></div>
          <div><span>04</span><strong>Medical outreach and partnerships</strong><p>Working with health professionals and community stakeholders to extend services.</p></div>
        </div>
      </section>

      <section id="support-enquiry" className="support-enquiry section">
        <div className="support-enquiry-copy">
          <p className="eyebrow">LET'S MAKE A DIFFERENCE TOGETHER</p>
          <h2>Tell us how you would like to support SUDF.</h2>
          <p>
            Share your interest with the Foundation. You can enquire about making a donation, sponsoring a programme, contributing resources, volunteering or exploring a partnership.
          </p>
          <div className="support-trust-note">
            <span aria-hidden="true">✓</span>
            <p><strong>Your information matters.</strong><br />The details you submit will be used to respond to your support enquiry. Please do not include patient health information.</p>
          </div>
        </div>
        <SupportForm />
      </section>

      <section className="support-closing">
        <p className="eyebrow light">A LEGACY REMEMBERED THROUGH SERVICE</p>
        <h2>Together, we can stop diabetes from being a silent killer.</h2>
        <a className="button button-gold" href="#support-enquiry">Become a supporter</a>
      </section>
    </main>
  );
}
