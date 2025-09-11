import React from "react";
import Navigation from "./Navigation";
import Button from "./Button";

/** Header sticky, nền glass nhẹ, anchor link */
function Header() {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Review", href: "#review" },
  ];

  return (
    <header className="site-header glass">
      <div className="container header__inner">
        <a href="#home" className="logo">
          <span className="logo__main">Royal</span>
          <span className="logo__accent">Fitness</span>
        </a>

        <Navigation
          links={links}
          onCtaClick={() => {
            const el = document.getElementById("join-section");
            if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
          }}
          ctaLabel="Join Us"
          className="header__nav"
        />

        <div className="header__extra">
          <Button as="a" href="#pricing" variant="outline" size="sm">
            View Plans
          </Button>
        </div>
      </div>

      <div className="header__divider" />
    </header>
  );
}

export default Header;
