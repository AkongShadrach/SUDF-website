"use client";

import { useState } from "react";

const links = [
  ["About", "/#about"],
  ["Our Work", "/#programs"],
  ["Events", "/events"],
  ["Resources", "/#resources"],
  ["Meet Our Team", "/team"],
  ["Contact", "/contact"],
  ["Become a Volunteer", "/volunteer"],
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="brand" href="/#home" aria-label="SUDF home" onClick={() => setOpen(false)}>
        <img className="brand-logo" src="/sudf-logo-horizontal.svg" alt="Sylvester Ujong Diabetes Foundation" />
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            className={label === "Become a Volunteer" ? "button button-volunteer nav-volunteer" : undefined}
          >
            {label}
          </a>
        ))}
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
          <a
            key={href}
            href={href}
            className={label === "Become a Volunteer" ? "button button-volunteer mobile-volunteer-link" : undefined}
            onClick={() => setOpen(false)}
          >
            {label}
          </a>
        ))}
        <a className="mobile-donate-link button button-gold" href="/donate-support" onClick={() => setOpen(false)}>Donate / Support</a>
      </nav>
    </header>
  );
}
