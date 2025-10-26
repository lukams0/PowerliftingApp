import { supabase } from '../lib/supabase';
import { PersonalRecord, PersonalRecordWithExercise } from '../types/database.types';

class PersonalRecordService {
  /**
   * Get all personal records for a user
   */
  async getUserPRs(userId: string): Promise<PersonalRecordWithExercise[]> {
    try {
      console.log('Fetching PRs for user:', userId);
      
      const { data, error } = await supabase
        .from('personal_records')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('user_id', userId)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error('Fetch PRs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} PRs`);
      return data as PersonalRecordWithExercise[] || [];
    } catch (error) {
      console.error('Get user PRs error:', error);
      throw error;
    }
  }

  /**
   * Get PR for a specific exercise
   */
  async getExercisePR(userId: string, exerciseId: string): Promise<PersonalRecord | null> {
    try {
      console.log('Fetching PR for exercise:', exerciseId);
      
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .order('weight_lbs', { ascending: false })
        .order('reps', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Fetch exercise PR error:', error);
        throw error;
      }

      console.log('Exercise PR fetched:', !!data);
      return data;
    } catch (error) {
      console.error('Get exercise PR error:', error);
      throw error;
    }
  }

  /**
   * Get top N PRs for a user (by weight)
   */
  async getTopPRs(userId: string, limit: number = 5): Promise<PersonalRecordWithExercise[]> {
    try {
      console.log('Fetching top PRs for user:', userId);
      
      const { data, error } = await supabase
        .from('personal_records')
        .select(`
          *,
          exercise:exercises(*)
        `)
        .eq('user_id', userId)
        .order('weight_lbs', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Fetch top PRs error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} top PRs`);
      return data as PersonalRecordWithExercise[] || [];
    } catch (error) {
      console.error('Get top PRs error:', error);
      throw error;
    }
  }

  /**
   * Get PRs for a specific category of exercises
   */
  async getPRsByCategory(userId: string, category: string): Promise<PersonalRecordWithExercise[]> {
    try {
      console.log('Fetching PRs for category:', category);
      
      const { data, error } = await supabase
        .from('personal_records')
        .select(`
          *,
          exercise:exercises!inner(*)
        `)
        .eq('user_id', userId)
        .eq('exercise.category', category)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error('Fetch PRs by category error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} PRs for category ${category}`);
      return data as PersonalRecordWithExercise[] || [];
    } catch (error) {
      console.error('Get PRs by category error:', error);
      throw error;
    }
  }

  /**
   * Create or update a personal record
   */
  async upsertPR(
    userId: string,
    exerciseId: string,
    pr: {
      weight_lbs: number;
      reps?: number;
      achieved_at?: string;
      notes?: string;
    }
  ): Promise<PersonalRecord> {
    try {
      console.log('Upserting PR for exercise:', exerciseId);
      
      // First, get the current PR to see if this is actually a new PR
      const currentPR = await this.getExercisePR(userId, exerciseId);
      
      // Check if this is actually a PR (higher weight, or same weight with more reps)
      if (currentPR) {
        const isNewPR = 
          pr.weight_lbs > currentPR.weight_lbs ||
          (pr.weight_lbs === currentPR.weight_lbs && (pr.reps || 1) > currentPR.reps);
        
        if (!isNewPR) {
          console.log('Not a new PR, keeping current record');
          return currentPR;
        }
      }

      const { data, error } = await supabase
        .from('personal_records')
        .upsert({
          user_id: userId,
          exercise_id: exerciseId,
          weight_lbs: pr.weight_lbs,
          reps: pr.reps || 1,
          achieved_at: pr.achieved_at || new Date().toISOString(),
          notes: pr.notes,
        }, {
          onConflict: 'user_id,exercise_id',
        })
        .select()
        .single();

      if (error) {
        console.error('Upsert PR error:', error);
        throw error;
      }

      console.log('PR upserted successfully');
      return data;
    } catch (error) {
      console.error('Upsert PR error:', error);
      throw error;
    }
  }

  /**
   * Delete a personal record
   */
  async deletePR(prId: string): Promise<void> {
    try {
      console.log('Deleting PR:', prId);
      
      const { error } = await supabase
        .from('personal_records')
        .delete()
        .eq('id', prId);

      if (error) {
        console.error('Delete PR error:', error);
        throw error;
      }

      console.log('PR deleted successfully');
    } catch (error) {
      console.error('Delete PR error:', error);
      throw error;
    }
  }

  /**
   * Get PR history for an exercise (all records over time)
   */
  async getExercisePRHistory(userId: string, exerciseId: string): Promise<PersonalRecord[]> {
    try {
      console.log('Fetching PR history for exercise:', exerciseId);
      
      const { data, error } = await supabase
        .from('personal_records')
        .select('*')
        .eq('user_id', userId)
        .eq('exercise_id', exerciseId)
        .order('achieved_at', { ascending: false });

      if (error) {
        console.error('Fetch PR history error:', error);
        throw error;
      }

      console.log(`Fetched ${data?.length || 0} PR history records`);
      return data || [];
    } catch (error) {
      console.error('Get exercise PR history error:', error);
      throw error;
    }
  }

  /**
   * Check if a lift would be a new PR
   */
  async wouldBeNewPR(
    userId: string,
    exerciseId: string,
    weight: number,
    reps: number = 1
  ): Promise<boolean> {
    try {
      const currentPR = await this.getExercisePR(userId, exerciseId);
      
      if (!currentPR) {
        return true; // First time doing this exercise
      }

      return (
        weight > currentPR.weight_lbs ||
        (weight === currentPR.weight_lbs && reps > currentPR.reps)
      );
    } catch (error) {
      console.error('Would be new PR check error:', error);
      throw error;
    }
  }
}

export const personalRecordService = new PersonalRecordService();