import React, { useState, useEffect } from 'react';
import { Mail, User, Check, Clock, Shield, DollarSign, PawPrint, Share2, Copy, Facebook, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FacebookShareButton, TwitterShareButton } from 'react-share';
import { submitWaitlistSignup, getWaitlistStats } from '../lib/waitlist';
import { trackSocialShare } from '../lib/analytics';

const dogBreeds = [
  'Labrador Retriever',
  'German Shepherd',
  'Golden Retriever',
  'French Bulldog',
  'Bulldog',
  'Poodle',
  'Beagle',
  'Rottweiler',
  'Dachshund',
  'Yorkshire Terrier',
  'Boxer',
  'Australian Shepherd',
  'Siberian Husky',
  'Great Dane',
  'Doberman Pinscher',
  'Miniature Schnauzer',
  'Shih Tzu',
  'Boston Terrier',
  'Bernese Mountain Dog',
  'Pomeranian',
  'Havanese',
  'Shetland Sheepdog',
  'Brittany',
  'English Springer Spaniel',
  'Belgian Malinois',
  'Mixed Breed / Other'
];

const WaitlistForm = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [dogBreed, setDogBreed] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [signupData, setSignupData] = useState<any>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [waitlistCount, setWaitlistCount] = useState(2547);

  useEffect(() => {
    // Load real waitlist count
    const loadWaitlistStats = async () => {
      try {
        const stats = await getWaitlistStats();
        setWaitlistCount(stats.totalSignups);
      } catch (error) {
        console.error('Error loading waitlist stats:', error);
        // Keep default count on error
      }
    };
    
    loadWaitlistStats();
    
    // Update count periodically
    const interval = setInterval(loadWaitlistStats, 30000);
    return () => clearInterval(interval);
  }, []);

  // Check for referral code in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      sessionStorage.setItem('referral_code', referralCode);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const referralCode = sessionStorage.getItem('referral_code');
      
      const result = await submitWaitlistSignup({
        email,
        firstName: firstName || undefined,
        dogBreed: dogBreed || undefined,
        referredBy: referralCode || undefined
      });
      
      if (result.success) {
        setSignupData(result.data);
        setIsSubmitted(true);
        setWaitlistCount(prev => prev + 1);
        
        // Clear form
        setEmail('');
        setFirstName('');
        setDogBreed('');
      } else {
        setError(result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyReferral = () => {
    const shareUrl = `${window.location.origin}?ref=${signupData.referral_code}`;
    navigator.clipboard.writeText(shareUrl);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSocialShare = (platform: string) => {
    trackSocialShare(platform, signupData.referral_code);
  };

  const shareText = "I just joined the waitlist for Furlief - affordable pet allergy medication coming soon! Join me and get early access:";
  const shareUrl = signupData ? `${window.location.origin}?ref=${signupData.referral_code}` : '';

  if (isSubmitted && signupData) {
    return (
      <section id="waitlist" className="py-16 md:py-24 bg-[#FFF8E8]">
        <div className="container mx-auto px-4 md:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-2xl mx-auto"
          >
            <div className="text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-[#F9A826]/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Check size={40} className="text-[#F9A826]" />
              </motion.div>
              
              <h3 className="text-2xl font-bold text-[#0E2A47] mb-4">
                Welcome to the Furlief Family!
              </h3>
              
              <p className="text-[#0E2A47]/80 mb-2">
                You're #{signupData.position || 'TBD'} on our waitlist
              </p>
              
              <p className="text-[#0E2A47]/80 mb-8">
                You've joined <span className="font-semibold">{waitlistCount.toLocaleString()}</span> pet parents waiting for affordable allergy relief.
              </p>

              <div className="bg-[#F9A826]/5 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-[#0E2A47] mb-6">Share & Move Up the Waitlist</h4>
                
                <div className="flex flex-col space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                    <span className="text-sm text-[#0E2A47]/70 truncate mr-4">
                      {shareUrl}
                    </span>
                    <button
                      onClick={handleCopyReferral}
                      className="flex items-center text-[#F9A826] hover:text-[#F9A826]/80 transition-colors"
                    >
                      {isCopied ? <Check size={18} /> : <Copy size={18} />}
                      <span className="ml-2 text-sm font-medium">
                        {isCopied ? 'Copied!' : 'Copy'}
                      </span>
                    </button>
                  </div>

                  <div className="flex space-x-4">
                    <FacebookShareButton 
                      url={shareUrl} 
                      quote={shareText} 
                      className="flex-1"
                      onClick={() => handleSocialShare('facebook')}
                    >
                      <button className="w-full flex items-center justify-center space-x-2 bg-[#1877F2] text-white px-4 py-2 rounded-lg hover:bg-[#1877F2]/90 transition-colors">
                        <Facebook size={18} />
                        <span>Share</span>
                      </button>
                    </FacebookShareButton>

                    <TwitterShareButton 
                      url={shareUrl} 
                      title={shareText} 
                      className="flex-1"
                      onClick={() => handleSocialShare('twitter')}
                    >
                      <button className="w-full flex items-center justify-center space-x-2 bg-[#1DA1F2] text-white px-4 py-2 rounded-lg hover:bg-[#1DA1F2]/90 transition-colors">
                        <Twitter size={18} />
                        <span>Tweet</span>
                      </button>
                    </TwitterShareButton>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center space-x-2 text-[#0E2A47]/70">
                <Clock size={18} />
                <span>Expected launch: November 2026</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="waitlist" className="py-16 md:py-24 bg-[#FFF8E8]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0E2A47] mb-4">Join Our Waitlist</h2>
          <p className="text-[#0E2A47]/80 max-w-2xl mx-auto">
            Be the first to know when affordable pet allergy relief becomes available
          </p>
          <div className="mt-4 inline-flex items-center bg-[#F9A826]/10 px-4 py-2 rounded-full">
            <span className="text-sm font-medium text-[#F9A826]">
              {waitlistCount.toLocaleString()} pet parents already joined
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-10 max-w-2xl mx-auto">
          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 pb-8 border-b border-gray-100">
            <div className="flex items-start space-x-3">
              <div className="bg-[#F9A826]/10 p-2 rounded-lg">
                <Shield size={20} className="text-[#F9A826]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0E2A47] mb-1">Early Access</h4>
                <p className="text-sm text-[#0E2A47]/70">First in line when we launch</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#F9A826]/10 p-2 rounded-lg">
                <DollarSign size={20} className="text-[#F9A826]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0E2A47] mb-1">Special Pricing</h4>
                <p className="text-sm text-[#0E2A47]/70">Exclusive waitlist discounts</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-[#F9A826]/10 p-2 rounded-lg">
                <PawPrint size={20} className="text-[#F9A826]" />
              </div>
              <div>
                <h4 className="font-medium text-[#0E2A47] mb-1">Pet Care Tips</h4>
                <p className="text-sm text-[#0E2A47]/70">Monthly allergy insights</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[#0E2A47] mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E2A47]/50" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none transition-all"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-[#0E2A47]/60">
                We'll send exclusive early-access offers to this address
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-[#0E2A47] mb-2">
                  First Name <span className="text-[#0E2A47]/50 text-xs">(Optional)</span>
                </label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#0E2A47]/50" />
                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Your first name"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none transition-all"
                  />
                </div>
                <p className="mt-1 text-sm text-[#0E2A47]/60">
                  Helps us personalize your experience
                </p>
              </div>
              
              <div>
                <label htmlFor="dogBreed" className="block text-sm font-medium text-[#0E2A47] mb-2">
                  Dog Breed <span className="text-[#0E2A47]/50 text-xs">(Optional)</span>
                </label>
                <select
                  id="dogBreed"
                  value={dogBreed}
                  onChange={(e) => setDogBreed(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#F9A826] focus:border-transparent outline-none transition-all appearance-none bg-white"
                >
                  <option value="">Select your dog's breed</option>
                  {dogBreeds.map((breed) => (
                    <option key={breed} value={breed}>
                      {breed}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-[#0E2A47]/60">
                  Allows us to provide breed-specific allergy information
                </p>
              </div>
            </div>
            
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="bg-[#F9A826]/5 rounded-lg p-4 text-sm text-[#0E2A47]/80">
              <p className="flex items-center">
                <Clock size={16} className="mr-2 text-[#F9A826]" />
                <span>Expected launch: November 2026</span>
              </p>
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full bg-[#F9A826] hover:bg-[#F9A826]/90 text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 ${
                isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white\" xmlns="http://www.w3.org/2000/svg\" fill="none\" viewBox="0 0 24 24">
                    <circle className="opacity-25\" cx="12\" cy="12\" r="10\" stroke="currentColor\" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Joining...
                </span>
              ) : (
                'Join Waitlist'
              )}
            </button>
            
            <p className="text-center text-[#0E2A47]/60 text-sm">
              By joining, you agree to receive updates about Furlief's launch and pet care tips
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default WaitlistForm;