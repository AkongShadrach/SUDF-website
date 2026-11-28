"use client";

import { useState } from "react";
import QuickDonate from "./QuickDonate";
import SupportForm from "./SupportForm";
import styles from "./SupportChoices.module.css";

type Choice = "quick" | "support" | null;

export default function SupportChoices() {
  const [active, setActive] = useState<Choice>(null);

  return (
    <section className={styles.section} aria-label="Choose how to support SUDF">
      <div className={styles.heading}>
        <p className="eyebrow">CHOOSE HOW TO GIVE</p>
        <h2>How would you like to support SUDF?</h2>
        <p>Select an option below to continue. You can make a direct donation or discuss another way to support the Foundation.</p>
      </div>

      <div className={styles.choices}>
        <button
          type="button"
          className={`${styles.choice} ${active === "quick" ? styles.active : ""}`}
          aria-expanded={active === "quick"}
          aria-controls="sudf-quick-donation-panel"
          onClick={() => setActive(active === "quick" ? null : "quick")}
        >
          <span><strong>Quick Donation</strong><small>Make a direct financial contribution</small></span>
          <span className={styles.action}>{active === "quick" ? "Close" : "Donate"} <b aria-hidden="true">{active === "quick" ? "−" : "→"}</b></span>
        </button>

        <button
          type="button"
          className={`${styles.choice} ${active === "support" ? styles.active : ""}`}
          aria-expanded={active === "support"}
          aria-controls="sudf-support-form-panel"
          onClick={() => setActive(active === "support" ? null : "support")}
        >
          <span><strong>Become a Supporter / Donor</strong><small>Give, partner, sponsor a programme or offer practical support</small></span>
          <span className={styles.action}>{active === "support" ? "Close" : "Get started"} <b aria-hidden="true">{active === "support" ? "−" : "→"}</b></span>
        </button>
      </div>

      {active === "quick" && (
        <div id="sudf-quick-donation-panel" className={styles.panel}>
          <QuickDonate />
        </div>
      )}
      {active === "support" && (
        <div id="sudf-support-form-panel" className={styles.panel}>
          <SupportForm />
        </div>
      )}
    </section>
  );
}
