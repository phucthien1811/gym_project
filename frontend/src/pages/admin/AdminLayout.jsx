import React from "react";
import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import "../../styles/admin.css";
import { useAuth } from "../../context/AuthContext.jsx";

// Import các icon từ Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGaugeHigh, faUsers, faArrowRightFromBracket, faHouse } from '@fortawesome/free-solid-svg-icons';
// faGaugeHigh: icon Dashboard (hoặc faHome)
// faUsers: icon Members
// faArrowRightFromBracket: icon Logout
// faHouse: icon Back to site

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const nav = useNavigate();

  return (
    <div className="admin admin-theme">
      <aside className="admin__side">
        <div className="admin__brand">Admin Page</div>
        <nav className="admin__nav">
          <NavLink end to="/admin" className="admin__link">
            <FontAwesomeIcon icon={faGaugeHigh} className="admin__link-icon" /> {/* Icon Dashboard */}
            Dashboard
          </NavLink>
          <NavLink to="/admin/members" className="admin__link">
            <FontAwesomeIcon icon={faUsers} className="admin__link-icon" /> {/* Icon Members */}
            Members
          </NavLink>
          <button
            className="admin__link admin__link--danger"
            onClick={() => { logout(); nav("/"); }}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} className="admin__link-icon" /> {/* Icon Logout */}
            Logout
          </button>
        </nav>
      </aside>

      <div className="admin__main">
        <header className="admin__top">
          {/* Icon cho "Back to site" */}
          <Link to="/" className="admin__pill">
            <FontAwesomeIcon icon={faHouse} className="admin__pill-icon" /> {/* Icon Home */}
            ← Back to Home
          </Link>
          <div className="admin__user">{user?.name || "Admin"}</div>
        </header>
        <div className="admin__content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}