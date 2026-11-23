import ObjectiveReveal from "../components/ObjectiveReveal";
import SiteHeader from "../components/SiteHeader";

const programs = [
  {
    number: "01",
    title: "Free Community Diabetes Screening",
    text: "Early detection can save lives. SUDF takes diabetes screening directly into communities, helping individuals understand their blood glucose status and identify potential risks before serious complications develop.",
  },
  {
    number: "02",
    title: "Care & Support for People Living with Diabetes",
    text: "A diagnosis should not leave anyone feeling abandoned or uncertain about what comes next. We provide guidance, basic support services, counselling, and appropriate referral pathways to help people living with diabetes access the care they need.",
  },
  {
    number: "03",
    title: "Health Education & Lifestyle Empowerment",
    text: "Prevention begins with knowledge. Through seminars, outreach programmes, community engagements, and public health campaigns, we provide practical information about nutrition, physical activity, healthy lifestyles, diabetes risk factors, and disease management.",
  },
  {
    number: "04",
    title: "Medical Outreach & Partnerships",
    text: "We collaborate with healthcare professionals, hospitals, clinics, community organisations, volunteers, development partners, and other stakeholders to expand access to diabetes services and strengthen community health systems.",
  },
];

// Add each approved outreach photo here after placing its file in /public/images/gallery/.
const galleryPhotos: { src: string; alt: string; caption?: string }[] = [
  // { src: "/images/gallery/community-screening-01.jpg", alt: "SUDF team conducting a community diabetes screening", caption: "Community diabetes screening" },
];

