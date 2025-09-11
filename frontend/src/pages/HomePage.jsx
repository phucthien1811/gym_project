import React from 'react';

const HomePage = () => {
  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Welcome to Gym Project</h1>
          <p className="text-gray-600 mb-6">Find workouts, products, and plans to reach your goals.</p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded shadow">Workouts</div>
          <div className="p-6 bg-white rounded shadow">Nutrition</div>
          <div className="p-6 bg-white rounded shadow">Equipment</div>
        </div>
      </section>
    </main>
  );
};

export default HomePage;
