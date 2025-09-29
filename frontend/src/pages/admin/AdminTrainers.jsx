import React from 'react';

export default function AdminTrainers() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Trainers (PT)</h2>
        <button className="btn btn--primary btn-md">+ Add Trainer</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Specialization</th>
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

