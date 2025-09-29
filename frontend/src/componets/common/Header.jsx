import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Navigation from "./Navigation";
import Button from "./Button";
import { useAuth } from "../../context/AuthContext.jsx";

function Header() {
  const links = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Pricing", href: "#pricing" },
    { label: "Review", href: "#review" },
    { label: "Shop", href: "#shop" },
  ];

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="site-header glass">
      <div className="container header__inner">
        <a href="#home" className="logo">
          <span className="logo__main">Royal</span>
          <span className="logo__accent">Fitness</span>
        </a>

        {/* Menu */}
        <Navigation links={links} className="header__nav" />

        <div className="header__extra" style={{ display: "flex", gap: 8 }}>
          {!user ? (
            <>
              <Button as={Link} to="/login" variant="outline" size="sm">
                Login
              </Button>
              <Button as={Link} to="/register" variant="outline" size="sm">
                Register
              </Button>
            </>
          ) : (
            <>
              {user.role === "admin" && (
                <Button as={Link} to="/admin" variant="outline" size="sm">
                  Admin
                </Button>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </>
          )}
        </div>
      </div>

      <div className="header__divider" />
    </header>
  );
}

export default Header;
