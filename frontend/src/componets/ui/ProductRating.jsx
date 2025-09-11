import React from 'react';

const Star = ({ filled }) => (
  <svg className={`h-4 w-4 ${filled ? 'text-yellow-400' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.966a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118L10 13.347l-3.37 2.448c-.784.57-1.84-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.642 9.393c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.286-3.966z" />
  </svg>
);

const ProductRating = ({ value = 0, count = 0 }) => {
  const full = Math.round(value);
  return (
    <div className="flex items-center space-x-2">
      <div className="flex -space-x-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} filled={i < full} />
        ))}
      </div>
      <div className="text-sm text-gray-600">{value.toFixed(1)} ({count})</div>
    </div>
  );
};

export default ProductRating;
