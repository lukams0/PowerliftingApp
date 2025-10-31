-- ============================================================================
-- CREATE TEST COACH PROFILE
-- ============================================================================
-- This script creates a test coach user for program development
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Create both profile and coach_profile in one query
WITH new_coach AS (
  INSERT INTO profiles (id, email, full_name, role, created_at, updated_at)
  VALUES (
    gen_random_uuid(),
    'coach@test.com',
    'Mike Tuchscherer',
    'coach',
    NOW(),
    NOW()
  )
  RETURNING id
)
INSERT INTO coach_profiles (user_id, bio, specialties, years_experience, certifications, created_at, updated_at)
SELECT
  id,
  'Elite powerlifting coach specializing in strength development and program design. Former competitive powerlifter with extensive experience training athletes from beginner to elite levels.',
  ARRAY['Powerlifting', 'Strength Training', 'Program Design', 'Biomechanics', 'Competition Prep'],
  15,
  ARRAY['CSCS', 'USAPL Coach Level 2', 'RTS Certified'],
  NOW(),
  NOW()
FROM new_coach
RETURNING user_id;

-- ============================================================================
-- TO USE THIS COACH:
-- ============================================================================
-- After creating the coach, get the coach ID:
SELECT id, email, full_name FROM profiles WHERE email = 'coach@test.com';

-- Then use that ID to replace 'YOUR_COACH_ID' in the programs-test-data.sql file
