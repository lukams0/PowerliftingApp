# Program Test Data Setup Guide

This directory contains SQL scripts to populate your database with realistic test programs for development and testing.

## Quick Start

### Step 1: Get Your IDs

Run these queries in your Supabase SQL Editor to get the IDs you need:

```sql
-- Get a coach ID
SELECT id, email FROM profiles WHERE role = 'coach' LIMIT 1;

-- Get an athlete ID
SELECT id, email FROM profiles WHERE role = 'athlete' LIMIT 1;

-- Get exercise IDs
SELECT id, name, category FROM exercises ORDER BY name;
```

### Step 2: Replace Placeholders

Open `programs-test-data.sql` and replace these placeholders with your actual IDs:

- `YOUR_COACH_ID` - Replace with a coach user ID
- `YOUR_ATHLETE_ID` - Replace with an athlete user ID
- `SQUAT_EXERCISE_ID` - Replace with your squat exercise ID
- `BENCH_EXERCISE_ID` - Replace with your bench press exercise ID
- `DEADLIFT_EXERCISE_ID` - Replace with your deadlift exercise ID
- `OHP_EXERCISE_ID` - Replace with overhead press ID
- `DB_ROW_EXERCISE_ID` - Replace with dumbbell row ID
- `BOX_SQUAT_EXERCISE_ID` - Replace with box squat ID (or regular squat)
- `RDL_EXERCISE_ID` - Replace with Romanian deadlift ID
- `LEG_CURL_EXERCISE_ID` - Replace with leg curl ID

### Step 3: Run the SQL

1. Open your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the entire contents of `programs-test-data.sql`
4. Paste into the editor
5. Click "Run"

## What Gets Created

### 3 Complete Programs:

1. **Starting Strength (Beginner)**
   - 12 weeks
   - 3 training blocks
   - 3 days/week
   - Focus: Foundation and linear progression

2. **nSuns 5/3/1 LP (Intermediate)**
   - 16 weeks
   - 2 training blocks
   - 4-5 days/week
   - Focus: Volume and strength

3. **Westside for Skinny Bastards (Advanced)**
   - 12 weeks
   - 2 training blocks
   - 4 days/week
   - Focus: Max effort and dynamic training

### Sample Data Includes:
- ✅ Programs with full descriptions
- ✅ Training blocks with progression phases
- ✅ Weekly workout templates
- ✅ Exercise prescriptions (sets, reps, RPE)
- ✅ Athlete enrollments (active, paused, completed)

## Verifying the Data

Run these queries to verify everything was inserted correctly:

```sql
-- Check programs
SELECT id, name, difficulty_level, duration_weeks FROM programs;

-- Check blocks
SELECT p.name as program, pb.name as block, pb.start_week, pb.end_week
FROM program_blocks pb
JOIN programs p ON pb.program_id = p.id
ORDER BY p.name, pb.block_order;

-- Check workouts
SELECT
  p.name as program,
  w.week_number,
  w.day_of_week,
  w.name as workout
FROM workouts w
JOIN program_blocks pb ON w.program_block_id = pb.id
JOIN programs p ON pb.program_id = p.id
WHERE w.week_number = 1
ORDER BY p.name, w.week_number;

-- Check athlete enrollments
SELECT
  ap.status,
  ap.current_week,
  p.name as program
FROM athlete_programs ap
JOIN programs p ON ap.program_id = p.id;
```

## Next Steps

After loading the test data, the app should display:

- **Programs List**: Active, paused, and completed programs
- **Program Details**: Blocks and weekly structure
- **Block View**: Week-by-week workouts
- **Workout View**: Full exercise prescriptions

## Cleaning Up Test Data

To remove all test data:

```sql
-- Delete in reverse order due to foreign keys
DELETE FROM workout_exercises WHERE workout_id LIKE 'workout-%';
DELETE FROM workouts WHERE id LIKE 'workout-%';
DELETE FROM athlete_programs WHERE program_id LIKE 'prog-%';
DELETE FROM program_blocks WHERE id LIKE 'block-%';
DELETE FROM programs WHERE id LIKE 'prog-%';
```
