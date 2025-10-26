import { supabase } from '../lib/supabase';
import { AthleteProfile, CoachProfile, Profile } from '../types/database.types';

// Timeout for queries (5 seconds)
const QUERY_TIMEOUT = 5000;

// Helper to add timeout to promises (works with Promise or PromiseLike)
function withTimeout<T>(promise: PromiseLike<T>, timeoutMs: number): Promise<T> {
  return Promise.race([
    Promise.resolve(promise), // normalize PromiseLike -> Promise
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Query timeout')), timeoutMs)
    ),
  ]);
}


class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(userId: string): Promise<Profile | null> {
    try {
      console.log('Fetching profile for user:', userId);
      console.time('profile-fetch');
      
      const query = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('profile-fetch');

      if (error) {
        // PGRST116 means no rows returned - profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Profile not found (PGRST116)');
          return null;
        }
        console.error('Profile fetch error:', error);
        console.error('Error details:', {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }
      
      console.log('Profile fetched successfully:', {
        id: data.id,
        email: data.email,
        role: data.role,
      });
      return data;
    } catch (error: any) {
      console.error('Get profile error:', error);
      
      // If it's a timeout, log it specifically
      if (error.message === 'Query timeout') {
        console.error('❌ Profile fetch timed out after', QUERY_TIMEOUT / 1000, 'seconds');
        console.error('This might indicate a database connection issue or slow query');
      }
      
      throw error;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, updates: Partial<Profile>) {
    try {
      console.log('Updating profile for user:', userId);
      console.time('profile-update');
      
      const query = supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('profile-update');

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }
      
      console.log('Profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('Update profile error:', error);
      
      if (error.message === 'Query timeout') {
        console.error('❌ Profile update timed out');
      }
      
      throw error;
    }
  }

  /**
   * Get athlete profile
   */
  async getAthleteProfile(userId: string): Promise<AthleteProfile | null> {
    try {
      console.log('Fetching athlete profile for user:', userId);
      console.time('athlete-profile-fetch');
      
      const query = supabase
        .from('athlete_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('athlete-profile-fetch');

      if (error) {
        // PGRST116 means no rows returned - profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Athlete profile not found (PGRST116)');
          return null;
        }
        console.error('Athlete profile fetch error:', error);
        throw error;
      }
      
      console.log('Athlete profile fetched successfully');
      return data;
    } catch (error: any) {
      console.error('Get athlete profile error:', error);
      
      if (error.message === 'Query timeout') {
        console.error('❌ Athlete profile fetch timed out');
      }
      
      throw error;
    }
  }

  /**
   * Update athlete profile
   */
  async updateAthleteProfile(userId: string, updates: Partial<AthleteProfile>) {
    try {
      console.log('Updating athlete profile for user:', userId);
      console.time('athlete-profile-update');
      
      const query = supabase
        .from('athlete_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('athlete-profile-update');

      if (error) {
        console.error('Athlete profile update error:', error);
        throw error;
      }
      
      console.log('Athlete profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('Update athlete profile error:', error);
      
      if (error.message === 'Query timeout') {
        console.error('❌ Athlete profile update timed out');
      }
      
      throw error;
    }
  }

  /**
   * Get coach profile
   */
  async getCoachProfile(userId: string): Promise<CoachProfile | null> {
    try {
      console.log('Fetching coach profile for user:', userId);
      console.time('coach-profile-fetch');
      
      const query = supabase
        .from('coach_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('coach-profile-fetch');

      if (error) {
        // PGRST116 means no rows returned - profile doesn't exist yet
        if (error.code === 'PGRST116') {
          console.log('Coach profile not found (PGRST116)');
          return null;
        }
        console.error('Coach profile fetch error:', error);
        throw error;
      }
      
      console.log('Coach profile fetched successfully');
      return data;
    } catch (error: any) {
      console.error('Get coach profile error:', error);
      
      if (error.message === 'Query timeout') {
        console.error('❌ Coach profile fetch timed out');
      }
      
      throw error;
    }
  }

  /**
   * Update coach profile
   */
  async updateCoachProfile(userId: string, updates: Partial<CoachProfile>) {
    try {
      console.log('Updating coach profile for user:', userId);
      console.time('coach-profile-update');
      
      const query = supabase
        .from('coach_profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', userId)
        .select()
        .single();

      const { data, error } = await withTimeout(query, QUERY_TIMEOUT);
      
      console.timeEnd('coach-profile-update');

      if (error) {
        console.error('Coach profile update error:', error);
        throw error;
      }
      
      console.log('Coach profile updated successfully');
      return data;
    } catch (error: any) {
      console.error('Update coach profile error:', error);
      
      if (error.message === 'Query timeout') {
        console.error('❌ Coach profile update timed out');
      }
      
      throw error;
    }
  }

  /**
   * Get full user profile (includes role-specific profile)
   */
  async getFullProfile(userId: string) {
    try {
      console.log('Fetching full profile for user:', userId);
      
      const profile = await this.getProfile(userId);
      if (!profile) {
        console.log('Base profile not found');
        return null;
      }

      let roleProfile = null;
      if (profile.role === 'athlete') {
        roleProfile = await this.getAthleteProfile(userId);
      } else {
        roleProfile = await this.getCoachProfile(userId);
      }

      console.log('Full profile fetched successfully');
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