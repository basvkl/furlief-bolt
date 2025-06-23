import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Benefits from './components/Benefits';
import Testimonials from './components/Testimonials';
import ValueProposition from './components/ValueProposition';
import DogAllergyQuiz from './components/DogAllergyQuiz';
import Blog from './components/Blog';
import WaitlistForm from './components/WaitlistForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import BlogPage from './pages/BlogPage';
import WaitlistLandingPage from './pages/WaitlistLandingPage';
import AdminDashboard from './pages/AdminDashboard';
import ExitIntentModal from './components/ExitIntentModal';
import { useExitIntent } from './hooks/useExitIntent';
import { initializeAnalytics, trackPageView, trackReferralClick } from './lib/analytics';

const HomePage = () => {
  const { showModal, setShowModal } = useExitIntent(5000);

  useEffect(() => {
    document.title = "Furlief | Dog Allergy Relief Waitlist";

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Open+Sans:wght@400;500;600&display=swap';
    document.head.appendChild(link);
    
    document.body.style.fontFamily = "'Open Sans', sans-serif";
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="bg-[#FFF8E8] min-h-screen">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <WaitlistForm />
        <Testimonials />
        <ValueProposition />
        <DogAllergyQuiz />
        <Blog />
        <FAQ />
      </main>
      <Footer />
      <ExitIntentModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
};

function App() {
  useEffect(() => {
    // Initialize analytics tracking
    initializeAnalytics();

    // Check for referral code in URL and track it
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    if (referralCode) {
      trackReferralClick(referralCode);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/waitlist" element={<WaitlistLandingPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;