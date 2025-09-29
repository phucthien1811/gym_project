import React from 'react';

export default function AdminPlans() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Membership Plans</h2>
        <button className="btn btn--primary btn-md">+ Add Plan</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Plan Name</th>
              <th>Price</th>
              <th>Duration</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {/* Dữ liệu mẫu sẽ hiển thị ở đây */}
          </tbody>
        </table>
      </div>
    </div>
  );
}

