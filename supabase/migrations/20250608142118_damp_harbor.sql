/*
  # Fix waitlist signup RLS policy

  1. Security Updates
    - Drop and recreate the INSERT policy for waitlist_signups table
    - Ensure anonymous users can insert new signups
    - Maintain existing SELECT policies for admins and users

  This migration fixes the RLS policy violation that prevents anonymous users
  from signing up for the waitlist.
*/

-- Drop the existing INSERT policy
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON waitlist_signups;

-- Create a new INSERT policy that explicitly allows anonymous and authenticated users
CREATE POLICY "Allow public waitlist signups"
  ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Ensure the table has RLS enabled (should already be enabled)
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;