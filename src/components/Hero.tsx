import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, Clock, Users } from 'lucide-react';

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const launchDate = new Date('2026-11-01T00:00:00');
      const now = new Date();
      const difference = launchDate.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-4 text-[#0E2A47]">
      <div className="flex items-center">
        <Clock size={20} className="text-[#F9A826] mr-2" />
        <span className="font-semibold">Patent expires in:</span>
      </div>
      <div className="flex space-x-3">
        <div className="bg-white px-3 py-1 rounded-lg shadow-sm">
          <span className="font-bold">{timeLeft.days}</span>
          <span className="text-sm ml-1">days</span>
        </div>
        <div className="bg-white px-3 py-1 rounded-lg shadow-sm">
          <span className="font-bold">{timeLeft.hours}</span>
          <span className="text-sm ml-1">hrs</span>
        </div>
      </div>
    </div>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 bg-[#FFF8E8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-8">
            <div className="flex items-center mb-6 animate-fade-in">
              <Shield size={20} className="text-[#F9A826] mr-2" />
              <span className="text-sm font-medium bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full">
                Veterinarian Approved
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#0E2A47] mb-4 leading-tight">
              Allergy relief for your dog
            </h1>
            
            <div className="mb-6">
              <CountdownTimer />
            </div>
            
            <p className="text-xl md:text-2xl text-[#0E2A47]/80 mb-8 max-w-xl">
              Fast-acting treatment for itching and allergies, delivered to your door at <span className="font-semibold text-[#F9A826]">70% less</span> than Apoquel
            </p>
            
            <div className="flex items-center space-x-6 mb-8">
              <div className="flex items-center">
                <Users size={20} className="text-[#F9A826] mr-2" />
                <span className="text-[#0E2A47]/80">
                  <strong>2,500+</strong> pet parents on waitlist
                </span>
              </div>
              <div className="hidden md:block w-px h-6 bg-[#0E2A47]/10"></div>
              <div className="hidden md:block text-[#0E2A47]/80">
                <strong>1 in 5</strong> dogs suffer from allergies
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a 
                href="#waitlist" 
                className="w-full sm:w-auto inline-flex items-center justify-center bg-[#F9A826] hover:bg-[#F9A826]/90 text-white font-bold px-8 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Join the Waitlist
                <ArrowRight size={18} className="ml-2" />
              </a>
              <div className="text-sm text-[#0E2A47]/60">
                Limited early access spots available
              </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
                alt="Happy Golden Retriever" 
                className="rounded-2xl shadow-lg w-full h-auto object-cover"
              />
              <div className="absolute -bottom-10 -right-5 md:-right-10 bg-white rounded-xl shadow-md p-4 max-w-[200px]">
                <div className="relative">
                  <div className="bg-[#F9A826]/10 rounded-lg p-3">
                    <div className="text-center">
                      <div className="text-[#F9A826] font-bold text-lg">Furlief</div>
                      <div className="text-[#0E2A47] font-medium text-sm">oclacitinib tablets</div>
                      <div className="text-[#0E2A47]/70 text-xs mt-1">30 tablets, 5.4mg</div>
                      <div className="mt-2 text-sm font-semibold text-[#F9A826]">Save 70%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;