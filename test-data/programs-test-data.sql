-- ============================================================================
-- POWERLIFTING APP - TEST PROGRAMS DATA
-- ============================================================================
-- This file contains INSERT statements for testing program functionality
--
-- BEFORE RUNNING:
-- 1. Replace 'YOUR_COACH_ID' with an actual coach user ID from your profiles table
-- 2. Replace 'YOUR_ATHLETE_ID' with an actual athlete user ID from your profiles table
-- 3. Replace exercise IDs with actual IDs from your exercises table
--
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- ============================================================================
-- PROGRAM 1: Starting Strength (Beginner Program)
-- ============================================================================

-- Create the program
INSERT INTO programs (id, name, description, coach_id, duration_weeks, difficulty_level, is_public, created_at, updated_at)
VALUES (
  'prog-001-starting-strength',
  'Starting Strength - Beginner Program',
  'A classic strength training program for beginners focusing on compound movements. This program runs 3 days per week and builds a solid foundation through progressive overload on the main lifts: Squat, Bench Press, Deadlift, and Press.',
  'YOUR_COACH_ID', -- REPLACE THIS
  12,
  'beginner',
  true,
  NOW(),
  NOW()
);

-- Create blocks for Starting Strength
INSERT INTO program_blocks (id, program_id, name, description, start_week, end_week, focus, block_order, created_at, updated_at)
VALUES
  (
    'block-001-ss-phase1',
    'prog-001-starting-strength',
    'Phase 1: Foundation',
    'Learning the movements and establishing baseline strength',
    1,
    4,
    'Movement patterns and technique',
    1,
    NOW(),
    NOW()
  ),
  (
    'block-002-ss-phase2',
    'prog-001-starting-strength',
    'Phase 2: Linear Progression',
    'Continued linear progression with increased volume',
    5,
    8,
    'Building strength',
    2,
    NOW(),
    NOW()
  ),
  (
    'block-003-ss-phase3',
    'prog-001-starting-strength',
    'Phase 3: Advanced LP',
    'Final phase of linear progression before intermediate programming',
    9,
    12,
    'Maximum novice gains',
    3,
    NOW(),
    NOW()
  );

