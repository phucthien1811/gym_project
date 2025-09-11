import React from 'react';

const ShopPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Shop</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">Product 1</div>
        <div className="p-4 bg-white rounded shadow">Product 2</div>
        <div className="p-4 bg-white rounded shadow">Product 3</div>
        <div className="p-4 bg-white rounded shadow">Product 4</div>
      </div>
    </div>
  );
};

export default ShopPage;
