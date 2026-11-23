"use client";

import { useState } from "react";

const links = [
  ["About", "/#about"],
  ["Our Mission", "/#mission"],
  ["Objectives", "/#objectives"],
  ["Our Work", "/#programs"],
  ["Impact", "/#impact"],
  ["Events", "/#events"],
  ["Resources", "/#resources"],
  ["Partners", "/#partners"],
  ["Contact", "/#contact"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="/#home" aria-label="SUDF home" onClick={() => setOpen(false)}>
        <span className="brand-mark">SUDF</span>
        <span>
          <strong>SYLVESTER UJONG</strong>
          <small>DIABETES FOUNDATION</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => <a key={href} href={href}>{label}</a>)}
        <a className="nav-donate" href="/donate-support">Donate / Support</a>
      </nav>

      <button
        className="mobile-menu-toggle"
        type="button"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
        aria-controls="mobile-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span className={open ? "menu-icon is-open" : "menu-icon"} aria-hidden="true">
          <span /><span /><span />
        </span>
      </button>

      <nav
        id="mobile-navigation"
        className={open ? "mobile-nav is-open" : "mobile-nav"}
        aria-label="Mobile navigation"
        hidden={!open}
      >
        {links.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>{label}</a>
        ))}
        <a className="mobile-donate-link" href="/donate-support" onClick={() => setOpen(false)}>Donate / Support SUDF</a>
      </nav>
    </header>
  );
}
