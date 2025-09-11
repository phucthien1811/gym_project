import React from 'react';

const WishlistIcon = ({ active = false, onToggle }) => {
  return (
    <button
      aria-pressed={active}
      onClick={() => onToggle && onToggle(!active)}
      className={`p-2 rounded-full transition-colors ${active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      {active ? (
        // filled heart
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" />
        </svg>
      ) : (
        // outline heart
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.636l1.318-1.318a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
        </svg>
      )}
    </button>
  );
};

export default WishlistIcon;
