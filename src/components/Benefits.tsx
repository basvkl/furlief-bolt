import React from 'react';
import { Check, DollarSign, Laptop } from 'lucide-react';

const BenefitCard = ({ icon, title, description }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-[#FFF8E8] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="bg-[#F9A826]/20 w-12 h-12 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-[#0E2A47] mb-2">{title}</h3>
      <p className="text-[#0E2A47]/70">{description}</p>
    </div>
  );
};

const Benefits = () => {
  return (
    <section id="benefits" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">Why Choose Furlief?</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Furlief makes pet allergy medication accessible and affordable for all dog owners
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          <BenefitCard 
            icon={<Check size={24} className="text-[#F9A826]" />}
            title="Vet-Prescribed"
            description="The same trusted medication prescribed by veterinarians nationwide for dog allergies and itching"
          />
          
          <BenefitCard 
            icon={<DollarSign size={24} className="text-[#F9A826]" />}
            title="Effective & Affordable"
            description="High-quality, affordable alternative to expensive brand-name allergy medications"
          />
          
          <BenefitCard 
            icon={<Laptop size={24} className="text-[#F9A826]" />}
            title="Online Convenience"
            description="Easy online ordering with medication delivered directly to your door"
          />
        </div>
      </div>
    </section>
  );
};

export default Benefits;