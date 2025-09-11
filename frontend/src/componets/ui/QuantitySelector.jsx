import React from 'react';

const QuantitySelector = ({ value = 1, min = 1, max = 99, onChange }) => {
  const dec = () => {
    const next = Math.max(min, value - 1);
    onChange && onChange(next);
  };
  const inc = () => {
    const next = Math.min(max, value + 1);
    onChange && onChange(next);
  };

  return (
    <div className="inline-flex items-center border rounded-md overflow-hidden">
      <button onClick={dec} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">-</button>
      <input
        className="w-12 text-center px-2 py-1 outline-none"
        value={value}
        onChange={(e) => onChange && onChange(Math.max(min, Math.min(max, Number(e.target.value) || min)))}
        type="number"
        min={min}
        max={max}
      />
      <button onClick={inc} className="px-3 py-1 bg-gray-100 hover:bg-gray-200">+</button>
    </div>
  );
};

export default QuantitySelector;
