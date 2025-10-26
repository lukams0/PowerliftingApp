import { supabase } from '../lib/supabase';
import { AthleteProfile, CoachProfile, Profile } from '../types/database.types';

class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  }

  /**
   * Get athlete profile
   */
  async getAthleteProfile(userId: string): Promise<AthleteProfile | null> {
    try {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
      return data;
    } catch (error) {
      console.error('Get athlete profile error:', error);
      throw error;
    }
  }

  /**
   * Update athlete profile
   */
  async updateAthleteProfile(userId: string, updates: Partial<AthleteProfile>) {
    try {
      const { data, error } = await supabase
        .from('athlete_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update athlete profile error:', error);
      throw error;
    }
  }

  /**
   * Get coach profile
   */
  async getCoachProfile(userId: string): Promise<CoachProfile | null> {
    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    } catch (error) {
      console.error('Get coach profile error:', error);
      throw error;
    }
  }

  /**
   * Update coach profile
   */
  async updateCoachProfile(userId: string, updates: Partial<CoachProfile>) {
    try {
      const { data, error } = await supabase
        .from('coach_profiles')
        .update(updates)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update coach profile error:', error);
      throw error;
    }
  }

  /**
   * Get full user profile (includes role-specific profile)
   */
  async getFullProfile(userId: string) {
    try {
      const profile = await this.getProfile(userId);
      if (!profile) return null;

      let roleProfile = null;
      if (profile.role === 'athlete') {
        roleProfile = await this.getAthleteProfile(userId);
      } else {
        roleProfile = await this.getCoachProfile(userId);
      }

      return {
        ...profile,
        roleProfile,
      };
    } catch (error) {
      console.error('Get full profile error:', error);
      throw error;
    }
  }
}

export const profileService = new ProfileService();