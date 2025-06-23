/*
  # Furlief Waitlist and Analytics System

  1. New Tables
    - `waitlist_signups`
      - `id` (uuid, primary key)
      - `email` (text, unique)
      - `first_name` (text, optional)
      - `dog_breed` (text, optional)
      - `referral_code` (text, unique)
      - `referred_by` (uuid, foreign key to waitlist_signups)
      - `position` (integer, auto-calculated)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
      - `status` (enum: active, converted, unsubscribed)
      - `metadata` (jsonb for additional data)

    - `analytics_events`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `user_id` (uuid, optional foreign key)
      - `event_type` (text: page_view, quiz_completed, waitlist_signup, etc.)
      - `event_data` (jsonb)
      - `page_url` (text)
      - `user_agent` (text)
      - `ip_address` (inet)
      - `created_at` (timestamp)

    - `quiz_responses`
      - `id` (uuid, primary key)
      - `session_id` (text)
      - `user_id` (uuid, optional foreign key)
      - `responses` (jsonb)
      - `severity_level` (text)
      - `created_at` (timestamp)

    - `admin_users`
      - `id` (uuid, primary key, foreign key to auth.users)
      - `email` (text)
      - `role` (text: admin, viewer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public access to analytics and waitlist signup
    - Add policies for admin access to dashboard data

  3. Functions
    - Auto-generate referral codes
    - Calculate waitlist positions
    - Update positions when users are removed
*/

-- Create custom types
CREATE TYPE waitlist_status AS ENUM ('active', 'converted', 'unsubscribed');
CREATE TYPE admin_role AS ENUM ('admin', 'viewer');

-- Waitlist signups table
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  first_name text,
  dog_breed text,
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES waitlist_signups(id),
  position integer,
  status waitlist_status DEFAULT 'active',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES waitlist_signups(id),
  event_type text NOT NULL,
  event_data jsonb DEFAULT '{}',
  page_url text,
  user_agent text,
  ip_address inet,
  created_at timestamptz DEFAULT now()
);

-- Quiz responses table
CREATE TABLE IF NOT EXISTS quiz_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text NOT NULL,
  user_id uuid REFERENCES waitlist_signups(id),
  responses jsonb NOT NULL,
  severity_level text,
  created_at timestamptz DEFAULT now()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  email text NOT NULL,
  role admin_role DEFAULT 'viewer',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policies for waitlist_signups
CREATE POLICY "Anyone can insert waitlist signups"
  ON waitlist_signups
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Users can read their own signup"
  ON waitlist_signups
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);

CREATE POLICY "Admins can read all signups"
  ON waitlist_signups
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admins can update signups"
  ON waitlist_signups
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policies for analytics_events
CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read analytics events"
  ON analytics_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- Policies for quiz_responses
CREATE POLICY "Anyone can insert quiz responses"
  ON quiz_responses
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read quiz responses"
  ON quiz_responses
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- Policies for admin_users
CREATE POLICY "Admins can read admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users 
      WHERE id = auth.uid()
    )
  );

-- Function to generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  code text;
  exists boolean;
BEGIN
  LOOP
    code := 'FURLIEF' || upper(substring(md5(random()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM waitlist_signups WHERE referral_code = code) INTO exists;
    IF NOT exists THEN
      EXIT;
    END IF;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate and update waitlist positions
CREATE OR REPLACE FUNCTION update_waitlist_positions()
RETURNS void AS $$
BEGIN
  WITH ranked_signups AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY created_at) as new_position
    FROM waitlist_signups
    WHERE status = 'active'
  )
  UPDATE waitlist_signups
  SET position = ranked_signups.new_position,
      updated_at = now()
  FROM ranked_signups
  WHERE waitlist_signups.id = ranked_signups.id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate referral code and update positions
CREATE OR REPLACE FUNCTION handle_new_waitlist_signup()
RETURNS trigger AS $$
BEGIN
  -- Generate referral code if not provided
  IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  
  -- Set updated_at
  NEW.updated_at := now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION handle_waitlist_position_update()
RETURNS trigger AS $$
BEGIN
  -- Update all positions when a signup is inserted, updated, or deleted
  PERFORM update_waitlist_positions();
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
DROP TRIGGER IF EXISTS on_waitlist_signup_insert ON waitlist_signups;
CREATE TRIGGER on_waitlist_signup_insert
  BEFORE INSERT ON waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_waitlist_signup();

DROP TRIGGER IF EXISTS on_waitlist_position_update ON waitlist_signups;
CREATE TRIGGER on_waitlist_position_update
  AFTER INSERT OR UPDATE OR DELETE ON waitlist_signups
  FOR EACH ROW
  EXECUTE FUNCTION handle_waitlist_position_update();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_email ON waitlist_signups(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_referral_code ON waitlist_signups(referral_code);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_status ON waitlist_signups(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_signups_created_at ON waitlist_signups(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_session_id ON analytics_events(session_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_session_id ON quiz_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_responses_created_at ON quiz_responses(created_at);