import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

function Navigation({ links = [], className = "", onNavigate }) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState(
    typeof window !== "undefined" ? window.location.hash || "#home" : "#home"
  );

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || "#home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  return (
    <nav className={`nav ${className}`}>
      <div className="nav__bar">
        <ul className="nav__links">
          {links.map((l) => (
            <li key={l.href}>
              {l.isRoute ? (
                <Link
                  className="nav-link"
                  to={l.href}
                >
                  {l.label}
                </Link>
              ) : (
                <a
                  className={`nav-link ${hash === l.href ? "nav-link--active" : ""}`}
                  href={l.href}
                  onClick={(e) => {
                    if (onNavigate) {
                      e.preventDefault();
                      onNavigate(l.href);
                    }
                  }}
                >
                  {l.label}
                </a>
              )}
            </li>
          ))}
        </ul>

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
                className={`nav-link nav-link--block ${
                  hash === l.href ? "nav-link--active" : ""
                }`}
                onClick={(e) => {
                  if (onNavigate) {
                    e.preventDefault();
                    onNavigate(l.href);
                  }
                  setOpen(false);
                }}
              >
                {l.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}

Navigation.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({ label: PropTypes.string, href: PropTypes.string })
  ),
  className: PropTypes.string,
  onNavigate: PropTypes.func,
};

export default Navigation;
