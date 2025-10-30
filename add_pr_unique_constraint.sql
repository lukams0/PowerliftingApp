-- Add unique constraint to personal_records table
-- This ensures only one PR per user per exercise
-- Run this in Supabase SQL Editor

-- First, remove any duplicate records (keeping the one with highest weight)
DELETE FROM personal_records a
USING personal_records b
WHERE a.id < b.id
  AND a.user_id = b.user_id
  AND a.exercise_id = b.exercise_id;

-- Add the unique constraint
ALTER TABLE personal_records
ADD CONSTRAINT personal_records_user_exercise_unique
UNIQUE (user_id, exercise_id);
