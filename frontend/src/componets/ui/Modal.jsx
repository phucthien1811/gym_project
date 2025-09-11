import React from 'react';

const Modal = ({ open = false, onClose, children, title }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full mx-4 p-4 z-10">
        {title && <div className="text-lg font-semibold mb-2">{title}</div>}
        <div>{children}</div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="px-4 py-2 bg-gray-100 rounded">Close</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
