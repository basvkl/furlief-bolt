/*
  # Fix waitlist signups RLS policy

  1. Security Updates
    - Drop existing INSERT policy for waitlist_signups
    - Create new INSERT policy that properly allows anonymous users
    - Ensure the policy has correct WITH CHECK condition

  This migration fixes the "new row violates row-level security policy" error
  by ensuring anonymous users can properly insert waitlist signups.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Anyone can insert waitlist signups" ON waitlist_signups;

-- Create a new INSERT policy that allows anonymous and authenticated users
CREATE POLICY "Enable insert for anonymous users"
  ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);