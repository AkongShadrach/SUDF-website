import Link from "next/link";
import SiteHeader from "../../components/SiteHeader";
import { UserRound } from "lucide-react";
import SiteFooter from "../../components/SiteFooter";

const teamMembers = [
  {
    name: "Michael Oka",
    role: "Founder and Chairman of the Board of Trustees",
    group: "FOUNDATION LEADERSHIP",
    bio: "Michael Oka founded the Sylvester Ujong Diabetes Foundation to honour the legacy of the late HRH Obol Sylvester Oka Ujong and carry forward his commitment to compassion, service and community development. As Chairman of the Board of Trustees, Michael guides the Foundation’s strategic direction and oversees its governance. His focus is on making diabetes education, screening and referral support more accessible to underserved communities through outreach and partnerships with healthcare providers.",
  },
  {
    name: "Goodness Omini",
    photo: "/team/goodness-omini.png",
    role: "Media and Publicity",
    group: "MEDIA AND COMMUNICATIONS",
    bio: "Goodness coordinates media engagement and publicity for SUDF’s outreach activities and awareness campaigns.",
  },
  {
    name: "Shadrach Akong",
    role: "Head of IT",
    group: "OPERATIONS AND ADMINISTRATION",
    bio: "Shadrach oversees the digital systems and tools that support SUDF’s day-to-day operations and programme delivery.",
  },
  {
    name: "Edmond Oka",
    role: "Head of Programmes and Events",
    group: "PROGRAMMES AND OUTREACH",
    bio: "Edmond leads the planning and delivery of SUDF’s programmes and events, including community outreach, screening initiatives and awareness activities.",
  },
  {
    name: "Akamba Otu",
    role: "Head of Public Health Administration",
    group: "PROGRAMMES AND OUTREACH",
    bio: "Akamba coordinates the public health administration behind SUDF’s screening, education and referral initiatives and supports collaboration with healthcare partners.",
  },
  {
    name: "Sylvia Ujong",
    photo: "/team/sylvia-ujong.png",
    role: "Head of Financial Operations",
    group: "OPERATIONS AND ADMINISTRATION",
    bio: "Sylvia oversees SUDF’s day-to-day financial operations, including budgeting, expenditure tracking and financial reporting.",
  },
  {
    name: "Abanda Uket",
    role: "Head of Fundraising and Mobilisation",
    group: "PARTNERSHIPS AND MOBILISATION",
    bio: "Abanda leads fundraising and mobilises donors, sponsors and community supporters for SUDF’s programmes.",
  },
  {
    name: "Elias Obono",
    role: "Head of Data and Logistics Planning",
    group: "OPERATIONS AND ADMINISTRATION",
    bio: "Elias oversees programme data collection and reporting and plans the supplies, transport and other logistics needed for outreach.",
  },
  {
    name: "Goodnews Ibiang",
    role: "Head of Publicity and Communications",
    group: "MEDIA AND COMMUNICATIONS",
    bio: "Goodnews leads SUDF’s communications planning and oversees the messaging used in public updates and stakeholder communications.",
  },
  {
    name: "Emmanuel Oka",
    role: "Head of Strategic Planning and Capacity Building",
    group: "STRATEGY AND CAPACITY BUILDING",
    bio: "Emmanuel leads strategic planning and coordinates training and professional development for staff and volunteers.",
  },
  {
    name: "Obia Oka-michael",
    photo: "/team/obia-oka-michael.png",
    role: "Secretary",
    group: "OPERATIONS AND ADMINISTRATION",
    bio: "Obia Oka-michael coordinates meeting records, official correspondence and administrative follow-up for the Foundation.",
  },
];

export default function TeamPage() {
  return (
    <main className="sudf-team-page">
      <SiteHeader />
      <section className="sudf-team-hero">
        <div className="sudf-team-hero-inner">
          <p className="eyebrow">THE PEOPLE BEHIND THE WORK</p>
          <h1>Meet our team</h1>
          <p>The Sylvester Ujong Diabetes Foundation (SUDF) brings together people who plan and deliver community outreach, support diabetes screening and education, and manage the partnerships and operations that make this work possible.</p>
          <span className="sudf-team-hero-rule" aria-hidden="true" />
        </div>
        <div className="sudf-team-hero-mark" aria-hidden="true"><UserRound size={76} strokeWidth={1} /></div>
      </section>

      <section className="sudf-team-intro section">
        <div>
          <p className="eyebrow">OUR PEOPLE</p>
          <h2>Working together for healthier communities</h2>
        </div>
        <div>
          <p>Meet the people serving across SUDF’s leadership, programmes, public health administration, communications and operations.</p>
          <p>Each team member contributes to the Foundation’s work to improve diabetes awareness, screening, education and support in communities.</p>
        </div>
      </section>

      <section className="sudf-team-groups section" aria-label="SUDF team profiles">
        <div className="sudf-team-section-heading">
          <p className="eyebrow">MEET THE PEOPLE</p>
          <h2>Our team and leadership</h2>
          <p>Meet the people and learn about the responsibilities they carry across the Foundation.</p>
        </div>
        <div className="sudf-team-grid">
          {teamMembers.map((member) => (
            <article className="sudf-team-card" key={member.name}>
              <div className="sudf-team-photo-placeholder">
                {"photo" in member && member.photo ? (
                  <img className="sudf-team-photo" src={member.photo} alt={`${member.name} — SUDF team member`} />
                ) : (
                  <>
                    <span className="sudf-team-initials" aria-hidden="true">{member.name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</span>
                    <span>SUDF TEAM</span>
                  </>
                )}
              </div>
              <div className="sudf-team-card-copy">
                <p className="eyebrow">{member.group}</p>
                <h3>{member.name}</h3>
                <p className="sudf-team-role">{member.role}</p>
                <p>{member.bio}</p>
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

      <SiteFooter />
    </main>
  );
}
