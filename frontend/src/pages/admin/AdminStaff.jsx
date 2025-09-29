import React from 'react';

export default function AdminStaff() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Staff & Permissions</h2>
        <button className="btn btn--primary btn-md">+ Add Staff Member</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
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

