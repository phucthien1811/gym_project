import React from 'react';

export default function AdminInvoices() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Invoices & Payments</h2>
        <button className="btn btn--primary btn-md">Create Invoice</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Member</th>
                <th>Amount</th>
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

