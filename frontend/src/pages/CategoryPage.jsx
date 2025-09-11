import React from 'react';

const CategoryPage = () => {
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded shadow">Item 1</div>
        <div className="p-4 bg-white rounded shadow">Item 2</div>
        <div className="p-4 bg-white rounded shadow">Item 3</div>
      </div>
    </div>
  );
};

export default CategoryPage;
