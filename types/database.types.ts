// Phase 1 Types (Existing)
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

// Phase 2 Types (New)
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

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
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
    };
    Functions: {
      get_current_pr: {
        Args: {
          p_user_id: string;
          p_exercise_id: string;
        };
        Returns: {
          weight_lbs: number;
          reps: number;
          achieved_at: string;
        }[];
      };
      get_recent_body_weight: {
        Args: {
          p_user_id: string;
        };
        Returns: number;
      };
    };
  };
}