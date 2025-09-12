import React from "react";
// Import các icon từ Font Awesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faChartLine, faClock, faBell, faExclamationTriangle, faBan } from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboard() {
  return (
    <div className="admin__section">
      <h2 className="admin__title">Dashboard</h2>

      <div className="admin__grid">
        <div className="admin-card">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faUsers} /> {/* Icon Users */}
            </div>
            <div className="admin-card__title">Joined Members</div>
            <div className="admin-card__value">312</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faChartLine} /> {/* Icon Chart */}
            </div>
            <div className="admin-card__title">Monthly Joined</div>
            <div className="admin-card__value">27</div>
          </div>
        </div>

        <div className="admin-card admin-card--dark">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faClock} /> {/* Icon Clock */}
            </div>
            <div className="admin-card__title">Expiring ≤ 3 days</div>
            <div className="admin-card__value">5</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faBell} /> {/* Icon Bell */}
            </div>
            <div className="admin-card__title">Expiring 4–7 days</div>
            <div className="admin-card__value">12</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {/* Icon Warning */}
            </div>
            <div className="admin-card__title">Expired</div>
            <div className="admin-card__value">9</div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card__body">
            <div className="admin-card__icon">
              <FontAwesomeIcon icon={faBan} /> {/* Icon Ban */}
            </div>
            <div className="admin-card__title">Inactive Members</div>
            <div className="admin-card__value">3</div>
          </div>
        </div>
      </div>
    </div>
  );
}