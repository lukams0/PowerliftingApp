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
    };
  };
}