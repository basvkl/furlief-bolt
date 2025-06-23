import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, DollarSign, Check, Star } from 'lucide-react';
import Header from '../components/Header';

const WaitlistLandingPage = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [joinButtons, setJoinButtons] = useState<HTMLAnchorElement[]>([]);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Find and store all join waitlist buttons when component mounts
  useEffect(() => {
    const buttons = Array.from(document.querySelectorAll('a[href="#top"]')) as HTMLAnchorElement[];
    setJoinButtons(buttons);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Disable all join waitlist buttons
    joinButtons.forEach(button => {
      button.style.opacity = '0.5';
      button.style.pointerEvents = 'none';
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FFF8E8] to-white"></div>
        <div className="container mx-auto px-4 pt-20 pb-16 md:pt-32 md:pb-24 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm mb-6">
              <Shield size={20} className="text-[#F9A826] mr-2" />
              <span className="text-sm font-medium text-[#0E2A47]">
                FDA-Approved Generic Alternative
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-[#0E2A47] mb-6 leading-tight">
              Save 70% on Your Dog's<br />Allergy Medication
            </h1>
            
            <p className="text-xl md:text-2xl text-[#0E2A47]/80 mb-8 max-w-2xl mx-auto">
              Join thousands of pet parents waiting for Furlief - the affordable alternative to Apoquel® launching November 2026
            </p>

            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                <div className="flex gap-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#F9A826] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#F9A826]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </div>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 text-green-800 px-6 py-4 rounded-lg inline-flex items-center"
              >
                <Check size={24} className="mr-2" />
                <span>Thank you for joining! Check your email for confirmation.</span>
              </motion.div>
            )}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-[#0E2A47]/60">
            <div className="flex items-center">
              <Star size={20} className="text-[#F9A826] fill-current" />
              <span className="ml-2">2,500+ on waitlist</span>
            </div>
            <div className="flex items-center">
              <DollarSign size={20} className="text-[#F9A826]" />
              <span className="ml-2">70% cost savings</span>
            </div>
            <div className="flex items-center">
              <Shield size={20} className="text-[#F9A826]" />
              <span className="ml-2">FDA-approved formula</span>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-16 bg-[#FFF8E8]">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[#0E2A47] mb-4">
                  Current Apoquel® Costs
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Monthly Cost</span>
                    <span className="font-bold text-red-600">$220</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span>Yearly Cost</span>
                    <span className="font-bold text-red-600">$2,640</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-xl font-semibold text-[#0E2A47] mb-4">
                  Expected Furlief Costs
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Monthly Cost</span>
                    <span className="font-bold text-green-600">$66</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span>Yearly Cost</span>
                    <span className="font-bold text-green-600">$792</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 text-center">
              <a 
                href="#top"
                className="inline-flex items-center bg-[#F9A826] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#F9A826]/90 transition-colors"
              >
                Join the Waitlist
                <ArrowRight size={20} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WaitlistLandingPage;