import React from 'react';

const formatCurrency = (value) => {
  if (value == null) return '';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const PriceDisplay = ({ price, compareAt }) => {
  const onSale = compareAt && compareAt > price;

  return (
    <div className="flex items-center space-x-3">
      <div className="text-lg font-semibold text-gray-900">{formatCurrency(price)}</div>
      {onSale && (
        <div className="text-sm text-gray-500 line-through">{formatCurrency(compareAt)}</div>
      )}
      {onSale && (
        <div className="ml-2 rounded-full bg-red-100 text-red-700 text-xs px-2 py-0.5">Sale</div>
      )}
    </div>
  );
};

export default PriceDisplay;
