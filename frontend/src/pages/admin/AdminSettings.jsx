import React from 'react';

export default function AdminSettings() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Settings</h2>
      </div>

      <div className="admin__table-wrap">
        <p style={{ padding: '20px', color: 'var(--text-normal)' }}>
          This is where you'll manage general gym settings like name, address, logo, and other configurations.
        </p>
        {/* Các form cài đặt sẽ ở đây */}
      </div>
    </div>
  );
}

