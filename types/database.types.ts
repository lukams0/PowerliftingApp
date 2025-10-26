// PowerLift Pro Database Types
// This file contains all TypeScript types for the database schema

// ============================================================================
// PHASE 1 TYPES (EXISTING)
// ============================================================================

export type UserRole = 'athlete' | 'coach';
export type GenderType = 'male' | 'female' | 'other';
export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProfile {
  id: string;
  user_id: string;
  age: number | null;
  gender: GenderType | null;
  weight_lbs: number | null;
  height_inches: number | null;
  experience_level: ExperienceLevel | null;
  goals: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface CoachProfile {
  id: string;
  user_id: string;
  bio: string | null;
  specialties: string[] | null;
  years_experience: number | null;
  certifications: string[] | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// PHASE 2 TYPES (EXERCISES & PERSONAL RECORDS)
// ============================================================================

export type ExerciseCategory = 'legs' | 'chest' | 'back' | 'shoulders' | 'arms' | 'core' | 'full_body';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  description: string | null;
  form_notes: string | null;
  video_url: string | null;
  created_by: string | null;
  is_custom: boolean;
  created_at: string;
  updated_at: string;
}

export interface PersonalRecord {
  id: string;
  user_id: string;
  exercise_id: string;
  weight_lbs: number;
  reps: number;
  achieved_at: string;
  notes: string | null;
  created_at: string;
}

// Extended PR with exercise details
export interface PersonalRecordWithExercise extends PersonalRecord {
  exercise: Exercise;
}

export interface BodyWeightLog {
  id: string;
  user_id: string;
  weight_lbs: number;
  logged_at: string;
  notes: string | null;
  created_at: string;
}

// ============================================================================
// PHASE 3 TYPES (WORKOUT TRACKING)
// ============================================================================

export interface WorkoutSession {
  id: string;
  athlete_id: string;
  workout_template_id: string | null;
  name: string;
  start_time: string;
  end_time: string | null;
  duration_minutes: number | null;
  total_volume_lbs: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SessionExercise {
  id: string;
  session_id: string;
  exercise_id: string;
  exercise_order: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExerciseSet {
  id: string;
  session_exercise_id: string;
  set_number: number;
  weight_lbs: number;
  reps: number;
  rpe: number | null;
  completed: boolean;
  created_at: string;
}

// Extended types with related data
export interface WorkoutSessionWithDetails extends WorkoutSession {
  exercises: (SessionExercise & {
    exercise: Exercise;
    sets: ExerciseSet[];
  })[];
}

export interface SessionExerciseWithDetails extends SessionExercise {
  exercise: Exercise;
  sets: ExerciseSet[];
}

// ============================================================================
// PHASE 4 TYPES (PROGRAMS)
// ============================================================================

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';
export type ProgramStatus = 'active' | 'completed' | 'paused';

export interface Program {
  id: string;
  name: string;
  description: string | null;
  coach_id: string;
  duration_weeks: number;
  difficulty_level: DifficultyLevel | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProgramBlock {
  id: string;
  program_id: string;
  name: string;
  description: string | null;
  start_week: number;
  end_week: number;
  focus: string | null;
  block_order: number;
  created_at: string;
  updated_at: string;
}

export interface Workout {
  id: string;
  program_block_id: string | null;
  name: string;
  description: string | null;
  week_number: number | null;
  day_of_week: string | null;
  estimated_duration_minutes: number | null;
  created_by: string | null;
  is_template: boolean;
  created_at: string;
  updated_at: string;
}

export interface WorkoutExercise {
  id: string;
  workout_id: string;
  exercise_id: string;
  exercise_order: number;
  target_sets: number;
  target_reps: string;
  target_weight_lbs: number | null;
  target_rpe: string | null;
  rest_seconds: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface AthleteProgram {
  id: string;
  athlete_id: string;
  program_id: string;
  start_date: string;
  end_date: string | null;
  current_week: number;
  status: ProgramStatus;
  created_at: string;
  updated_at: string;
}

// Extended types with related data
export interface ProgramWithDetails extends Program {
  blocks: (ProgramBlock & {
    workouts: Workout[];
  })[];
}

export interface WorkoutWithExercises extends Workout {
  exercises: (WorkoutExercise & {
    exercise: Exercise;
  })[];
}

export interface AthleteProgramWithDetails extends AthleteProgram {
  program: ProgramWithDetails;
}

export interface ProgramBlockWithWorkouts extends ProgramBlock {
  workouts: Workout[];
}

export interface WorkoutExerciseWithDetails extends WorkoutExercise {
  exercise: Exercise;
}

// ============================================================================
// PHASE 5 TYPES (COACH FEATURES - Future)
// ============================================================================

export type RelationshipStatus = 'pending' | 'active' | 'inactive';

export interface CoachAthleteRelationship {
  id: string;
  coach_id: string;
  athlete_id: string;
  status: RelationshipStatus;
  invited_at: string;
  accepted_at: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// DATABASE TYPE FOR SUPABASE CLIENT
// ============================================================================

export interface Database {
  public: {
    Tables: {
      // Phase 1
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      athlete_profiles: {
        Row: AthleteProfile;
        Insert: Omit<AthleteProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AthleteProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      coach_profiles: {
        Row: CoachProfile;
        Insert: Omit<CoachProfile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CoachProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>;
      };
      // Phase 2
      exercises: {
        Row: Exercise;
        Insert: Omit<Exercise, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Exercise, 'id' | 'created_at' | 'updated_at'>>;
      };
      personal_records: {
        Row: PersonalRecord;
        Insert: Omit<PersonalRecord, 'id' | 'created_at'>;
        Update: Partial<Omit<PersonalRecord, 'id' | 'user_id' | 'exercise_id' | 'created_at'>>;
      };
      body_weight_logs: {
        Row: BodyWeightLog;
        Insert: Omit<BodyWeightLog, 'id' | 'created_at'>;
        Update: Partial<Omit<BodyWeightLog, 'id' | 'user_id' | 'created_at'>>;
      };
      // Phase 3
      workout_sessions: {
        Row: WorkoutSession;
        Insert: Omit<WorkoutSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkoutSession, 'id' | 'athlete_id' | 'created_at' | 'updated_at'>>;
      };
      session_exercises: {
        Row: SessionExercise;
        Insert: Omit<SessionExercise, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<SessionExercise, 'id' | 'session_id' | 'created_at' | 'updated_at'>>;
      };
      exercise_sets: {
        Row: ExerciseSet;
        Insert: Omit<ExerciseSet, 'id' | 'created_at'>;
        Update: Partial<Omit<ExerciseSet, 'id' | 'session_exercise_id' | 'created_at'>>;
      };
      // Phase 4
      programs: {
        Row: Program;
        Insert: Omit<Program, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Program, 'id' | 'coach_id' | 'created_at' | 'updated_at'>>;
      };
      program_blocks: {
        Row: ProgramBlock;
        Insert: Omit<ProgramBlock, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ProgramBlock, 'id' | 'program_id' | 'created_at' | 'updated_at'>>;
      };
      workouts: {
        Row: Workout;
        Insert: Omit<Workout, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Workout, 'id' | 'created_at' | 'updated_at'>>;
      };
      workout_exercises: {
        Row: WorkoutExercise;
        Insert: Omit<WorkoutExercise, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<WorkoutExercise, 'id' | 'workout_id' | 'created_at' | 'updated_at'>>;
      };
      athlete_programs: {
        Row: AthleteProgram;
        Insert: Omit<AthleteProgram, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<AthleteProgram, 'id' | 'athlete_id' | 'program_id' | 'created_at' | 'updated_at'>>;
      };
      // Phase 5
      coach_athlete_relationships: {
        Row: CoachAthleteRelationship;
        Insert: Omit<CoachAthleteRelationship, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<CoachAthleteRelationship, 'id' | 'coach_id' | 'athlete_id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

// Helper type for paginated results
export interface PaginatedResult<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Helper type for API responses
export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  success: boolean;
}

// Helper type for workout statistics
export interface WorkoutStats {
  totalWorkouts: number;
  totalVolume: number;
  averageDuration: number;
  thisWeekWorkouts: number;
  thisMonthWorkouts: number;
}

// Helper type for program statistics
export interface ProgramStats {
  totalPrograms: number;
  activePrograms: number;
  completedPrograms: number;
  completionRate: number;
}