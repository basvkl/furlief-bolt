import { supabase } from './supabase';
import { trackWaitlistSignup } from './analytics';

export interface WaitlistSignupData {
  email: string;
  firstName?: string;
  dogBreed?: string;
  referredBy?: string;
}

export const submitWaitlistSignup = async (data: WaitlistSignupData) => {
  try {
    // Check if email already exists
    const { data: existingSignup, error: checkError } = await supabase
      .from('waitlist_signups')
      .select('id, email, referral_code, position')
      .eq('email', data.email)
      .maybeSingle();

    // If there's an error checking for existing signup, log it but continue
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing signup:', checkError);
    }

    if (existingSignup) {
      return {
        success: true,
        data: existingSignup,
        message: 'You are already on the waitlist!'
      };
    }

    // Find referrer if referral code provided
    let referrerId = null;
    if (data.referredBy) {
      const { data: referrer, error: referrerError } = await supabase
        .from('waitlist_signups')
        .select('id')
        .eq('referral_code', data.referredBy)
        .maybeSingle();
      
      if (referrerError) {
        console.error('Error finding referrer:', referrerError);
      } else if (referrer) {
        referrerId = referrer.id;
      }
    }

    // Insert new signup
    const { data: newSignup, error } = await supabase
      .from('waitlist_signups')
      .insert({
        email: data.email,
        first_name: data.firstName || null,
        dog_breed: data.dogBreed || null,
        referred_by: referrerId,
        metadata: {
          signup_source: 'website',
          user_agent: navigator.userAgent,
          timestamp: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (error) {
      console.error('Database insert error:', error);
      
      // Handle specific error cases
      if (error.code === '23505') {
        // Unique constraint violation
        if (error.message.includes('email')) {
          return {
            success: false,
            error: 'Email already exists',
            message: 'This email is already on the waitlist.'
          };
        }
      }
      
      throw error;
    }

    // Track the signup (don't let tracking errors fail the signup)
    try {
      await trackWaitlistSignup(data.email, newSignup.referral_code, newSignup.id);
    } catch (trackingError) {
      console.error('Analytics tracking error:', trackingError);
    }

    return {
      success: true,
      data: newSignup,
      message: 'Successfully joined the waitlist!'
    };
  } catch (error) {
    console.error('Waitlist signup error:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to join waitlist. Please try again.';
    
    if (error instanceof Error) {
      if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Permission error. Please try again or contact support.';
      }
    }
    
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: errorMessage
    };
  }
};

export const getWaitlistStats = async () => {
  try {
    const { count, error } = await supabase
      .from('waitlist_signups')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching waitlist stats:', error);
      return { totalSignups: 2547 }; // Fallback to default
    }

    return {
      totalSignups: count || 0
    };
  } catch (error) {
    console.error('Error fetching waitlist stats:', error);
    return {
      totalSignups: 2547 // Fallback to default
    };
  }
};

export const submitQuizResponse = async (responses: any[], severityLevel: string) => {
  try {
    const sessionId = sessionStorage.getItem('furlief_session_id') || 
      `session_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    const { error } = await supabase
      .from('quiz_responses')
      .insert({
        session_id: sessionId,
        responses: { answers: responses },
        severity_level: severityLevel
      });

    if (error) {
      console.error('Quiz response error:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Quiz response error:', error);
    return { success: false, error };
  }
};