import React from 'react';

export default function AdminReports() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Revenue Reports</h2>
      </div>

      <div className="admin__table-wrap">
        <p style={{ padding: '20px', color: 'var(--text-normal)' }}>
          This is where you'll see financial reports, revenue charts, and other analytics.
        </p>
        {/* Component biểu đồ/báo cáo sẽ ở đây */}
      </div>
    </div>
  );
}

