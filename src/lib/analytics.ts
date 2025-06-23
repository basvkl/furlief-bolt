import { supabase } from './supabase';

// Generate or get session ID
const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('furlief_session_id');
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    sessionStorage.setItem('furlief_session_id', sessionId);
  }
  return sessionId;
};

// Track analytics events
export const trackEvent = async (
  eventType: string,
  eventData: Record<string, any> = {},
  userId?: string
) => {
  try {
    const sessionId = getSessionId();
    
    const { error } = await supabase.from('analytics_events').insert({
      session_id: sessionId,
      user_id: userId,
      event_type: eventType,
      event_data: eventData,
      page_url: window.location.href,
      user_agent: navigator.userAgent,
      created_at: new Date().toISOString()
    });

    if (error) {
      console.error('Analytics tracking error:', error);
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Specific tracking functions
export const trackPageView = (page: string) => {
  trackEvent('page_view', { page });
};

export const trackWaitlistSignup = (email: string, referralCode: string, userId?: string) => {
  trackEvent('waitlist_signup', { email, referral_code: referralCode }, userId);
};

export const trackQuizStart = () => {
  trackEvent('quiz_start');
};

export const trackQuizComplete = (responses: any[], severityLevel: string) => {
  trackEvent('quiz_complete', { responses, severity_level: severityLevel });
};

export const trackReferralClick = (referralCode: string) => {
  trackEvent('referral_click', { referral_code: referralCode });
};

export const trackExitIntent = () => {
  trackEvent('exit_intent_modal_shown');
};

export const trackSocialShare = (platform: string, referralCode: string) => {
  trackEvent('social_share', { platform, referral_code: referralCode });
};

// Auto-track page views
export const initializeAnalytics = () => {
  // Track initial page view
  trackPageView(window.location.pathname);
  
  // Track page views on navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function(...args) {
    originalPushState.apply(history, args);
    setTimeout(() => trackPageView(window.location.pathname), 0);
  };
  
  history.replaceState = function(...args) {
    originalReplaceState.apply(history, args);
    setTimeout(() => trackPageView(window.location.pathname), 0);
  };
  
  window.addEventListener('popstate', () => {
    trackPageView(window.location.pathname);
  });
};