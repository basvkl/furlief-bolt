import React, { useState } from 'react';
import { DollarSign } from 'lucide-react';

const PriceComparison = ({ currentSpending }: { currentSpending: number }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm">
    <h3 className="text-xl font-semibold text-[#0E2A47] mb-4">Price Comparison</h3>
    <div className="space-y-4">
      <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
        <div>
          <p className="font-medium text-red-700">Apoquel</p>
          <p className="text-sm text-red-600">Current market price</p>
        </div>
        <p className="font-bold text-red-700">${currentSpending}/month</p>
      </div>
      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
        <div>
          <p className="font-medium text-green-700">Furlief</p>
          <p className="text-sm text-green-600">Estimated price</p>
        </div>
        <p className="font-bold text-green-700">${Math.round(currentSpending * 0.3)}/month</p>
      </div>
      <div className="text-center mt-4">
        <p className="text-sm text-[#0E2A47]/70">*Prices based on 30-day supply</p>
      </div>
    </div>
  </div>
);

const SavingsCalculator = ({ currentSpending, setCurrentSpending }: {
  currentSpending: number;
  setCurrentSpending: (value: number) => void;
}) => {
  const [inputValue, setInputValue] = useState(currentSpending.toString());
  const savings = Math.round(currentSpending * 0.7);
  const yearlySavings = savings * 12;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    const numValue = value === '' ? 0 : Number(value);
    setCurrentSpending(numValue);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-[#0E2A47] mb-4">Calculate Your Savings</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#0E2A47] mb-2">
            Current Monthly Spending
          </label>
          <div className="relative">
            <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E2A47]/50" />
            <input
              type="number"
              value={inputValue}
              onChange={handleInputChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>
        
        <div className="bg-[#F9A826]/5 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[#0E2A47]/80">Monthly Savings:</span>
            <span className="font-bold text-[#F9A826]">${savings}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#0E2A47]/80">Yearly Savings:</span>
            <span className="font-bold text-[#F9A826]">${yearlySavings}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ValueProposition = () => {
  const [currentSpending, setCurrentSpending] = useState<number>(220);

  return (
    <section id="savings" className="py-16 md:py-24 bg-[#FFF8E8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">Save on Pet Care</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            See how much you could save with Furlief compared to current options
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <PriceComparison currentSpending={currentSpending} />
          <SavingsCalculator currentSpending={currentSpending} setCurrentSpending={setCurrentSpending} />
        </div>
      </div>
    </section>
  );
};

export default ValueProposition;