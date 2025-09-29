import React from 'react';

export default function AdminProducts() {
  return (
    <div className="admin__section">
      <div className="admin__section-head">
        <h2 className="admin__title">Products</h2>
        <button className="btn btn--primary btn-md">+ Add Product</button>
      </div>

      <div className="admin__table-wrap">
        <table className="admin__table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
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