-- Create workouts for Phase 1 (Weeks 1-4)
-- Workout A: Squat, Bench, Deadlift
INSERT INTO workouts (id, program_block_id, name, description, week_number, day_of_week, estimated_duration_minutes, created_by, is_template, created_at, updated_at)
VALUES
  ('workout-001-ss-w1-a', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 1, 'Monday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-002-ss-w1-b', 'block-001-ss-phase1', 'Workout B', 'Squat, Press, Power Clean', 1, 'Wednesday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-003-ss-w1-a2', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 1, 'Friday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),

  ('workout-004-ss-w2-a', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 2, 'Monday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-005-ss-w2-b', 'block-001-ss-phase1', 'Workout B', 'Squat, Press, Power Clean', 2, 'Wednesday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-006-ss-w2-a2', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 2, 'Friday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),

  ('workout-007-ss-w3-a', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 3, 'Monday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-008-ss-w3-b', 'block-001-ss-phase1', 'Workout B', 'Squat, Press, Power Clean', 3, 'Wednesday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-009-ss-w3-a2', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 3, 'Friday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),

  ('workout-010-ss-w4-a', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 4, 'Monday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-011-ss-w4-b', 'block-001-ss-phase1', 'Workout B', 'Squat, Press, Power Clean', 4, 'Wednesday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-012-ss-w4-a2', 'block-001-ss-phase1', 'Workout A', 'Squat, Bench Press, Deadlift', 4, 'Friday', 60, 'YOUR_COACH_ID', true, NOW(), NOW());

-- Add exercises to workouts (NOTE: Replace exercise IDs with your actual exercise IDs)
-- For demonstration, I'll use placeholder IDs - you MUST replace these

-- Workout A Template (Squat, Bench, Deadlift)
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, target_sets, target_reps, target_weight_lbs, target_rpe, rest_seconds, notes)
VALUES
  ('workout-001-ss-w1-a', 'SQUAT_EXERCISE_ID', 1, 3, '5', NULL, '7-8', 300, 'Focus on depth and bar path'),
  ('workout-001-ss-w1-a', 'BENCH_EXERCISE_ID', 2, 3, '5', NULL, '7-8', 240, 'Keep shoulder blades retracted'),
  ('workout-001-ss-w1-a', 'DEADLIFT_EXERCISE_ID', 3, 1, '5', NULL, '8', 300, 'Reset between each rep');

-- ============================================================================
-- PROGRAM 2: nSuns 5/3/1 (Intermediate Program)
-- ============================================================================

INSERT INTO programs (id, name, description, coach_id, duration_weeks, difficulty_level, is_public, created_at, updated_at)
VALUES (
  'prog-002-nsuns',
  'nSuns 5/3/1 LP',
  'High-volume intermediate program based on Jim Wendler''s 5/3/1. Features 4-5 training days per week with heavy emphasis on compound lifts and progressive overload. Expect significant strength and size gains.',
  'YOUR_COACH_ID',
  16,
  'intermediate',
  true,
  NOW(),
  NOW()
);

-- Create blocks
INSERT INTO program_blocks (id, program_id, name, description, start_week, end_week, focus, block_order, created_at, updated_at)
VALUES
  (
    'block-004-nsuns-1',
    'prog-002-nsuns',
    'Accumulation Phase',
    'Building work capacity and volume tolerance',
    1,
    8,
    'Hypertrophy and conditioning',
    1,
    NOW(),
    NOW()
  ),
  (
    'block-005-nsuns-2',
    'prog-002-nsuns',
    'Intensification Phase',
    'Increasing intensity while maintaining volume',
    9,
    16,
    'Strength and power',
    2,
    NOW(),
    NOW()
  );

-- Create sample workouts for week 1
INSERT INTO workouts (id, program_block_id, name, description, week_number, day_of_week, estimated_duration_minutes, created_by, is_template, created_at, updated_at)
VALUES
  ('workout-013-nsuns-w1-d1', 'block-004-nsuns-1', 'Bench + OHP Day', 'Heavy bench press with OHP accessory', 1, 'Monday', 90, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-014-nsuns-w1-d2', 'block-004-nsuns-1', 'Squat + Sumo Deadlift', 'Volume squats with sumo deadlift', 1, 'Tuesday', 90, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-015-nsuns-w1-d3', 'block-004-nsuns-1', 'OHP + Incline Bench', 'Heavy press with incline work', 1, 'Thursday', 75, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-016-nsuns-w1-d4', 'block-004-nsuns-1', 'Deadlift + Front Squat', 'Heavy deadlift with front squat volume', 1, 'Friday', 90, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-017-nsuns-w1-d5', 'block-004-nsuns-1', 'Accessories', 'Arms, back, and conditioning', 1, 'Saturday', 60, 'YOUR_COACH_ID', true, NOW(), NOW());

-- Add exercises to Monday (Bench Day)
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, target_sets, target_reps, target_weight_lbs, target_rpe, rest_seconds, notes)
VALUES
  ('workout-013-nsuns-w1-d1', 'BENCH_EXERCISE_ID', 1, 9, '1-8', NULL, '6-9', 180, '5/3/1+ protocol with joker sets'),
  ('workout-013-nsuns-w1-d1', 'OHP_EXERCISE_ID', 2, 8, '3-10', NULL, '6-8', 120, 'Volume work at 60-80% of training max'),
  ('workout-013-nsuns-w1-d1', 'DB_ROW_EXERCISE_ID', 3, 5, '8-12', NULL, '7', 90, 'Maintain upper back health');

-- ============================================================================
-- PROGRAM 3: Westside for Skinny Bastards (Advanced)
-- ============================================================================

INSERT INTO programs (id, name, description, coach_id, duration_weeks, difficulty_level, is_public, created_at, updated_at)
VALUES (
  'prog-003-wsfb',
  'Westside for Skinny Bastards',
  'Advanced conjugate method program combining max effort and dynamic effort training. Designed for experienced lifters looking to break through plateaus. Features frequent variation and high-intensity work.',
  'YOUR_COACH_ID',
  12,
  'advanced',
  true,
  NOW(),
  NOW()
);

-- Create blocks
INSERT INTO program_blocks (id, program_id, name, description, start_week, end_week, focus, block_order, created_at, updated_at)
VALUES
  (
    'block-006-wsfb-1',
    'prog-003-wsfb',
    'Conjugate Wave 1',
    'Max effort lower, max effort upper, dynamic effort, repetition effort',
    1,
    6,
    'Absolute strength and speed-strength',
    1,
    NOW(),
    NOW()
  ),
  (
    'block-007-wsfb-2',
    'prog-003-wsfb',
    'Conjugate Wave 2',
    'Increased variation and accessory volume',
    7,
    12,
    'Weak point training',
    2,
    NOW(),
    NOW()
  );

-- Create workouts for week 1
INSERT INTO workouts (id, program_block_id, name, description, week_number, day_of_week, estimated_duration_minutes, created_by, is_template, created_at, updated_at)
VALUES
  ('workout-018-wsfb-w1-me-lower', 'block-006-wsfb-1', 'Max Effort Lower', 'Work up to max effort squat variation', 1, 'Monday', 75, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-019-wsfb-w1-me-upper', 'block-006-wsfb-1', 'Max Effort Upper', 'Work up to max effort press variation', 1, 'Wednesday', 75, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-020-wsfb-w1-de-lower', 'block-006-wsfb-1', 'Dynamic Effort Lower', 'Speed squats and deadlift work', 1, 'Friday', 60, 'YOUR_COACH_ID', true, NOW(), NOW()),
  ('workout-021-wsfb-w1-re-upper', 'block-006-wsfb-1', 'Repetition Upper', 'High rep upper body work', 1, 'Saturday', 60, 'YOUR_COACH_ID', true, NOW(), NOW());

-- Add exercises to Max Effort Lower
INSERT INTO workout_exercises (workout_id, exercise_id, exercise_order, target_sets, target_reps, target_weight_lbs, target_rpe, rest_seconds, notes)
VALUES
  ('workout-018-wsfb-w1-me-lower', 'BOX_SQUAT_EXERCISE_ID', 1, 5, '1-3', NULL, '9-10', 300, 'Work up to 1-3RM, rotate variations weekly'),
  ('workout-018-wsfb-w1-me-lower', 'RDL_EXERCISE_ID', 2, 4, '6-8', NULL, '8', 180, 'Posterior chain development'),
  ('workout-018-wsfb-w1-me-lower', 'LEG_CURL_EXERCISE_ID', 3, 3, '10-15', NULL, '8', 90, 'Hamstring isolation');

-- ============================================================================
-- ATHLETE PROGRAM ENROLLMENTS
-- ============================================================================
-- Enroll an athlete in programs to test the athlete view

INSERT INTO athlete_programs (athlete_id, program_id, start_date, end_date, current_week, status, created_at, updated_at)
VALUES
  -- Active program
  (
    'YOUR_ATHLETE_ID',
    'prog-002-nsuns',
    CURRENT_DATE - INTERVAL '3 weeks',
    NULL,
    4,
    'active',
    NOW(),
    NOW()
  ),
  -- Paused program
  (
    'YOUR_ATHLETE_ID',
    'prog-003-wsfb',
    CURRENT_DATE - INTERVAL '8 weeks',
    NULL,
    5,
    'paused',
    NOW(),
    NOW()
  ),
  -- Completed program
  (
    'YOUR_ATHLETE_ID',
    'prog-001-starting-strength',
    CURRENT_DATE - INTERVAL '16 weeks',
    CURRENT_DATE - INTERVAL '4 weeks',
    12,
    'completed',
    NOW(),
    NOW()
  );

-- ============================================================================
-- QUICK REFERENCE: Common Exercise IDs to Replace
-- ============================================================================
-- Run this query in Supabase to get your exercise IDs:
--
-- SELECT id, name, category FROM exercises ORDER BY name;
--
-- Then replace the placeholders above:
-- - SQUAT_EXERCISE_ID
-- - BENCH_EXERCISE_ID
-- - DEADLIFT_EXERCISE_ID
-- - OHP_EXERCISE_ID (Overhead Press)
-- - DB_ROW_EXERCISE_ID (Dumbbell Row)
-- - BOX_SQUAT_EXERCISE_ID
-- - RDL_EXERCISE_ID (Romanian Deadlift)
-- - LEG_CURL_EXERCISE_ID
-- ============================================================================

-- To verify the data was inserted correctly, run:
-- SELECT * FROM programs;
-- SELECT * FROM program_blocks ORDER BY program_id, block_order;
-- SELECT * FROM workouts WHERE program_block_id LIKE 'block-001%' ORDER BY week_number, day_of_week;
-- SELECT * FROM athlete_programs;
