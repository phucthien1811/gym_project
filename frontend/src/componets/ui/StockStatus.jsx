import React from 'react';

const StockStatus = ({ count = 0 }) => {
  if (count <= 0) {
    return <div className="text-sm text-red-600">Out of stock</div>;
  }
  if (count < 5) {
    return <div className="text-sm text-yellow-600">Only {count} left</div>;
  }
  return <div className="text-sm text-green-600">In stock</div>;
};

export default StockStatus;
