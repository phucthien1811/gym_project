import React from 'react';

export default function AdminOrders() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Orders</h2>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Date</th>
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

