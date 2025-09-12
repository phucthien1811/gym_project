import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Button from "./Button";

function Navigation({ links = [], onCtaClick, ctaLabel = "Join Us", className = "" }) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState(typeof window !== "undefined" ? window.location.hash || "#home" : "#home");

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <nav className={`nav ${className}`}>
      {/* Desktop */}
      <div className="nav__bar">
        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href}>
              <a className={`nav-link ${hash === l.href ? "nav-link--active" : ""}`} href={l.href}>
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="nav__cta">
          <Button onClick={onCtaClick} size="sm">{ctaLabel}</Button>
        </div>

        {/* Mobile toggle */}
        <button
          className="nav__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((s) => !s)}
        >
          <span className="nav__toggle-line" />
          <span className="nav__toggle-line" />
          <span className="nav__toggle-line" />
        </button>
      </div>

      {/* Mobile sheet */}
      {open && (
        <div className="nav__sheet" onClick={() => setOpen(false)}>
          <div className="nav__sheet-panel" onClick={(e) => e.stopPropagation()}>
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`nav-link nav-link--block ${hash === l.href ? "nav-link--active" : ""}`}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <Button onClick={() => { setOpen(false); onCtaClick?.(); }} className="mt-8" size="md">
              {ctaLabel}
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

Navigation.propTypes = {
  links: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })),
  onCtaClick: PropTypes.func,
  ctaLabel: PropTypes.string,
  className: PropTypes.string,
};

export default Navigation;