const objectives = [
  {
    number: "01",
    title: "Preserving a Legacy of Service",
    text: "To honour and sustain the legacy of HRH Late Obol Sylvester Oka Ujong by advancing initiatives that reflect his values of compassion, service, and community development.",
  },
  {
    number: "02",
    title: "Expanding Access to Diabetes Care",
    text: "To provide accessible and free diabetes care services, including screening, basic treatment support, counselling, and referral services for vulnerable and underserved populations.",
  },
  {
    number: "03",
    title: "Promoting Awareness and Prevention",
    text: "To promote diabetes awareness, prevention, and lifestyle education through community outreach, public health campaigns, and capacity-building programmes for healthcare providers and volunteers.",
  },
  {
    number: "04",
    title: "Reducing Complications and Mortality",
    text: "To reduce diabetes-related complications and mortality through early detection, sustainable interventions, strategic partnerships, and advocacy.",
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SYLVESTER UJONG DIABETES FOUNDATION (SUDF)</p>
          <h1>CONTINUING A LEGACY.<br />EMPOWERING HEALTHIER LIVES.</h1>
          <p className="lead">
            The Sylvester Ujong Diabetes Foundation (SUDF) is a non-profit organisation dedicated to transforming lives, protecting families, and building healthier communities through the prevention, early detection, management, and increased awareness of diabetes.
          </p>
          <div className="actions">
            <a className="button button-gold" href="#programs">Explore Our Work</a>
            <a className="button button-outline" href="/donate-support">Support Our Mission</a>
          </div>
        </div>
        <div className="hero-image" aria-label="SUDF hero image placeholder">
          <div>
            <span>SUDF</span>
            <p>Community • Health • Legacy</p>
          </div>
        </div>
      </section>

      <section id="about" className="intro section">
        <div>
          <p className="eyebrow">ABOUT US</p>
          <h2>Sylvester Ujong Diabetes Foundation (SUDF)</h2>
        </div>
        <div>
          <p>
            The Sylvester Ujong Diabetes Foundation (SUDF) is a non-profit organisation dedicated to transforming lives, protecting families, and building healthier communities through the prevention, early detection, management, and increased awareness of diabetes.
          </p>
          <p>
            The Foundation was established in honour and memory of HRH Late Obol Sylvester Oka Ujong, whose life reflected the values of compassion, service, and commitment to community development. SUDF carries forward this legacy by addressing a health challenge that continues to affect individuals and families, particularly those with limited access to screening, health information, and appropriate care.
          </p>
          <p>
            At SUDF, we believe that diabetes should not become a silent killer simply because someone lacks information, access to screening, or the support needed to manage the condition.
          </p>
          <p>
            Through community-based interventions, health education, screening programmes, patient support, medical outreach, partnerships, and advocacy, we work to bring diabetes services closer to the people who need them most.
          </p>
        </div>
      </section>

      <section id="mission" className="section green-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow light">OUR VISION</p>
            <h2>A society where diabetes is no longer a silent killer.</h2>
          </div>
          <p>
            A society where diabetes is no longer a silent killer, and every individual has access to the knowledge, care, and support needed to live a healthy and productive life.
          </p>
        </div>
        <div className="mission-statement">
          <p className="eyebrow light">OUR MISSION</p>
          <h2>Transform lives. Protect families. Build healthier communities.</h2>
          <p>
            Our mission is to transform lives, protect families, and build healthier communities by improving access to diabetes prevention, early detection, education, care, and support, particularly for vulnerable and underserved populations.
          </p>
          <p>
            We combine compassion with practical action, taking diabetes awareness and essential services directly into communities while building partnerships that can create sustainable improvements in health outcomes.
          </p>
        </div>
      </section>

      <section id="objectives" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR OBJECTIVES</p>
            <h2>What SUDF is committed to.</h2>
          </div>
          <p>SUDF is committed to:</p>
        </div>
        <div className="program-grid objective-grid">
          {objectives.map((objective, index) => (
            <ObjectiveReveal key={objective.number} objective={objective} index={index} />
          ))}
        </div>
      </section>

      <section id="programs" className="section green-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow light">OUR MISSION IN ACTION</p>
            <h2>From awareness to action.</h2>
          </div>
          <p>Through community-based interventions and partnerships, we work to bring diabetes services closer to the people who need them most.</p>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.number}>
              <span>{program.number}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="section impact">
        <div className="section-heading">
          <div>
            <p className="eyebrow">WHY OUR WORK MATTERS</p>
            <h2>SUDF seeks to change that story.</h2>
          </div>
          <p>
            Diabetes can progress for years without obvious symptoms. For many people, the first serious warning may come only after complications have developed.
          </p>
        </div>
        <p className="impact-copy">
          We want more people to know their risk, know their numbers, understand diabetes, receive support early, and take informed steps towards healthier lives.
        </p>
        <p className="impact-copy">
          Every person screened, every family educated, every patient supported, and every community reached brings us closer to a future where preventable diabetes-related suffering and deaths are significantly reduced.
        </p>
        <div className="metrics">
          <div><strong>—</strong><span>People reached</span></div>
          <div><strong>—</strong><span>People screened</span></div>
          <div><strong>—</strong><span>Communities engaged</span></div>
          <div><strong>—</strong><span>Programmes delivered</span></div>
        </div>
      </section>

      <section className="legacy section sudf-gallery-section">
        <div className="sudf-gallery-panel">
          <div className="sudf-gallery-heading">
            <p className="eyebrow">SUDF GALLERY</p>
            <h2>Our work. Our communities. Our impact.</h2>
            <p>Moments from the Foundation's community outreach, diabetes screening, health education and other activities.</p>
          </div>
          <div className="sudf-gallery-grid">
            {galleryPhotos.map((photo) => (
              <figure className="sudf-gallery-item" key={photo.src}>
                <img src={photo.src} alt={photo.alt} loading="lazy" />
                {photo.caption ? <figcaption>{photo.caption}</figcaption> : null}
              </figure>
            ))}
            {galleryPhotos.length === 0 ? (
              <div className="sudf-gallery-empty">
                <span className="sudf-gallery-empty-mark" aria-hidden="true">SUDF</span>
                <strong>Our outreach stories will appear here.</strong>
                <p>Photos from SUDF activities will be added to this gallery as the Foundation's work continues.</p>
              </div>
            ) : null}
          </div>
        </div>
        <div className="sudf-gallery-legacy-copy">
          <p className="eyebrow">OUR LEGACY, OUR RESPONSIBILITY</p>
          <h2>A living legacy of service.</h2>
          <p>
            The Sylvester Ujong Diabetes Foundation is more than a memorial to a respected community leader. It is a living legacy of service.
          </p>
          <p>
            By transforming remembrance into action, SUDF seeks to ensure that the values represented by HRH Late Obol Sylvester Oka Ujong continue to touch lives across generations.
          </p>
          <blockquote>
            A legacy remembered through service.<br />
            A community strengthened through knowledge.<br />
            Lives protected through action.
          </blockquote>
          <p>Together, we can stop diabetes from being a silent killer</p>
        </div>
      </section>

      <section id="events" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">EVENTS & COMMUNITY ACTIVITIES</p>
            <h2>Community activities and opportunities to participate.</h2>
          </div>
          <p>Updates about SUDF events and outreach activities can be shared here as official details become available.</p>
        </div>
        <div className="event-grid">
          {["Community Diabetes Screening", "Health Education & Outreach", "Medical Outreach & Partnerships"].map((title, i) => (
            <article className="event-card" key={title}>
              <span className="date-box">SUDF</span>
              <div>
                <p className="event-no">0{i + 1}</p>
                <h3>{title}</h3>
                <p>Learn more about SUDF's community-based work and opportunities to participate.</p>
                <a href="#contact">Contact the Foundation →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="support" className="support section">
        <div>
          <p className="eyebrow light">SUPPORT OUR WORK</p>
          <h2>Help turn awareness into action.</h2>
          <p>
            Support diabetes awareness, prevention, education, screening activities and community programmes.
          </p>
        </div>
        <a className="button button-gold" href="/donate-support">Donate / Support SUDF</a>
      </section>

      <section id="partners" className="section partners">
        <p className="eyebrow">PARTNERS & COLLABORATION</p>
        <h2>Building healthier communities together.</h2>
        <p className="wide">
          We collaborate with healthcare professionals, hospitals, clinics, community organisations, volunteers, development partners, and other stakeholders to expand access to diabetes services and strengthen community health systems.
        </p>
        <div className="partner-grid">
          {Array.from({ length: 5 }).map((_, i) => (
            <div className="partner-placeholder" key={i}>PARTNER</div>
          ))}
        </div>
      </section>

      <section id="resources" className="resources section">
        <p className="eyebrow">RESOURCES</p>
        <h2>Learn. Share. Act.</h2>
        <div className="resource-grid">
          <a href="#contact"><strong>Diabetes Education</strong><span>Guides and practical information →</span></a>
          <a href="#contact"><strong>Guides & Downloads</strong><span>Materials for communities and partners →</span></a>
          <a href="#contact"><strong>News & Stories</strong><span>Updates from SUDF activities →</span></a>
        </div>
      </section>

      <footer className="footer">
        <div>
          <strong>SYLVESTER UJONG DIABETES FOUNDATION</strong>
          <p>Awareness • Prevention • Education • Support</p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a><a href="#mission">Our Mission</a><a href="#objectives">Objectives</a>
          <a href="#programs">Our Work</a><a href="#events">Events</a><a href="#resources">Resources</a><a href="/donate-support">Donate / Support</a><a href="/contact">Contact</a>
        </div>
        <div className="footer-legal">
          Contact SUDF • Privacy • Safeguarding • Transparency<br />
          © SUDF
        </div>
      </footer>
    </main>
  );
}
