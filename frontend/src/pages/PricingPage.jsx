import React from 'react';

const PricingPage = () => {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Pricing Plans</h2>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-6 bg-white rounded shadow">Basic</div>
        <div className="p-6 bg-white rounded shadow">Pro</div>
        <div className="p-6 bg-white rounded shadow">Enterprise</div>
      </div>
    </div>
  );
};

export default PricingPage;
