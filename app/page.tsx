const programs = [
  {
    number: "01",
    title: "Diabetes Awareness",
    text: "Community education that helps people understand diabetes, risk factors, prevention and when to seek care.",
  },
  {
    number: "02",
    title: "Community Screening",
    text: "Community-based screening activities designed to support early awareness, referral and follow-up.",
  },
  {
    number: "03",
    title: "Healthy Living Education",
    text: "Practical conversations around healthier living, nutrition, physical activity and informed health choices.",
  },
  {
    number: "04",
    title: "Support & Referrals",
    text: "Connecting people and families with appropriate information, support and healthcare referral pathways.",
  },
];

const events = [
  ["Community Diabetes Awareness", "Community education and awareness activity."],
  ["Community Screening", "Screening, education and referral support."],
  ["Healthy Living Session", "Practical conversations around healthier living."],
];

export default function Home() {
  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#home" aria-label="SUDF home">
          <span className="brand-mark">SUDF</span>
          <span>
            <strong>SYLVESTER UJONG</strong>
            <small>DIABETES FOUNDATION</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#about">About</a>
          <a href="#programs">Programs</a>
          <a href="#impact">Impact</a>
          <a href="#events">Events</a>
          <a href="#resources">Resources</a>
          <a href="#partners">Partners</a>
          <a className="nav-donate" href="#support">Donate</a>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SYLVESTER UJONG DIABETES FOUNDATION</p>
          <h1>CONTINUING A LEGACY.<br />EMPOWERING HEALTHIER LIVES.</h1>
          <p className="lead">
            Promoting diabetes awareness, prevention, education and supportive
            care while carrying forward a legacy of service to individuals,
            families and communities.
          </p>
          <div className="actions">
            <a className="button button-gold" href="#programs">Explore Our Work</a>
            <a className="button button-outline" href="#support">Support Our Mission</a>
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
          <p className="eyebrow">WHO WE ARE</p>
          <h2>Turning a lasting legacy of service into practical community action.</h2>
        </div>
        <p>
          The Sylvester Ujong Diabetes Foundation carries forward a commitment
          to awareness, prevention, education and community support. This
          website is structured so verified organizational information,
          programs, events and impact can be managed and published as SUDF
          grows.
        </p>
      </section>

      <section id="programs" className="section green-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow light">OUR PROGRAMS</p>
            <h2>From awareness to action.</h2>
          </div>
          <p>Core program areas can be expanded from the SUDF admin dashboard.</p>
        </div>
        <div className="program-grid">
          {programs.map((program) => (
            <article className="program-card" key={program.number}>
              <span>{program.number}</span>
              <h3>{program.title}</h3>
              <p>{program.text}</p>
              <a href="#contact">Learn more →</a>
            </article>
          ))}
        </div>
      </section>

      <section id="impact" className="section impact">
        <div className="section-heading">
          <div>
            <p className="eyebrow">OUR IMPACT</p>
            <h2>Measure the work. Show the change.</h2>
          </div>
          <p>
            Impact figures should be published from verified SUDF records rather
            than hard-coded estimates.
          </p>
        </div>
        <div className="metrics">
          <div><strong>—</strong><span>People reached</span></div>
          <div><strong>—</strong><span>People screened</span></div>
          <div><strong>—</strong><span>Communities engaged</span></div>
          <div><strong>—</strong><span>Programs delivered</span></div>
        </div>
      </section>

      <section className="legacy section">
        <div className="legacy-image">LEGACY<br />PORTRAIT</div>
        <div>
          <p className="eyebrow">THE LEGACY</p>
          <h2>A legacy of service that continues through healthier communities.</h2>
          <p>
            The foundation&apos;s story can be expanded here with verified
            biographical and organizational material supplied by SUDF.
          </p>
          <blockquote>
            “A legacy does not end with a life. It continues through the lives we touch.”
          </blockquote>
        </div>
      </section>

      <section id="events" className="section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">UPCOMING EVENTS</p>
            <h2>Community activities and opportunities to participate.</h2>
          </div>
        </div>
        <div className="event-grid">
          {events.map(([title, text], i) => (
            <article className="event-card" key={title}>
              <span className="date-box">DATE</span>
              <div>
                <p className="event-no">0{i + 1}</p>
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#contact">Event details →</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="support" className="support section">
        <div>
          <p className="eyebrow light">FUND OUR WORK</p>
          <h2>Help turn awareness into measurable community action.</h2>
          <p>
            Support diabetes awareness, prevention, education, screening
            activities and community programs.
          </p>
        </div>
        <a className="button button-gold" href="#contact">Support SUDF</a>
      </section>

      <section id="partners" className="section partners">
        <p className="eyebrow">PARTNERS & COLLABORATION</p>
        <h2>Building healthier communities together.</h2>
        <p className="wide">
          A space for institutional partners, community organizations,
          healthcare professionals, sponsors and supporters.
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

      <section id="contact" className="contact section">
        <div>
          <p className="eyebrow">CONTACT SUDF</p>
          <h2>Connect with the foundation.</h2>
          <p>
            Contact details, official registration information and public
            organizational documents should be added from verified SUDF records.
          </p>
        </div>
        <form className="contact-form">
          <input placeholder="Your name" aria-label="Your name" />
          <input type="email" placeholder="Email address" aria-label="Email address" />
          <textarea placeholder="How can we help?" aria-label="Message" rows={5} />
          <button className="button button-green" type="button">Send Message</button>
        </form>
      </section>

      <footer className="footer">
        <div>
          <strong>SYLVESTER UJONG DIABETES FOUNDATION</strong>
          <p>Awareness • Prevention • Education • Support</p>
        </div>
        <div className="footer-links">
          <a href="#about">About</a><a href="#programs">Programs</a><a href="#impact">Impact</a>
          <a href="#events">Events</a><a href="#resources">Resources</a><a href="#partners">Partners</a>
        </div>
        <div className="footer-legal">
          Contact SUDF • Privacy • Safeguarding • Transparency<br />
          © SUDF
        </div>
      </footer>
    </main>
  );
}