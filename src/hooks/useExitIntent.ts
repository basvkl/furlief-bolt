import { useState, useEffect } from 'react';

interface ExitIntentState {
  lastDismissed: number | null;
  hasSeenInSession: boolean;
}

export const useExitIntent = (delay: number = 0) => {
  const [showModal, setShowModal] = useState(false);
  const [hasScrolledEnough, setHasScrolledEnough] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    // Check local storage for previous dismissal
    const storedState = localStorage.getItem('exitIntentState');
    const state: ExitIntentState = storedState 
      ? JSON.parse(storedState)
      : { lastDismissed: null, hasSeenInSession: false };

    // If dismissed within last 3-7 days (random), don't show
    if (state.lastDismissed) {
      const daysSinceDismiss = (Date.now() - state.lastDismissed) / (1000 * 60 * 60 * 24);
      const randomDays = Math.floor(Math.random() * (7 - 3 + 1)) + 3;
      if (daysSinceDismiss < randomDays) {
        return;
      }
    }

    // If already seen in this session, don't show
    if (state.hasSeenInSession) {
      return;
    }

    let timeoutId: number;
    let activityTimeout: number;

    const handleScroll = () => {
      const scrollPercentage = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100;
      setHasScrolledEnough(scrollPercentage >= 50);
      setLastActivity(Date.now());
    };

    const handleActivity = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivity;
      if (inactiveTime >= 30000 && hasScrolledEnough && !state.hasSeenInSession) { // 30 seconds
        setShowModal(true);
        state.hasSeenInSession = true;
        localStorage.setItem('exitIntentState', JSON.stringify(state));
      }
    };

    // Set up event listeners after delay
    timeoutId = window.setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
      window.addEventListener('mousemove', handleActivity);
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('touchstart', handleActivity);
    }, delay);

    // Check for inactivity every second
    activityTimeout = window.setInterval(checkInactivity, 1000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(activityTimeout);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
    };
  }, [delay, hasScrolledEnough, lastActivity]);

  const handleClose = () => {
    setShowModal(false);
    const state: ExitIntentState = {
      lastDismissed: Date.now(),
      hasSeenInSession: true
    };
    localStorage.setItem('exitIntentState', JSON.stringify(state));
  };

  return {
    showModal,
    setShowModal: handleClose,
    hasTriggered: false // Kept for backward compatibility
  };
};