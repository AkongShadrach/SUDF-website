import SocialLinks from "./SocialLinks";

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer-identity">
        <strong>SYLVESTER UJONG DIABETES FOUNDATION</strong>
        <p>Awareness • Prevention • Education • Support</p>
        <div className="footer-contact">
          <p><span>Address</span><br />No 11 Welfare road Ugep</p>
          <p><span>Phone</span><br /><a href="tel:+2349059592892">+2349059592892</a></p>
        </div>
      </div>
      <nav className="footer-links" aria-label="Footer navigation">
        <a href="/#about">About</a>
        <a href="/#mission">Our Mission</a>
        <a href="/#objectives">Objectives</a>
        <a href="/#programs">Our Work</a>
        <a href="/#programmes">Programmes</a>
        <a href="/#resources">Resources</a>
        <a href="/team">Meet Our Team</a>
        <a href="/volunteer">Become a Volunteer</a>
        <a href="/donate-support">Donate / Support</a>
        <a href="/contact">Contact</a>
      </nav>
      <SocialLinks />
      <div className="footer-legal">
        © 2026 Sylvester Ujong Diabetes Foundation. All rights reserved.
      </div>
    </footer>
  );
}
