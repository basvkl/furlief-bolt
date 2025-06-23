import React from 'react';
import { ClipboardList, Bell, ShieldCheck } from 'lucide-react';

const Step = ({ number, icon, title, description }: {
  number: number;
  icon: React.ReactNode;
  title: string;
  description: string;
}) => {
  return (
    <div className="relative">
      <div className="flex flex-col items-center">
        <div className="bg-[#F9A826] w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4 relative z-10">
          {number}
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm text-center w-full">
          <div className="text-[#0E2A47] mb-3">{icon}</div>
          <h3 className="text-xl font-semibold text-[#0E2A47] mb-2">{title}</h3>
          <p className="text-[#0E2A47]/70">{description}</p>
        </div>
      </div>
    </div>
  );
};

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[#F9A826]/5">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">How It Works</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Simple steps to get affordable allergy relief for your dog
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative">
          {/* Connection line for desktop */}
          <div className="hidden md:block absolute top-12 left-[25%] right-[25%] h-0.5 bg-[#F9A826]/30 z-0"></div>
          
          <Step 
            number={1}
            icon={<ClipboardList size={32} className="mx-auto text-[#F9A826]" />}
            title="Join the Waitlist"
            description="Sign up with your email to be among the first to know when Furlief launches"
          />
          
          <Step 
            number={2}
            icon={<Bell size={32} className="mx-auto text-[#F9A826]" />}
            title="Get Notified"
            description="Receive updates about our launch in November 2026 and early access opportunities"
          />
          
          <Step 
            number={3}
            icon={<ShieldCheck size={32} className="mx-auto text-[#F9A826]" />}
            title="Access Affordable Relief"
            description="Once launched, get your dog's allergy medication at a fraction of the current price"
          />
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;