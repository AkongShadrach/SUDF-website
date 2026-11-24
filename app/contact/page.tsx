import SiteHeader from "../../components/SiteHeader";
import ContactForm from "./ContactForm";
import SiteFooter from "../../components/SiteFooter";

export default function ContactPage() {
  return (
    <main className="sudf-contact-page">
      <SiteHeader />
      <section className="sudf-contact-hero">
        <div className="sudf-contact-intro">
          <p className="eyebrow light">CONTACT THE FOUNDATION</p>
          <h1>Let’s start a conversation.</h1>
          <p>Have a question about SUDF, our programmes, community outreach or ways to work with the Foundation? Send us a message using the form and our team can follow up.</p>
          <div className="sudf-contact-note">
            <span aria-hidden="true">✓</span>
            <p><strong>A note about your message</strong><br />Please do not include confidential medical records, patient information, passwords or other sensitive personal details in this form.</p>
          </div>
        </div>
        <div className="sudf-contact-form-panel">
          <div className="sudf-contact-form-heading">
            <p className="eyebrow">SEND AN ENQUIRY</p>
            <h2>How can we help?</h2>
            <p>Complete the fields below and submit your message to SUDF.</p>
          </div>
          <ContactForm />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
